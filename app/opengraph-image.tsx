import { ImageResponse } from 'next/og';

export const alt = 'Prem Saktheesh - AI & Cloud Transformation Leader';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '32px',
            }}
          >
            PS
          </div>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#f8fafc',
              textAlign: 'center',
              margin: '0',
              lineHeight: 1.2,
            }}
          >
            Prem Saktheesh
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              textAlign: 'center',
              margin: '16px 0 0 0',
            }}
          >
            AI & Cloud Transformation Leader
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '40px',
            }}
          >
            <span
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: '1px solid #3b82f6',
                color: '#60a5fa',
                fontSize: '18px',
              }}
            >
              Enterprise AI
            </span>
            <span
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: '1px solid #8b5cf6',
                color: '#a78bfa',
                fontSize: '18px',
              }}
            >
              Cloud Architecture
            </span>
            <span
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                border: '1px solid #3b82f6',
                color: '#60a5fa',
                fontSize: '18px',
              }}
            >
              Tech Leadership
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
