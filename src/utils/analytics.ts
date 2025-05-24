// Google Analytics 4 ユーティリティ関数

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// ページビューを記録
export const trackPageView = (page_title: string, page_location?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-YXP1JP4RNB', {
      page_title,
      page_location: page_location || window.location.href,
    });
  }
};

// カスタムイベントを記録
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 音楽関連のイベント
export const trackMusicEvent = {
  // 音楽ファイル選択
  fileSelected: (fileName: string, fileSize: number) => {
    trackEvent('file_selected', 'music', fileName, Math.round(fileSize / 1024 / 1024));
  },

  // 再生開始
  playStarted: (fileName?: string) => {
    trackEvent('play_started', 'music', fileName);
  },

  // 録画開始
  recordingStarted: (hasAudio: boolean) => {
    trackEvent('recording_started', 'recording', hasAudio ? 'with_audio' : 'video_only');
  },

  // 録画完了
  recordingCompleted: (duration: number, hasAudio: boolean) => {
    trackEvent('recording_completed', 'recording', hasAudio ? 'with_audio' : 'video_only', duration);
  },

  // パラメータ変更
  parameterChanged: (parameterName: string, value: number | string) => {
    trackEvent('parameter_changed', 'customization', parameterName, typeof value === 'number' ? value : undefined);
  },

  // エラー発生
  errorOccurred: (errorType: string, errorMessage?: string) => {
    trackEvent('error_occurred', 'error', `${errorType}: ${errorMessage || 'unknown'}`);
  },
};
