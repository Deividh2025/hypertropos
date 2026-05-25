# fix_office_drive_alignment.ps1
# Script para alinhar as letras de unidade do Office Click-to-Run no Registro Virtual do Windows.

# 1. Verificar privilegios de Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "Este script DEVE ser executado como Administrador! Abra o PowerShell como Administrador e tente novamente."
    Exit
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " SCRIPT DE CORRECAO: ALINHAMENTO DE UNIDADE DO OFFICE C2R " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 2. Obter o caminho real de instalacao do Office
$instPath = "C:\Program Files\Microsoft Office"
$configPath = "HKLM:\SOFTWARE\Microsoft\Office\ClickToRun\Configuration"
if (Test-Path $configPath) {
    $prop = Get-ItemProperty -Path $configPath -Name "InstallationPath" -ErrorAction SilentlyContinue
    if ($prop -and $prop.InstallationPath) {
        $instPath = $prop.InstallationPath
    }
}
Write-Host "Caminho fisico de instalacao detectado: $instPath" -ForegroundColor Yellow

# 3. Criar backup da chave de registro
$regPath = "HKLM:\SOFTWARE\Microsoft\Office\ClickToRun\REGISTRY"
$backupDir = "$env:USERPROFILE\Desktop\OfficeRegistryBackup"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}
$backupFile = Join-Path $backupDir "c2r_virtual_registry_backup.reg"

Write-Host "Criando backup de seguranca..." -ForegroundColor Yellow
try {
    & reg.exe export "HKLM\SOFTWARE\Microsoft\Office\ClickToRun\REGISTRY" "$backupFile" /y | Out-Null
    Write-Host "Backup do registro criado com sucesso em: $backupFile" -ForegroundColor Green
} catch {
    Write-Warning "Falha ao criar backup via reg.exe. Prosseguindo com cautela..."
}

# 4. Escanear e atualizar as chaves de registro virtuais
Write-Host "`nProcessando chaves de registro do Click-to-Run..." -ForegroundColor Yellow

$keys = Get-ChildItem -Path $regPath -Recurse -ErrorAction SilentlyContinue
$keys = @(Get-Item -Path $regPath) + $keys

$totalUpdated = 0
$totalFailed = 0

foreach ($k in $keys) {
    try {
        $props = Get-ItemProperty -Path $k.PSPath -ErrorAction SilentlyContinue
        if ($null -ne $props) {
            foreach ($p in $props.PSObject.Properties.Name) {
                $val = $props.$p
                # Detecta qualquer caminho no drive D: referente ao Office
                if ($null -ne $val -and ($val -like "*D:\Program Files\Microsoft Office*")) {
                    # Alinha a letra do drive para o caminho de instalacao real
                    $newVal = $val -ireplace "D:\\Program Files\\Microsoft Office", $instPath
                    
                    try {
                        Set-ItemProperty -Path $k.PSPath -Name $p -Value $newVal -Force
                        Write-Host "ATUALIZADO:" -ForegroundColor Green -NoNewline
                        Write-Host " $($k.PSPath)" -ForegroundColor White
                        Write-Host "  -> Propriedade: $p" -ForegroundColor Gray
                        Write-Host "  -> De:  $val" -ForegroundColor Red
                        Write-Host "  -> Para: $newVal" -ForegroundColor Green
                        $totalUpdated++
                    } catch {
                        # Algumas chaves de instalador podem estar travadas para escrita, vamos registrar
                        Write-Host "BLOQUEADO:" -ForegroundColor Yellow -NoNewline
                        Write-Host " $($k.PSPath)" -ForegroundColor White
                        Write-Host "  -> Erro ao gravar propriedade '$p'" -ForegroundColor DarkGray
                        $totalFailed++
                    }
                }
            }
        }
    } catch {
        # Ignorar erros de leitura de chaves protegidas
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "                   RELATORIO DO ALINHAMENTO               " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Chaves atualizadas com sucesso: $totalUpdated" -ForegroundColor Green
Write-Host "  Chaves protegidas/bloqueadas:   $totalFailed" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

if ($totalUpdated -gt 0) {
    Write-Host "`n[SUCESSO] O alinhamento foi concluido!" -ForegroundColor Green
    Write-Host "As referencias da unidade 'D:\' foram redirecionadas para o caminho correto de instalacao em '$instPath'." -ForegroundColor Green
    Write-Host "Por favor, reinicie seu computador ou reinicie o servico 'Clique para Executar do Microsoft Office' para carregar as alteracoes." -ForegroundColor Yellow
} else {
    Write-Host "`nNenhuma referencia desalinhada no Registro foi corrigida (pode ser necessario rodar com permissoes mais altas se todas falharam)." -ForegroundColor Yellow
}
