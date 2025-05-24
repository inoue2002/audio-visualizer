import { useEffect, useState } from 'react';
import type { VisualParams } from '../types/visualizer';

// デフォルトのビジュアルパラメータ
const defaultVisualParams: VisualParams = {
  threshold: 24, // 動きの閾値
  minWidthRatio: 0.3, // 最小幅の係数
  waveformHeight: 313, // 波形の高さ
  targetBars: 211, // バーの数
  gapRatio: 1.0, // バー間隔の係数
  emphasisPower: 1.4, // 強調の係数
  minValue: 0.05, // 最小値
  heightRatio: 1.0, // 高さの係数
  colorMode: 'single', // 色モード：虹色 or 単色
  singleColor: '#ffffff', // 単色の場合の色
  waveformPosition: 'center', // 波形の表示位置
};

// ローカルストレージのキー
const STORAGE_KEY = 'audio-visualizer-params';

// ローカルストレージから設定を読み込む関数
const loadParamsFromStorage = (): VisualParams => {
  try {
    const savedParams = localStorage.getItem(STORAGE_KEY);
    if (savedParams) {
      const parsed = JSON.parse(savedParams);
      // デフォルト値とマージして、新しいプロパティがあっても対応
      return { ...defaultVisualParams, ...parsed };
    }
  } catch (error) {
    console.error('設定の読み込みエラー:', error);
  }
  return defaultVisualParams;
};

// パラメータを保存する関数
const saveParamsToStorage = (params: VisualParams) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch (error) {
    console.error('設定の保存エラー:', error);
  }
};

export const useVisualParams = () => {
  const [visualParams, setVisualParams] = useState<VisualParams>(loadParamsFromStorage);

  // パラメータが変更されたときに自動保存
  useEffect(() => {
    saveParamsToStorage(visualParams);
  }, [visualParams]);

  // デフォルト設定に戻す関数
  const resetToDefault = () => {
    setVisualParams(defaultVisualParams);
  };

  return {
    visualParams,
    setVisualParams,
    resetToDefault,
    defaultVisualParams,
  };
};
