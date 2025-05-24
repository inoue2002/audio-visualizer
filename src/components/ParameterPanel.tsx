import type { VisualParams } from '../types/visualizer';

interface ParameterPanelProps {
  visualParams: VisualParams;
  setVisualParams: React.Dispatch<React.SetStateAction<VisualParams>>;
  resetToDefault: () => void;
}

export const ParameterPanel = ({ visualParams, setVisualParams, resetToDefault }: ParameterPanelProps) => {
  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>ビジュアルパラメータ調整</h3>
        <button
          onClick={resetToDefault}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          デフォルトに戻す
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
        <div>
          <label>動きの閾値: {visualParams.threshold}</label>
          <input
            type="range"
            min="1"
            max="50"
            value={visualParams.threshold}
            onChange={(e) => setVisualParams((prev) => ({ ...prev, threshold: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>波形の高さ: {visualParams.waveformHeight}</label>
          <input
            type="range"
            min="50"
            max="400"
            value={visualParams.waveformHeight}
            onChange={(e) => setVisualParams((prev) => ({ ...prev, waveformHeight: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>バーの数: {visualParams.targetBars}</label>
          <input
            type="range"
            min="50"
            max="500"
            value={visualParams.targetBars}
            onChange={(e) => setVisualParams((prev) => ({ ...prev, targetBars: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>バー間隔: {visualParams.gapRatio.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={visualParams.gapRatio}
            onChange={(e) => setVisualParams((prev) => ({ ...prev, gapRatio: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>強調係数: {visualParams.emphasisPower.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={visualParams.emphasisPower}
            onChange={(e) => setVisualParams((prev) => ({ ...prev, emphasisPower: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>高さ係数: {visualParams.heightRatio.toFixed(2)}</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={visualParams.heightRatio}
            onChange={(e) => setVisualParams((prev) => ({ ...prev, heightRatio: Number(e.target.value) }))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>色モード</label>
          <select
            value={visualParams.colorMode}
            onChange={(e) =>
              setVisualParams((prev) => ({ ...prev, colorMode: e.target.value as 'rainbow' | 'single' }))
            }
          >
            <option value="rainbow">虹色</option>
            <option value="single">単色</option>
          </select>
        </div>
        {visualParams.colorMode === 'single' && (
          <div>
            <label>単色: {visualParams.singleColor}</label>
            <input
              type="color"
              value={visualParams.singleColor}
              onChange={(e) => setVisualParams((prev) => ({ ...prev, singleColor: e.target.value }))}
            />
          </div>
        )}
        <div>
          <label>波形の表示位置</label>
          <select
            value={visualParams.waveformPosition}
            onChange={(e) =>
              setVisualParams((prev) => ({
                ...prev,
                waveformPosition: e.target.value as 'upper' | 'center' | 'lower',
              }))
            }
          >
            <option value="upper">上部</option>
            <option value="center">中央</option>
            <option value="lower">下部</option>
          </select>
        </div>
      </div>
    </div>
  );
};
