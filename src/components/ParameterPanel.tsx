import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { VisualParams } from '../types/visualizer';
import { trackMusicEvent } from '../utils/analytics';

interface ParameterPanelProps {
  visualParams: VisualParams;
  setVisualParams: React.Dispatch<React.SetStateAction<VisualParams>>;
  resetToDefault: () => void;
}

export const ParameterPanel = ({ visualParams, setVisualParams, resetToDefault }: ParameterPanelProps) => {
  const handleParameterChange = (paramName: keyof VisualParams, value: number | string) => {
    setVisualParams((prev) => ({ ...prev, [paramName]: value }));

    // Google Analytics: パラメーター変更をトラッキング
    trackMusicEvent.parameterChanged(paramName, value);
  };

  const handleResetToDefault = () => {
    resetToDefault();

    // Google Analytics: デフォルトリセットをトラッキング
    trackMusicEvent.parameterChanged('reset_to_default', 'all_parameters');
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">⚙️ ビジュアルパラメータ調整</CardTitle>
          <Button onClick={handleResetToDefault} variant="destructive" size="sm">
            🔄 デフォルトに戻す
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 動きの閾値 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              動きの閾値: <span className="font-bold text-blue-600">{visualParams.threshold}</span>
            </Label>
            <Slider
              value={[visualParams.threshold]}
              onValueChange={(values) => handleParameterChange('threshold', values[0])}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          {/* 波形の高さ */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              波形の高さ: <span className="font-bold text-blue-600">{visualParams.waveformHeight}</span>
            </Label>
            <Slider
              value={[visualParams.waveformHeight]}
              onValueChange={(values) => handleParameterChange('waveformHeight', values[0])}
              min={50}
              max={400}
              step={1}
              className="w-full"
            />
          </div>

          {/* バーの数 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              バーの数: <span className="font-bold text-blue-600">{visualParams.targetBars}</span>
            </Label>
            <Slider
              value={[visualParams.targetBars]}
              onValueChange={(values) => handleParameterChange('targetBars', values[0])}
              min={50}
              max={500}
              step={1}
              className="w-full"
            />
          </div>

          {/* バー間隔 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              バー間隔: <span className="font-bold text-blue-600">{visualParams.gapRatio.toFixed(2)}</span>
            </Label>
            <Slider
              value={[visualParams.gapRatio]}
              onValueChange={(values) => handleParameterChange('gapRatio', values[0])}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* 強調係数 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              強調係数: <span className="font-bold text-blue-600">{visualParams.emphasisPower.toFixed(2)}</span>
            </Label>
            <Slider
              value={[visualParams.emphasisPower]}
              onValueChange={(values) => handleParameterChange('emphasisPower', values[0])}
              min={0.1}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* 高さ係数 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              高さ係数: <span className="font-bold text-blue-600">{visualParams.heightRatio.toFixed(2)}</span>
            </Label>
            <Slider
              value={[visualParams.heightRatio]}
              onValueChange={(values) => handleParameterChange('heightRatio', values[0])}
              min={0.1}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* 色モード */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">色モード</Label>
            <Select
              value={visualParams.colorMode}
              onValueChange={(value) => handleParameterChange('colorMode', value as 'rainbow' | 'single')}
            >
              <SelectTrigger>
                <SelectValue placeholder="色モードを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rainbow">🌈 虹色</SelectItem>
                <SelectItem value="single">🎨 単色</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 単色選択 */}
          {visualParams.colorMode === 'single' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                単色:{' '}
                <span className="font-bold" style={{ color: visualParams.singleColor }}>
                  {visualParams.singleColor}
                </span>
              </Label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={visualParams.singleColor}
                  onChange={(e) => handleParameterChange('singleColor', e.target.value)}
                  className="w-16 h-10 rounded-md border border-input cursor-pointer"
                />
                <div className="text-xs text-muted-foreground">カラーピッカーをクリック</div>
              </div>
            </div>
          )}

          {/* 波形の表示位置 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">波形の表示位置</Label>
            <Select
              value={visualParams.waveformPosition}
              onValueChange={(value) =>
                handleParameterChange('waveformPosition', value as 'upper' | 'center' | 'lower')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="表示位置を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upper">⬆️ 上部</SelectItem>
                <SelectItem value="center">🎯 中央</SelectItem>
                <SelectItem value="lower">⬇️ 下部</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
