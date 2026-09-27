import { ImageResponse } from 'next/og';
export const alt = 'Tenacom — Engineering intelligence into the physical world.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#07172d',
        color: '#fff',
        width: '100%',
        height: '100%',
        padding: '75px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', fontSize: 32, letterSpacing: -1 }}>tenacom</div>
      <div
        style={{
          display: 'flex',
          fontSize: 64,
          letterSpacing: -2,
          lineHeight: 1.12,
          maxWidth: 950,
        }}
      >
        Engineering intelligence into the physical world.
      </div>
      <div style={{ display: 'flex', fontSize: 20, color: '#75c8f8' }}>
        Physical systems. Digital intelligence. / South Africa
      </div>
    </div>,
    size,
  );
}
