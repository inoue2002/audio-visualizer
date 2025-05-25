import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const HelpSection = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">📖 使い方ガイド</CardTitle>
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
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">📱 簡単3ステップ</h4>
                  <ol className="list-decimal list-inside space-y-2 text-blue-700">
                    <li>
                      <strong>音楽ファイルをアップロード</strong> - 「🎵 音楽ファイルを選択」ボタンでMP3、WAVなどをアップロード
                    </li>
                    <li>
                      <strong>お好みの設定に調整</strong> - ⚙️パラメーター設定で色、波形の形、位置などをカスタマイズ
                    </li>
                    <li>
                      <strong>録画開始</strong> - 「🔴 再生&録画開始」で音楽再生と録画が同時スタート
                    </li>
                  </ol>
                </div>
                
                <div className="space-y-2 text-gray-700">
                  <p><strong className="text-green-600">✅ 自動完了:</strong> 音楽が終わると録画も自動停止し、MP4ファイルがダウンロードされます</p>
                  <p><strong className="text-blue-600">🎨 リアルタイムプレビュー:</strong> 音楽なしでもパラメーターの効果を確認できます</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* グリーンスクリーン背景について */}
          <AccordionItem value="greenscreen">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">🟢</span>
                <span className="font-semibold">グリーンスクリーン背景の活用</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">🎬 動画編集に最適</h4>
                  <p className="text-green-700 mb-3">
                    グリーンスクリーン（#00ff00）背景により、動画編集ソフトでクロマキー合成が簡単にできます
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-800">🎯 活用例</h5>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>YouTube動画</strong> - 音楽紹介動画や解説動画の背景として</li>
                    <li><strong>音楽PV</strong> - アーティストの楽曲プロモーションビデオに</li>
                    <li><strong>ライブ配信</strong> - OBSなどの配信ソフトで背景として使用</li>
                    <li><strong>プレゼンテーション</strong> - 音声付きプレゼンの視覚効果として</li>
                    <li><strong>ポッドキャスト</strong> - 音声コンテンツの視覚化</li>
                  </ul>

                  <h5 className="font-semibold text-gray-800 mt-4">🛠️ 編集ソフトでの使い方</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li><strong>Premiere Pro</strong>: Ultra Key エフェクトを使用</li>
                    <li><strong>Final Cut Pro</strong>: キーヤー &gt; クロマキー</li>
                    <li><strong>DaVinci Resolve</strong>: Color ページでクロマキー</li>
                    <li><strong>OBS Studio</strong>: 色度キーフィルタを追加</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 設定とカスタマイズ */}
          <AccordionItem value="settings">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚙️</span>
                <span className="font-semibold">詳細設定とカスタマイズ</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">🎨 見た目の設定</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                      <li><strong>色モード</strong>: 🌈虹色 または 🎨単色</li>
                      <li><strong>カラーピッカー</strong>: お好みの色を自由選択</li>
                      <li><strong>表示位置</strong>: 上部・中央・下部</li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-slate-800 mb-2">📊 波形パラメーター</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                      <li><strong>バーの数</strong>: 50〜500本で調整</li>
                      <li><strong>高さ・間隔</strong>: 見やすさに合わせて調整</li>
                      <li><strong>反応感度</strong>: 動きの閾値で調整</li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>💡 設定の保存:</strong> 調整した設定は自動的に保存され、次回起動時に復元されます
                  </AlertDescription>
                </Alert>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 対応ファイル形式 */}
          <AccordionItem value="formats">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">📂</span>
                <span className="font-semibold">対応ファイル形式・技術仕様</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2">🎵 対応音声形式</h5>
                    <ul className="list-disc list-inside space-y-1 text-green-700 text-xs">
                      <li>✅ MP3 (.mp3)</li>
                      <li>✅ WAV (.wav)</li>
                      <li>✅ AAC (.aac, .m4a)</li>
                      <li>✅ OGG (.ogg)</li>
                      <li>✅ FLAC (.flac)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">🎬 出力仕様</h5>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
                      <li>📺 解像度: 1280×720 (HD)</li>
                      <li>🎞️ フレームレート: 30fps</li>
                      <li>🔧 コーデック: H.264 + AAC</li>
                      <li>🟢 背景: グリーンスクリーン</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <h5 className="font-semibold text-yellow-800 mb-2">⚡ 推奨ブラウザ</h5>
                  <p className="text-yellow-700 text-xs">
                    Chrome 88+、Firefox 90+、Safari 14+、Edge 88+ で最適な動作を確認済み
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* プライバシーとセキュリティ */}
          <AccordionItem value="privacy">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="font-semibold">プライバシーとセキュリティ</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">🛡️ 完全ローカル処理</h5>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li><strong>音声ファイル</strong>: ブラウザ内でのみ処理、サーバー送信なし</li>
                    <li><strong>録画データ</strong>: ローカルで生成、直接ダウンロード</li>
                    <li><strong>設定情報</strong>: ローカルストレージのみに保存</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">📊 Google Analytics使用について</h5>
                  <p className="text-blue-700 mb-2">
                    サービス改善のため、以下の<strong>匿名</strong>データを収集しています：
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
                    <li>ページビュー数、利用時間</li>
                    <li>機能の使用状況（匿名）</li>
                    <li>エラー発生率</li>
                    <li>国・地域レベルの統計</li>
                  </ul>
                  <p className="text-blue-700 mt-2 text-xs">
                    <strong>※ 個人を特定する情報や音声ファイルの内容は一切収集していません</strong>
                  </p>
                </div>

                <Alert className="bg-slate-50 border-slate-200">
                  <AlertDescription className="text-slate-700">
                    📄 詳細は <a href="https://github.com/inoue2002/audio-visualizer/blob/main/PRIVACY.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">プライバシーポリシー</a> をご確認ください
                  </AlertDescription>
                </Alert>
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
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-800 mb-2">🚨 よくある問題</h5>
                    <ul className="list-disc list-inside space-y-1 text-red-700 text-xs">
                      <li><strong>音が出ない</strong> → ブラウザの音量設定、ミュート解除を確認</li>
                      <li><strong>再生エラー</strong> → 「🔄 オーディオリセット」ボタンで再試行</li>
                      <li><strong>録画できない</strong> → ブラウザを最新版に更新</li>
                      <li><strong>変換に時間がかかる</strong> → 初回はFFmpeg.wasmのダウンロードが必要</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">💡 パフォーマンス向上のコツ</h5>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
                      <li>不要なブラウザタブを閉じる</li>
                      <li>音楽ファイルサイズを適切に（50MB以下推奨）</li>
                      <li>バーの数を調整して処理負荷を軽減</li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-gray-50 border-gray-200">
                  <AlertDescription className="text-gray-700">
                    🆘 <strong>問題が解決しない場合:</strong> 
                    <a href="https://github.com/inoue2002/audio-visualizer/issues" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium ml-1">
                      GitHub Issues
                    </a> でお気軽にご報告ください
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
