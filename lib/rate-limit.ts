// This is an instance-local guard. Multi-instance deployments also need an edge/WAF limit.
const requests = new Map<string, { count: number; expires: number }>();
export function allowEnquiry(key: string, now = Date.now()): boolean {
  for (const [id, entry] of requests) if (entry.expires <= now) requests.delete(id);
  const entry = requests.get(key);
  if (entry) {
    if (entry.count >= 5) return false;
    entry.count += 1;
    return true;
  }
  if (requests.size >= 10000) return false;
  requests.set(key, { count: 1, expires: now + 600000 });
  return true;
}
