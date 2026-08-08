import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e1a',
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 900,
        letterSpacing: -1.5,
        paddingTop: 2,
      }}
    >
      <div style={{ display: 'flex' }}>ES</div>
      <div
        style={{
          display: 'flex',
          width: 12,
          height: 2,
          background: '#3b82f6',
          marginTop: 2,
        }}
      />
    </div>,
    { ...size },
  );
}
