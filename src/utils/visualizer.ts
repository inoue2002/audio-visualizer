import type { ActiveRange, VisualParams } from '../types/visualizer';

// データを補間して滑らかに拡張
export const interpolateData = (sourceData: number[], targetLength: number): number[] => {
  if (sourceData.length === 0) return [];
  if (sourceData.length >= targetLength) return sourceData.slice(0, targetLength);

  const result: number[] = [];
  const ratio = (sourceData.length - 1) / (targetLength - 1);

  for (let i = 0; i < targetLength; i++) {
    const srcIndex = i * ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, sourceData.length - 1);
    const fraction = srcIndex - srcIndexFloor;

    // 線形補間
    const interpolatedValue = sourceData[srcIndexFloor] * (1 - fraction) + sourceData[srcIndexCeil] * fraction;
    result.push(interpolatedValue);
  }

  return result;
};

// 拡張された波形を描画
export const drawExpandedWaveform = (
  ctx: CanvasRenderingContext2D,
  data: Uint8Array,
  canvasWidth: number,
  canvasHeight: number,
  range: ActiveRange,
  params: VisualParams
) => {
  const waveformWidth = canvasWidth * 0.99;
  const waveformHeight = params.waveformHeight;
  const targetBars = params.targetBars;

  const startX = (canvasWidth - waveformWidth) / 2;

  // 波形位置に応じてstartYとcenterYを計算
  let startY: number;
  let centerY: number;

  switch (params.waveformPosition) {
    case 'upper':
      startY = canvasHeight * 0.15; // 上部15%の位置
      centerY = startY + waveformHeight / 2;
      break;
    case 'lower':
      startY = canvasHeight * 0.85 - waveformHeight; // 下部15%の位置（波形の高さを考慮）
      centerY = startY + waveformHeight / 2;
      break;
    case 'center':
    default:
      startY = (canvasHeight - waveformHeight) / 2;
      centerY = startY + waveformHeight / 2;
      break;
  }

  // 中央線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, centerY);
  ctx.lineTo(startX + waveformWidth, centerY);
  ctx.stroke();

  // アクティブ範囲のデータを抽出
  const activeData = Array.from(data).slice(range.start, range.end + 1);

  // バー幅を計算
  const barWidth = Math.max(2, Math.floor(waveformWidth / targetBars));
  const gap = Math.max(1, Math.floor(barWidth * params.gapRatio));

  // 補間してバー数を増やす
  const interpolatedData = interpolateData(activeData, targetBars);

  // アクティブデータの最大値を取得してスケーリング
  const maxInActiveData = Math.max(...interpolatedData);
  const minInActiveData = Math.min(...interpolatedData);
  const dataRange = Math.max(maxInActiveData - minInActiveData, 1);

  for (let i = 0; i < targetBars && i < interpolatedData.length; i++) {
    const value = interpolatedData[i];

    // 適度な正規化
    let normalizedValue = (value - minInActiveData) / dataRange;

    // 軽い強調に変更（0.6 → 0.8で自然に）
    normalizedValue = Math.pow(normalizedValue, params.emphasisPower);

    // 最小値を少し下げる（0.1 → 0.05）
    normalizedValue = Math.max(params.minValue, normalizedValue);

    // 適度な高さ計算（0.8 → 0.6に調整）
    const halfBarHeight = Math.max(2, (normalizedValue * waveformHeight * params.heightRatio) / 2);

    const x = startX + i * (barWidth + gap);

    // 適度なカラーグラデーション
    let color: string;

    if (params.colorMode === 'rainbow') {
      // 虹色の場合はHSLで色相を変化
      const hue = (i / targetBars) * 360;
      const saturation = 80 + normalizedValue * 20;
      const lightness = 30 + normalizedValue * 50;
      color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    } else {
      // 単色の場合は単色を使用
      color = params.singleColor;
    }

    ctx.fillStyle = color;

    // 通常の描画のみ（グロー効果を削除）
    ctx.fillRect(x, centerY - halfBarHeight, barWidth, halfBarHeight);
    ctx.fillRect(x, centerY, barWidth, halfBarHeight);
  }
};
