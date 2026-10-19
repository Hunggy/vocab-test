# Rebuild vocabulary.json from CSV sources (source/ + data/source/).
# Usage:
#   pwsh -File .\build.ps1                 # rebuild
#   pwsh -File .\build.ps1 --check         # verify up to date, do not write
#   pwsh -File .\build.ps1 --show 5        # rebuild and print the first 5 pairs
#   pwsh -File .\build.ps1 --strict        # treat warnings as failure
# You can also double-click build.bat.

[CmdletBinding()]
param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$BuildArgs
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

try {
  [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
  $OutputEncoding = [Console]::OutputEncoding
} catch { }

function Find-Python {
  $candidates = @()
  if ($env:PYTHON) { $candidates += $env:PYTHON }
  if ($env:LOCALAPPDATA) {
    $candidates += (Join-Path $env:LOCALAPPDATA "Programs\Python\Python314\python.exe")
  }
  foreach ($name in @("python", "py")) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    if ($cmd) { $candidates += $cmd.Source }
  }
  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path $candidate)) { return $candidate }
  }
  return $null
}

$python = Find-Python
if (-not $python) {
  Write-Host "Python not found. Install Python 3, or edit build.ps1 to point at python.exe." -ForegroundColor Red
  exit 1
}

$script = Join-Path $root "tools\build_vocabulary.py"
& $python $script @BuildArgs
$code = $LASTEXITCODE

Write-Host ""
if ($code -eq 0) { Write-Host "Done." -ForegroundColor Green }
else { Write-Host "Failed (exit code $code)." -ForegroundColor Red }
exit $code
