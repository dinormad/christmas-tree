# Photo Rename Helper Script
# This script helps you rename your photos to the correct format

Write-Host "🎄 圣诞树照片重命名助手 / Christmas Tree Photo Rename Helper" -ForegroundColor Green
Write-Host ""

# Get the photos directory
$photosDir = Join-Path $PSScriptRoot "public\photos"

# Create photos directory if it doesn't exist
if (-not (Test-Path $photosDir)) {
    New-Item -ItemType Directory -Path $photosDir -Force | Out-Null
    Write-Host "✅ Created photos directory: $photosDir" -ForegroundColor Green
}

Write-Host "Photos directory: $photosDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "请按以下步骤操作：" -ForegroundColor Yellow
Write-Host "1. 将您的照片复制到以下文件夹：" -ForegroundColor White
Write-Host "   $photosDir" -ForegroundColor White
Write-Host "2. 选择一张作为顶端封面图（树顶星星）" -ForegroundColor White
Write-Host "3. 其余照片将自动按顺序重命名为 1.jpg, 2.jpg, 3.jpg..." -ForegroundColor White
Write-Host ""

# Check if there are any image files
$imageFiles = Get-ChildItem -Path $photosDir -Include *.jpg,*.jpeg,*.png,*.webp -File -ErrorAction SilentlyContinue

if ($imageFiles.Count -eq 0) {
    Write-Host "❌ 未找到图片文件。请先将图片复制到 photos 文件夹。" -ForegroundColor Red
    Write-Host ""
    Write-Host "按任意键打开 photos 文件夹..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process $photosDir
    exit
}

Write-Host "找到 $($imageFiles.Count) 个图片文件" -ForegroundColor Green
Write-Host ""

# List current files
Write-Host "当前文件列表：" -ForegroundColor Cyan
$imageFiles | ForEach-Object { Write-Host "  - $($_.Name)" }
Write-Host ""

# Ask which file should be top.jpg
Write-Host "请输入要用作顶端封面图的文件名（或输入序号）：" -ForegroundColor Yellow

for ($i = 0; $i -lt $imageFiles.Count; $i++) {
    Write-Host "  [$($i + 1)] $($imageFiles[$i].Name)"
}
Write-Host ""

$selection = Read-Host "选择"

# Parse selection
$topFileIndex = -1
if ($selection -match '^\d+$') {
    $topFileIndex = [int]$selection - 1
} else {
    # Try to find by name
    for ($i = 0; $i -lt $imageFiles.Count; $i++) {
        if ($imageFiles[$i].Name -eq $selection) {
            $topFileIndex = $i
            break
        }
    }
}

if ($topFileIndex -lt 0 -or $topFileIndex -ge $imageFiles.Count) {
    Write-Host "❌ 无效的选择" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "开始重命名..." -ForegroundColor Green

# Create a temp directory for renaming
$tempDir = Join-Path $photosDir "_temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy top file
$topFile = $imageFiles[$topFileIndex]
$topDestination = Join-Path $tempDir "top.jpg"
Copy-Item $topFile.FullName $topDestination -Force
Write-Host "✅ 已创建顶端封面图: top.jpg (来源: $($topFile.Name))" -ForegroundColor Green

# Copy and rename other files
$counter = 1
for ($i = 0; $i -lt $imageFiles.Count; $i++) {
    if ($i -eq $topFileIndex) {
        continue
    }
    
    $file = $imageFiles[$i]
    $newName = "$counter.jpg"
    $destination = Join-Path $tempDir $newName
    
    Copy-Item $file.FullName $destination -Force
    Write-Host "✅ 已重命名: $($file.Name) -> $newName" -ForegroundColor Green
    
    $counter++
}

Write-Host ""
Write-Host "重命名完成！" -ForegroundColor Green
Write-Host ""
Write-Host "是否要用重命名后的文件替换原文件？(Y/N)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -eq 'Y' -or $confirm -eq 'y') {
    # Backup original files
    $backupDir = Join-Path $photosDir "_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    Write-Host ""
    Write-Host "正在备份原文件到: $backupDir" -ForegroundColor Cyan
    $imageFiles | ForEach-Object { 
        Copy-Item $_.FullName (Join-Path $backupDir $_.Name) -Force
    }
    
    # Delete original image files (except top.jpg and numbered files)
    Write-Host "正在清理原文件..." -ForegroundColor Cyan
    $imageFiles | ForEach-Object {
        if ($_.Name -ne "top.jpg" -and $_.Name -notmatch '^\d+\.jpg$') {
            Remove-Item $_.FullName -Force
        }
    }
    
    # Move renamed files to photos directory
    Write-Host "正在复制重命名后的文件..." -ForegroundColor Cyan
    Get-ChildItem -Path $tempDir -File | ForEach-Object {
        Copy-Item $_.FullName (Join-Path $photosDir $_.Name) -Force
    }
    
    # Remove temp directory
    Remove-Item $tempDir -Recurse -Force
    
    Write-Host ""
    Write-Host "✅ 完成！" -ForegroundColor Green
    Write-Host "原文件已备份到: $backupDir" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "重命名后的文件保存在: $tempDir" -ForegroundColor Cyan
    Write-Host "如需使用，请手动将文件复制到 photos 文件夹" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "按任意键打开 photos 文件夹..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process $photosDir
