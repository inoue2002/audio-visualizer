export const Footer = () => {
  return (
    <footer className="mt-12 py-8 border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <a 
              href="https://github.com/inoue2002/audio-visualizer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              📂 GitHub
            </a>
            <a 
              href="https://github.com/inoue2002/audio-visualizer/blob/main/PRIVACY.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              🔒 プライバシーポリシー
            </a>
            <a 
              href="https://github.com/inoue2002/audio-visualizer/blob/main/README.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              📖 使い方詳細
            </a>
            <a 
              href="https://github.com/inoue2002/audio-visualizer/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              🐛 バグ報告
            </a>
          </div>
          
          <div className="text-center">
            <p className="text-slate-600 font-medium">
              ©️ inoue2002 - Audio Visualizer
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
