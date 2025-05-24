export const Header = () => {
  return (
    <header
      className="py-6 px-8 bg-gray-50 border-b-2 border-gray-200 mb-8"
    >
      <h1 className="m-0 text-3xl font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Audio Visualizer
      </h1>
      <p className="mt-2 text-base text-gray-500 text-center">
        音楽に合わせたリアルタイムビジュアライザー
      </p>
    </header>
  );
};
