import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '36px',
          fontSize: '80px',
          fontWeight: 'bold',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        PS
      </div>
    ),
    { ...size }
  );
}
