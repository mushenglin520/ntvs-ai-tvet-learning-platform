$ErrorActionPreference = "Stop"

# Google 雲端硬碟不適合直接承載大量 node_modules 小檔案；
# 此腳本會把原始碼複製到本機快取目錄後啟動，原始專案仍留在雲端資料夾。
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ExpectedRuntimeRoot = [IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA "CodexRuns\ai-tvet-learning-platform"))
$RuntimeRoot = $ExpectedRuntimeRoot
$NpmCache = Join-Path $env:LOCALAPPDATA "CodexDeps\npm-cache-ai-tvet"

New-Item -ItemType Directory -Force -Path $RuntimeRoot, $NpmCache | Out-Null
# /MIR 只同步已驗證的專用快取目錄；node_modules 與 .next 排除，不會被刪除。
$ResolvedRuntimeRoot = [IO.Path]::GetFullPath((Resolve-Path -LiteralPath $RuntimeRoot).Path)
if ($ResolvedRuntimeRoot -ne $ExpectedRuntimeRoot) {
  throw "本機快取路徑驗證失敗，已停止同步。"
}
robocopy $ProjectRoot $RuntimeRoot /MIR /XD node_modules node_modules_failed_install .next .git /XF app.db app.db-shm app.db-wal /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -gt 7) { throw "專案複製失敗（robocopy code: $LASTEXITCODE）" }

Push-Location $RuntimeRoot
try {
  $env:npm_config_cache = $NpmCache
  $LockHash = (Get-FileHash -LiteralPath (Join-Path $RuntimeRoot "package-lock.json") -Algorithm SHA256).Hash
  $StampPath = Join-Path $RuntimeRoot "node_modules\.package-lock.sha256"
  $InstalledHash = if (Test-Path -LiteralPath $StampPath) { (Get-Content -Raw -LiteralPath $StampPath).Trim() } else { "" }
  if (-not (Test-Path (Join-Path $RuntimeRoot "node_modules\next")) -or $InstalledHash -ne $LockHash) {
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install 失敗" }
    [IO.File]::WriteAllText($StampPath, $LockHash)
  }
  npm run dev -- --hostname 127.0.0.1 --port 3000
}
finally {
  Pop-Location
}
