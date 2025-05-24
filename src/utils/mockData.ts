// モックの周波数データを生成
export const generateMockFrequencyData = (startTime: number): Uint8Array => {
  const time = (Date.now() - startTime) / 1000; // 秒単位の経過時間
  const dataLength = 128; // 標準的な周波数データの長さ
  const mockData = new Uint8Array(dataLength);

  for (let i = 0; i < dataLength; i++) {
    // 複数の波を組み合わせて自然な周波数スペクトラムを模擬
    const freq1 = Math.sin(time * 2 + i * 0.1) * 50;
    const freq2 = Math.sin(time * 3 + i * 0.05) * 30;
    const freq3 = Math.sin(time * 1.5 + i * 0.15) * 20;

    // 低周波数ほど振幅が大きい傾向を模擬
    const baseAmplitude = Math.max(0, 100 - i * 0.8);

    // ランダムなノイズを追加
    const noise = (Math.random() - 0.5) * 10;

    const value = baseAmplitude + freq1 + freq2 + freq3 + noise;
    mockData[i] = Math.max(0, Math.min(255, value));
  }

  return mockData;
};
