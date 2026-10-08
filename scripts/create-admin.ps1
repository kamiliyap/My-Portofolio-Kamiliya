param([string]$Username = (Read-Host 'Username admin'), [string]$PhpPath = 'C:\xampp\php\php.exe')
$adminSecurePassword = Read-Host 'Password admin (12-72 byte)' -AsSecureString
$adminPasswordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminSecurePassword)
try {
    $adminPlainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($adminPasswordPointer)
    $adminPlainPassword | & $PhpPath (Join-Path $PSScriptRoot 'create-admin.php') $Username
    if ($LASTEXITCODE -ne 0) { throw 'Pembuatan akun gagal. Lihat pesan di atas.' }
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($adminPasswordPointer)
    $adminPlainPassword = $null
    $adminSecurePassword.Dispose()
}
