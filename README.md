# 新北高工 AI 統測自主學習平台（第一階段本機 MVP）

動力機械群／汽車科示範站，完成教師審題、學生雙題庫、自主練習、模擬考試及學習診斷。全站使用繁體中文、RWD 版面，無需 Supabase 或付費 AI 金鑰即可展示。

## 重要資料聲明

- 本機的 `data/raw/115/power-machinery-professional-1/` 可保存官方試題與標準答案 PDF；GitHub repository 為避免重複散布整份試題，不提交 PDF 二進位檔。來源與雜湊記錄於 `data/source-manifest.json`。
- 官方 PDF 目前狀態為「待解析／待教師確認」，沒有直接發布到學生題庫。
- 網站可作答題目共 16 題，全部為虛構示範題；另有 2 題 AI 待審示範題。

如需取得官方 PDF，請從 repository 根目錄執行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\download-official-files.ps1
```

腳本會從技專校院入學測驗中心公布頁下載，並比對已記錄的 SHA-256；下載成功仍不代表已完成題目與答案的人工審核。

## 快速啟動（本專案位於 Google 雲端硬碟時建議使用）

在 PowerShell 執行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-local.ps1
```

腳本會將原始碼複製到 `%LOCALAPPDATA%\CodexRuns\ai-tvet-learning-platform`，在本機安裝相依套件並啟動 `http://127.0.0.1:3000`。按 `Ctrl+C` 可停止網站。

若專案已位於一般本機資料夾，可使用標準指令：

```powershell
npm install
npm run dev
```

## 示範帳號

| 角色 | 帳號 | 密碼 |
|---|---|---|
| 學生 | `s115001` | `Student115!` |
| 教師 | `teacher01` | `Teach115!` |
| 管理員 | `admin01` | `Admin115!` |

以上皆為虛構資料。密碼以加鹽 scrypt 雜湊保存；登入後使用 HttpOnly Cookie。

## 測試與建置

```powershell
npm run test       # 單元＋資料整合測試
npm run test:e2e   # 重建示範 DB 後執行 Chrome 端到端測試
npm run build      # 正式建置與 TypeScript 檢查
```

## 教師操作

1. 以教師帳號登入，從「教師審題」檢查待審 AI 題。
2. 輸入審核備註，選擇通過、退回修改或不採用。
3. 到「來源匯入」檢視官方文件，或上傳 PDF／CSV；CSV 題目一律先進待審。
4. 到「學習分析」查看示範學生的單元正確率。

CSV 欄位：`stem, option_a, option_b, option_c, option_d, answer, explanation, unit, difficulty, source_type`。

## 學生操作

1. 以學生帳號登入，選擇「自主練習」或「模擬考試」。
2. 自主練習可選題庫、單元、難度及題數，每題立即取得回饋。
3. 模擬考作答期間不顯示答案，交卷後由伺服器統一評分。
4. 在「成績診斷」查看歷次紀錄、常錯知識點與補強建議。

## 教學應用方式

- 課前：教師先審核 5–10 題，建立本週可用題組。
- 課中：學生完成 5 題即時回饋練習，兩人一組口述解題原理。
- 課後：以 3–5 題模擬考驗證，再依診斷結果安排補強題。

## 學生實作建議與評量

- 基礎題：完成指定單元 5 題練習，正確率達 80%。
- 進階題：針對一題錯題寫出「錯因、正確原理、生活／實務例子」。
- 挑戰題：比較歷屆題型示範與 AI 模擬題的題幹品質，提出可審核的修改理由。
- 評量可採：練習完成度 30%、模擬考 30%、錯題反思 25%、同儕解說 15%。

## 延伸任務

1. 經科任教師確認後，建立官方 PDF 的題號—答案核對表。
2. 連接 Supabase Auth／PostgreSQL，完成 RLS 與正式班級權限測試。
3. 把 `config/department.json` 抽成初始化精靈，複製到其他科別。
