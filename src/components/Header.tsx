export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200 mb-8">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            🎵 Audio Visualizer
          </h1>

          <p className="text-xl text-slate-700 font-semibold">音楽を美しいビジュアルに変換・録画</p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 max-w-4xl mx-auto">
            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              🟢 <span className="font-medium">グリーンスクリーン背景</span>
            </div>
            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              🎬 <span className="font-medium">音声付きMP4出力</span>
            </div>
            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              🎨 <span className="font-medium">完全カスタマイズ</span>
            </div>
            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              🔒 <span className="font-medium">完全ローカル処理</span>
            </div>
          </div>

          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            音声ファイルをアップロードして、リアルタイムで美しい波形ビジュアライゼーションを生成。
            <br />
            動画編集に最適なグリーンスクリーン背景で、あなたの創作活動をサポートします。
          </p>
        </div>
      </div>
    </header>
  );
};
