# fix_office_ccleaner.ps1
# Script para remover sequestros de depuradores IFEO do CCleaner com segurança

# 1. Verificar privilégios de Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "Este script DEVE ser executado como Administrador! Abra o PowerShell como Administrador e tente novamente."
    Exit
}

$ifeoPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options"
# Varredura Dinâmica: encontrar TODAS as chaves que possuem depuradores do CCleaner
$appsToClean = Get-ChildItem -Path $ifeoPath
$backupDir = "$env:USERPROFILE\Desktop\IFEO_Backup"

# 2. Criar diretório de backup na Área de Trabalho
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " INICIANDO REPARO DE REGISTRO - REDIRECIONAMENTOS CCLEANER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Backup será salvo em: $backupDir`n" -ForegroundColor Yellow

$rebootRequired = $false

# 3. Processar executáveis
foreach ($app in $appsToClean) {
    $appName = $app.PSChildName
    $appKeyPath = $app.PSPath
    
    # 3.1. Verificar se a própria chave tem Debugger do CCleaner (versões antigas)
    $prop = Get-ItemProperty -Path $appKeyPath -Name "Debugger" -ErrorAction SilentlyContinue
    if ($prop -and ($prop.Debugger -like "*CCleaner*")) {
        Write-Host "Processando redirecionamento direto: $appName" -ForegroundColor White
        Write-Host "  -> Depurador inválido encontrado: $($prop.Debugger)" -ForegroundColor Red
        
        # Backup
        $backupFile = Join-Path $backupDir "$appName.reg"
        reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\$appName" "$backupFile" /y | Out-Null
        Write-Host "  -> Backup exportado para: $backupFile" -ForegroundColor Gray
        
        # Remover valor Debugger
        Remove-ItemProperty -Path $appKeyPath -Name "Debugger" -Force
        Write-Host "  -> VALOR 'Debugger' DIRETO REMOVIDO COM SUCESSO!" -ForegroundColor Green
        $rebootRequired = $true
        Write-Host "----------------------------------------------------------" -ForegroundColor Gray
    }
    
    # 3.2. Verificar se subchaves têm Debugger do CCleaner (CCleaner v6/v7 com filtros)
    $subkeys = Get-ChildItem -Path $appKeyPath -ErrorAction SilentlyContinue
    foreach ($sub in $subkeys) {
        $subProp = Get-ItemProperty -Path $sub.PSPath -Name "Debugger" -ErrorAction SilentlyContinue
        if ($subProp -and ($subProp.Debugger -like "*CCleaner*")) {
            Write-Host "Processando redirecionamento em subchave: $appName \$($sub.PSChildName)" -ForegroundColor White
            Write-Host "  -> Depurador inválido encontrado: $($subProp.Debugger)" -ForegroundColor Red
            
            # Backup
            $backupFile = Join-Path $backupDir "$($appName)_$($sub.PSChildName).reg"
            reg export "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\$appName\$($sub.PSChildName)" "$backupFile" /y | Out-Null
            Write-Host "  -> Backup exportado para: $backupFile" -ForegroundColor Gray
            
            # Remover subchave inteira
            Remove-Item -Path $sub.PSPath -Force -Recurse
            Write-Host "  -> SUBCHAVE DE REDIRECIONAMENTO REMOVIDA COM SUCESSO!" -ForegroundColor Green
            $rebootRequired = $true
            Write-Host "----------------------------------------------------------" -ForegroundColor Gray
        }
    }
}

if ($rebootRequired) {
    Write-Host "`nReparo concluído com sucesso!" -ForegroundColor Green
    Write-Host "Os redirecionamentos do CCleaner foram removidos." -ForegroundColor Green
    Write-Host "Você já pode tentar abrir os aplicativos afetados (Excel, Word, Chrome, etc.)!" -ForegroundColor Green
} else {
    Write-Host "`nNenhum redirecionamento ativo do CCleaner foi encontrado." -ForegroundColor Yellow
}
