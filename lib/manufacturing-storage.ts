import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { findManufacturingService } from '../data/manufacturing';

export function enquiryDirectory() {
  const directory = process.env.MANUFACTURING_ENQUIRY_DIR;
  if (!directory || !path.isAbsolute(directory)) throw new Error('STORAGE_NOT_CONFIGURED');
  const root = path.resolve(directory);
  const publicRoot = path.resolve('public');
  if (root === publicRoot || root.startsWith(publicRoot + path.sep))
    throw new Error('UNSAFE_STORAGE');
  return root;
}

// Replace this boundary with private object storage + a database when hosting without a durable volume.
// A complete directory is published atomically so a retry cannot create a partial or duplicate enquiry.
export async function recordManufacturingEnquiry(
  id: string,
  data: Record<string, string>,
  files: File[],
) {
  const root = enquiryDirectory();
  const content = await Promise.all(
    files.map(async (file) => Buffer.from(await file.arrayBuffer())),
  );
  const fingerprint = createHash('sha256').update(JSON.stringify(data));
  files.forEach((file, i) =>
    fingerprint.update(JSON.stringify([file.name, file.size])).update(content[i]),
  );
  const digest = fingerprint.digest('hex');
  const destination = path.join(root, id);
  async function existing() {
    try {
      const record = JSON.parse(await readFile(path.join(destination, 'enquiry.json'), 'utf8'));
      if (record.digest !== digest) throw new Error('IDEMPOTENCY_CONFLICT');
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
      throw error;
    }
  }
  if (await existing()) return id;
  await mkdir(root, { recursive: true, mode: 0o700 });
  const staging = path.join(root, `.pending-${randomUUID()}`);
  await mkdir(staging, { mode: 0o700 });
  try {
    const uploads = await Promise.all(
      files.map(async (file, i) => {
        const storedName = `${i + 1}.${file.name.split('.').pop()!.toLowerCase()}`;
        await writeFile(path.join(staging, storedName), content[i], { mode: 0o600 });
        return { originalName: file.name, size: file.size, reference: `${id}/${storedName}` };
      }),
    );
    await writeFile(
      path.join(staging, 'enquiry.json'),
      JSON.stringify(
        {
          version: 1,
          id,
          digest,
          createdAt: new Date().toISOString(),
          serviceName: findManufacturingService(data.service)!.name,
          data,
          files: uploads,
        },
        null,
        2,
      ),
      { mode: 0o600 },
    );
    try {
      await rename(staging, destination);
    } catch (error) {
      if (!(await existing())) throw error;
    }
    return id;
  } finally {
    // Only remove the exact private staging directory created by this request.
    await rm(staging, { recursive: true, force: true });
  }
}
