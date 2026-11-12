$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$RawDirectory = Join-Path $ProjectRoot "data\raw\115\power-machinery-professional-1"
New-Item -ItemType Directory -Force -Path $RawDirectory | Out-Null

$Files = @(
  @{
    Name = "115-4y-02-1-question.pdf"
    Url = "https://web1.tcte.edu.tw/EXAM/115_4y/downloader.php?obj=MTE1LTR5LTAyLTEucGRm"
    Sha256 = "3C446A138373A332246DC9075751016849BB494871F01D5094E0E67F3B807431"
  },
  @{
    Name = "115-4y-02-1-standard-answer.pdf"
    Url = "https://web1.tcte.edu.tw/EXAM/115_4y/downloader.php?obj=MTE1LTR5LTAyLTEtc3RhbmRhcmQucGRm"
    Sha256 = "6CC035DB443006AB217410B0608F6F4A7135C6568BDDB2B5F6EDD618F09CF7D2"
  }
)

foreach ($File in $Files) {
  $Destination = Join-Path $RawDirectory $File.Name
  Write-Host "下載 $($File.Name)…"
  Invoke-WebRequest -Uri $File.Url -OutFile $Destination -UseBasicParsing
  $ActualHash = (Get-FileHash -LiteralPath $Destination -Algorithm SHA256).Hash
  if ($ActualHash -ne $File.Sha256) {
    throw "$($File.Name) 的 SHA-256 不符，請勿匯入題庫。"
  }
  Write-Host "完成並通過 SHA-256 驗證：$($File.Name)"
}

Write-Host "官方 PDF 已保存到：$RawDirectory"
Write-Host "注意：檔案仍須由科任教師核對題號、答案與授權範圍後才能發布。"
