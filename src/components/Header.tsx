export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200 mb-8">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          🎵 Audio Visualizer
        </h1>
        <p className="text-center text-lg text-slate-600 mt-3 font-medium">
          音楽に合わせたリアルタイムビジュアライザー
        </p>
      </div>
    </header>
  );
};
