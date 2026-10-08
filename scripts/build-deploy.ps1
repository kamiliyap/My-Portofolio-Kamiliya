param([string]$OutputPath = '')
$ErrorActionPreference = 'Stop'
$packageRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..')).TrimEnd('\', '/')
if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $packageDirectory = Join-Path ([IO.Path]::GetTempPath()) 'kamiliya-deployment'
    New-Item -ItemType Directory -Path $packageDirectory -Force | Out-Null
    $OutputPath = Join-Path $packageDirectory ('portfolio-kamiliya-' + [Guid]::NewGuid().ToString('N').Substring(0, 8) + '.zip')
}
$packageOutput = [IO.Path]::GetFullPath($OutputPath)
if ($packageOutput.StartsWith($packageRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Simpan ZIP di luar folder project/web root.'
}
if (Test-Path -LiteralPath $packageOutput) { throw 'File output sudah ada. Pilih nama ZIP lain.' }
New-Item -ItemType Directory -Path ([IO.Path]::GetDirectoryName($packageOutput)) -Force | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$packageStream = [IO.File]::Open($packageOutput, [IO.FileMode]::CreateNew)
$packageArchive = $null
$packageCount = 0
try {
    $packageArchive = [System.IO.Compression.ZipArchive]::new($packageStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
    foreach ($packageFile in Get-ChildItem -LiteralPath $packageRoot -Recurse -File -Force) {
        if ($packageFile.Attributes -band [IO.FileAttributes]::ReparsePoint) { continue }
        $packageRelative = $packageFile.FullName.Substring($packageRoot.Length + 1).Replace('\', '/')
        if ($packageRelative -match '(^|/)(\.git[^/]*|\.vscode|__pycache__|tests|database|scripts)(/|$)' -or
            $packageRelative -match '^config/(database|portfolio)\.local\.php$' -or
            $packageFile.Name -like '.env*' -or $packageFile.Extension -eq '.md') { continue }
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($packageArchive, $packageFile.FullName, $packageRelative, [System.IO.Compression.CompressionLevel]::Optimal)
        $packageCount++
    }
} finally {
    if ($packageArchive) { $packageArchive.Dispose() }
    $packageStream.Dispose()
}
Write-Output ('PACKAGE=' + $packageOutput)
Write-Output ('FILES=' + $packageCount)
