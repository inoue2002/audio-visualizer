export const Header = () => {
  return (
    <header
      style={{
        padding: '1.5rem 2rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #e9ecef',
        marginBottom: '2rem',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#2c3e50',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Audio Visualizer
      </h1>
      <p
        style={{
          margin: '0.5rem 0 0 0',
          fontSize: '1rem',
          color: '#6c757d',
          textAlign: 'center',
        }}
      >
        音楽に合わせたリアルタイムビジュアライザー
      </p>
    </header>
  );
};
