import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const HelpSection = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">📖 使い方</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          
          {/* 基本的な使い方 */}
          <AccordionItem value="basics">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎵</span>
                <span className="font-semibold">基本的な使い方</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>
                    <strong className="text-blue-700">音楽ファイルを選択</strong> - 「ファイルを選択」ボタンからMP3、WAV等の音楽ファイルをアップロード
                  </li>
                  <li>
                    <strong className="text-blue-700">再生&録画開始</strong> - ボタンをクリックすると音楽再生とビジュアライザーの録画が同時に開始
                  </li>
                  <li>
                    <strong className="text-blue-700">自動完了</strong> - 音楽が終わると自動的に録画が停止され、動画ファイルがダウンロード
                  </li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 設定とカスタマイズ */}
          <AccordionItem value="settings">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <span className="font-semibold">設定とカスタマイズ</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    <strong className="text-blue-700">パラメーター調整</strong> - ⚙️ボタンで詳細設定を開き、波形の高さ、バーの数、色などを調整
                  </li>
                  <li>
                    <strong className="text-blue-700">色の選択</strong> - 虹色または単色から選択可能
                  </li>
                  <li>
                    <strong className="text-blue-700">設定の保存</strong> - 調整した設定は自動的に保存され、次回起動時に復元
                  </li>
                  <li>
                    <strong className="text-blue-700">デフォルトに戻す</strong> - 設定パネル内のボタンで初期設定に戻せます
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* トラブルシューティング */}
          <AccordionItem value="troubleshoot">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔧</span>
                <span className="font-semibold">トラブルシューティング</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    <strong className="text-red-600">音が出ない</strong> - ブラウザの音量設定を確認してください
                  </li>
                  <li>
                    <strong className="text-red-600">再生エラー</strong> - 「オーディオリセット」ボタンでリセットしてから再試行
                  </li>
                  <li>
                    <strong className="text-red-600">録画できない</strong> - ブラウザが最新版かご確認ください（Chrome、Firefox推奨）
                  </li>
                </ul>
                
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>💡 ヒント:</strong> モックモード（音楽未選択時）でパラメーターの効果をプレビューできます
                  </AlertDescription>
                </Alert>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
};
