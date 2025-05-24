interface ConversionProgressProps {
  isConverting: boolean;
  conversionProgress: number;
  conversionStatus: string;
}

export const ConversionProgress = ({ isConverting, conversionProgress, conversionStatus }: ConversionProgressProps) => {
  if (!isConverting) return null;

  return (
    <div
      style={{
        marginTop: '0.5rem',
        padding: '1rem',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '8px',
      }}
    >
      <div style={{ fontSize: '1rem', color: '#856404', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        🔄 {conversionStatus || 'MP4変換中...'}
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <div
          style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e9ecef',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${conversionProgress}%`,
              height: '100%',
              backgroundColor: conversionProgress >= 90 ? '#28a745' : conversionProgress >= 50 ? '#ffc107' : '#17a2b8',
              transition: 'width 0.3s ease, background-color 0.3s ease',
              borderRadius: '10px',
            }}
          />
        </div>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#6c757d',
            marginTop: '0.25rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>進行度: {conversionProgress}%</span>
          <span>
            {conversionProgress < 15 ? '準備中...' : conversionProgress < 90 ? 'エンコード中...' : '仕上げ中...'}
          </span>
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: '#856404' }}>
        💡 初回変換時はFFmpeg.wasmのダウンロードで時間がかかる場合があります
      </div>
    </div>
  );
};
