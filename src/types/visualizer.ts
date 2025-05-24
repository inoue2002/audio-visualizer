export interface VisualParams {
  threshold: number; // 動きの閾値
  minWidthRatio: number; // 最小幅の係数
  waveformHeight: number; // 波形の高さ
  targetBars: number; // バーの数
  gapRatio: number; // バー間隔の係数
  emphasisPower: number; // 強調の係数
  minValue: number; // 最小値
  heightRatio: number; // 高さの係数
  colorMode: 'rainbow' | 'single'; // 色モード：虹色 or 単色
  singleColor: string; // 単色の場合の色
  waveformPosition: 'upper' | 'center' | 'lower'; // 波形の表示位置
}

export interface ActiveRange {
  start: number;
  end: number;
}

export interface HelpSections {
  basics: boolean;
  settings: boolean;
  troubleshoot: boolean;
}
