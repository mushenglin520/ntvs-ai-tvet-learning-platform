$ErrorActionPreference = "Stop"

# Google 雲端硬碟不適合直接承載大量 node_modules 小檔案；
# 此腳本會把原始碼複製到本機快取目錄後啟動，原始專案仍留在雲端資料夾。
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$RuntimeRoot = Join-Path $env:LOCALAPPDATA "CodexRuns\ai-tvet-learning-platform"
$NpmCache = Join-Path $env:LOCALAPPDATA "CodexDeps\npm-cache-ai-tvet"

New-Item -ItemType Directory -Force -Path $RuntimeRoot, $NpmCache | Out-Null
robocopy $ProjectRoot $RuntimeRoot /E /XD node_modules node_modules_failed_install .next /XF app.db app.db-shm app.db-wal /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -gt 7) { throw "專案複製失敗（robocopy code: $LASTEXITCODE）" }

Push-Location $RuntimeRoot
try {
  $env:npm_config_cache = $NpmCache
  if (-not (Test-Path (Join-Path $RuntimeRoot "node_modules\next"))) {
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install 失敗" }
  }
  npm run dev -- --hostname 127.0.0.1 --port 3000
}
finally {
  Pop-Location
}
