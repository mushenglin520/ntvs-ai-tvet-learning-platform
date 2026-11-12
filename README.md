# 新北高工 AI 統測自主學習平台

第一階段雲端示範版，採 Next.js 16、Vercel 與 Supabase PostgreSQL。涵蓋教師審題、學生雙題庫、自主練習、模擬考試、成績紀錄與學習診斷，並提供繁體中文 RWD 介面。

## 正式架構

- 網站：Next.js App Router，部署於 Vercel。
- 資料庫：Supabase PostgreSQL（東京區）。
- 權限：HttpOnly 工作階段 Cookie、角色檢查 RPC、所有 public 資料表 RLS、Data API 表格零直接授權。
- 檔案：教師上傳 PDF／CSV 儲存於 Supabase Storage 私有 bucket。
- 稽核：教師審題與來源匯入均寫入 audit_logs。
- 金鑰：網站只使用 publishable key，不使用 service_role／secret key。

## 重要資料聲明

- 115 年動力機械群專業科目（一）官方試題與標準答案來源、檔名及 SHA-256 已登錄。
- 官方 PDF 仍是「待解析／待教師確認」狀態，未直接發布到學生題庫。
- 可作答題目為虛構教學示範題，並以「歷屆題型示範」或「AI 模擬題」清楚標示，不宣稱是官方原題。
- GitHub repository 不提交官方 PDF 二進位檔；可使用 `scripts/download-official-files.ps1` 自官方來源下載並核對雜湊。

## 本機啟動

1. 複製環境變數：

```powershell
Copy-Item .env.example .env.local
```

2. 在 `.env.local` 填入 Supabase 專案的 URL 與 publishable key。
3. 專案位於 Google 雲端硬碟時，建議執行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-local.ps1
```

一般本機資料夾可直接執行：

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

以上皆為虛構資料。密碼在 PostgreSQL 以 bcrypt 雜湊保存。

## 測試與建置

```powershell
npm run test       # 8 項單元與 Supabase 整合測試
npm run test:e2e   # 3 項 Chrome 端到端流程
npm run build      # 正式建置與 TypeScript 檢查
```

端到端測試會實際建立學生作答紀錄，教師流程也會審核一題待審示範題。

## Supabase 遷移

資料庫版本位於 `supabase/migrations/`：

- 初始結構、示範資料、RPC 與 Storage。
- 登入／角色檢查修正。
- deny-all RLS 政策與外鍵索引。
- RPC 執行權限收斂。

所有 DDL 變更都應新增 migration，不直接修改已套用的歷史檔。

## 教學應用方式

- 課前：教師審核 5–10 題，建立本週可用題組。
- 課中：學生完成 5 題即時回饋練習，再以兩人一組口述解題原理。
- 課後：以 3–5 題模擬考驗證，依「常錯知識點」安排補強。
- 評量：練習完成度 30%、模擬考 30%、錯題反思 25%、同儕解說 15%。

## 學生實作建議

- 基礎：完成指定單元 5 題練習，正確率達 80%。
- 進階：針對一題錯題寫出「錯因、正確原理、實務例子」。
- 挑戰：比較歷屆題型示範與 AI 模擬題，提出可被教師審核的修題理由。

## 延伸任務

1. 由科任教師建立官方 PDF 的題號—答案核對表，再逐批發布。
2. 第二階段改用 Supabase Auth，加入正式教師邀請、學生班級與密碼重設。
3. 新增題目版本差異、班級匯入與診斷報表匯出。
4. 將科別設定抽成初始化精靈，複製至其他技職群科。
