# Build vocabulary and publish the current working tree to GitHub.
#
# Usage:
#   publish.bat                          # build, show changes, ask, commit, push
#   publish.bat "data: update vocabulary" # custom commit message
#   publish.bat -Yes                     # skip confirmation (non-interactive)
#   publish.bat -DryRun                  # build + show what would be published
#
# Staging is limited to tracked files plus new CSV files under source/ and
# data/source/ (and the publish scripts themselves). Temporary helper scripts
# are left untracked. The script never force-pushes.

[CmdletBinding()]
param(
  [switch]$Yes,
  [switch]$DryRun,
  [Parameter(Position = 0)]
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Fail([string]$text) {
  Write-Host ""
  Write-Host "ERROR: $text" -ForegroundColor Red
  exit 1
}

# ---------- 1. rebuild vocabulary ----------
$buildScript = Join-Path $root "build.ps1"
if (-not (Test-Path $buildScript)) { Fail "build.ps1 not found" }

$shell = (Get-Process -Id $PID -ErrorAction SilentlyContinue).Path
if (-not $shell) {
  $pwsh = Get-Command pwsh -ErrorAction SilentlyContinue
  if ($pwsh) { $shell = $pwsh.Source } else { $shell = "powershell.exe" }
}

Write-Host "==> Rebuilding vocabulary..." -ForegroundColor Cyan
& $shell -NoProfile -ExecutionPolicy Bypass -File $buildScript
if ($LASTEXITCODE -ne 0) { Fail "vocabulary build failed (exit $LASTEXITCODE)" }

# ---------- 2. git checks ----------
$null = git rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) { Fail "not inside a git repository" }
$null = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) { Fail "git remote 'origin' is not configured" }

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if (-not $branch) { Fail "cannot determine current branch" }

$status = @(git status --short)
$ahead = 0
try {
  $aheadText = git rev-list --count "origin/$branch..HEAD" 2>$null
  if ($LASTEXITCODE -eq 0 -and $aheadText) { $ahead = [int]$aheadText }
} catch { $ahead = 0 }

Write-Host ""
Write-Host "==> Git status:" -ForegroundColor Cyan
if ($status.Count -eq 0) {
  Write-Host "  (working tree clean)"
} else {
  $status | ForEach-Object { Write-Host "  $_" }
}
if ($ahead -gt 0) { Write-Host "  $ahead local commit(s) ahead of origin/$branch" }

if ($status.Count -eq 0 -and $ahead -eq 0) {
  Write-Host ""
  Write-Host "Nothing to publish." -ForegroundColor Green
  exit 0
}

if ($DryRun) {
  Write-Host ""
  Write-Host "Dry run: no files staged, no commit, no push." -ForegroundColor Yellow
  Write-Host "Would stage: tracked modifications + new source/data CSV files + publish scripts."
  $left = @(git ls-files --others --exclude-standard)
  if ($left.Count -gt 0) {
    Write-Host "Untracked files (new CSVs and publish scripts are auto-staged; others are left alone):" -ForegroundColor Yellow
    $left | ForEach-Object { Write-Host "  $_" }
  }
  exit 0
}

# ---------- 3. confirm ----------
if (-not $Yes) {
  $question = if ($status.Count -gt 0) {
    "Commit these changes and push to origin/$branch ? (y/N)"
  } else {
    "Push $ahead pending commit(s) to origin/$branch ? (y/N)"
  }
  $answer = Read-Host $question
  if ($answer -notmatch '^(y|yes)$') {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
  }
}

# ---------- 4. commit ----------
if ($status.Count -gt 0) {
  # Tracked modifications (app files, vocabulary.json, existing CSVs, .gitignore...)
  git add -u
  if ($LASTEXITCODE -ne 0) { Fail "git add -u failed" }

  # New vocabulary CSVs only; do not publish temporary helper scripts.
  $newCsvs = @(git ls-files --others --exclude-standard -- source data/source |
    Where-Object { $_ -match '\.csv$' })
  if ($newCsvs.Count -gt 0) {
    git add -- $newCsvs
    if ($LASTEXITCODE -ne 0) { Fail "git add (new CSV) failed" }
  }

  # The publish scripts themselves should be versioned.
  $publishFiles = @('publish.bat', 'publish.ps1') |
    Where-Object { Test-Path (Join-Path $root $_) }
  if ($publishFiles.Count -gt 0) {
    git add -- $publishFiles
    if ($LASTEXITCODE -ne 0) { Fail "git add (publish scripts) failed" }
  }

  $left = @(git ls-files --others --exclude-standard)
  if ($left.Count -gt 0) {
    Write-Host ""
    Write-Host "Untracked files left out of this publish:" -ForegroundColor Yellow
    $left | ForEach-Object { Write-Host "  $_" }
  }

  $staged = @(git diff --cached --name-only)
  if ($staged.Count -gt 0) {
    if (-not $Message) {
      $Message = "chore: rebuild vocabulary " + (Get-Date -Format "yyyy-MM-dd HH:mm")
    }
    Write-Host ""
    Write-Host "==> Staged files:" -ForegroundColor Cyan
    $staged | ForEach-Object { Write-Host "  $_" }

    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { Fail "git commit failed" }
  } else {
    Write-Host "No staged changes; skipping commit." -ForegroundColor Yellow
    if ($ahead -eq 0) {
      Write-Host "No publishable changes." -ForegroundColor Yellow
      exit 0
    }
  }
}

# ---------- 5. push ----------
Write-Host ""
Write-Host "==> Pushing to origin/$branch ..." -ForegroundColor Cyan
git push origin HEAD
if ($LASTEXITCODE -ne 0) {
  Fail "git push failed; the commit (if any) is still local. Check auth/network and retry."
}

Write-Host ""
Write-Host "Published. GitHub Pages will rebuild shortly." -ForegroundColor Green
exit 0
