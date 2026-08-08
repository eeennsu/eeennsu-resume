import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
        fontSize: 108,
        fontWeight: 900,
        letterSpacing: -8,
        paddingTop: 8,
      }}
    >
      <div style={{ display: 'flex' }}>ES</div>
      <div
        style={{
          display: 'flex',
          width: 64,
          height: 10,
          background: '#3b82f6',
          marginTop: 12,
          borderRadius: 2,
        }}
      />
    </div>,
    { ...size },
  );
}
