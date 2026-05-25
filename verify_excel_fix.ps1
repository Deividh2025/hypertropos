# verify_excel_fix.ps1
# Script de verificação automatizada para validação da correção dos sequestros do CCleaner no Office e outros apps.

# Configuração de codificação para garantir saída bonita no console do Windows
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " SCRIPT DE VERIFICAÇÃO AUTOMATIZADA: STATUS DO OFFICE/APPS" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verificar chaves IFEO no Registro
Write-Host "`n[1/3] Verificando integridade das chaves de registro IFEO..." -ForegroundColor Yellow

$ifeoPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options"
$appsToTest = @("excel.exe", "winword.exe", "powerpnt.exe", "outlook.exe", "chrome.exe", "firefox.exe", "msedge.exe")
$registryResults = @()

foreach ($app in $appsToTest) {
    $appKeyPath = "$ifeoPath\$app"
    $isHijacked = $false
    $debuggerValue = $null
    
    if (Test-Path $appKeyPath) {
        # Verificar valor Debugger direto
        $prop = Get-ItemProperty -Path $appKeyPath -Name "Debugger" -ErrorAction SilentlyContinue
        if ($prop -and ($prop.Debugger -like "*CCleaner*")) {
            $isHijacked = $true
            $debuggerValue = $prop.Debugger
        }
        
        # Verificar subchaves (CCleaner v6+)
        if (-not $isHijacked) {
            $subkeys = Get-ChildItem -Path $appKeyPath -ErrorAction SilentlyContinue
            foreach ($sub in $subkeys) {
                $subProp = Get-ItemProperty -Path $sub.PSPath -Name "Debugger" -ErrorAction SilentlyContinue
                if ($subProp -and ($subProp.Debugger -like "*CCleaner*")) {
                    $isHijacked = $true
                    $debuggerValue = "$($sub.PSChildName) -> $($subProp.Debugger)"
                    break
                }
            }
        }
    }
    
    $status = if ($isHijacked) { "SEQUESTRADO (FAILED)" } else { "LIMPO (PASSED)" }
    $color = if ($isHijacked) { "Red" } else { "Green" }
    
    $registryResults += [PSCustomObject]@{
        "Aplicativo" = $app
        "Status IFEO" = $status
        "Debugger"    = if ($debuggerValue) { $debuggerValue } else { "Nenhum (Correto)" }
        "Color"       = $color
    }
}

# Exibir tabela de resultados do Registro
foreach ($res in $registryResults) {
    Write-Host "  $($res.Aplicativo.PadRight(15)) | Status: " -NoNewline
    Write-Host "$($res.'Status IFEO'.PadRight(20))" -ForegroundColor $res.Color -NoNewline
    Write-Host " | Debugger: $($res.Debugger)"
}

# 2. Verificar consistência de versões dos componentes do Office Click-to-Run
Write-Host "`n[2/3] Verificando consistência das versões dos componentes do Office..." -ForegroundColor Yellow

$expectedVersion = "16.0.17932.20790"
$componentsToTest = @(
    @{ Name = "Office 16 Click-to-Run Licensing Component"; Key = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{90160000-007E-0000-1000-0000000FF1CE}" },
    @{ Name = "Office 16 Click-to-Run Extensibility Component"; Key = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{90160000-008C-0000-1000-0000000FF1CE}" },
    @{ Name = "Office 16 Click-to-Run Localization Component"; Key = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{90160000-008C-0416-1000-0000000FF1CE}" }
)

$versionResults = @()

foreach ($comp in $componentsToTest) {
    $name = $comp.Name
    $keyPath = $comp.Key
    $installedVersion = "Não Encontrado"
    $isSynced = $false
    
    if (Test-Path $keyPath) {
        $val = Get-ItemProperty -Path $keyPath -Name "DisplayVersion" -ErrorAction SilentlyContinue
        if ($val) {
            $installedVersion = $val.DisplayVersion
            if ($installedVersion -eq $expectedVersion) {
                $isSynced = $true
            }
        }
    }
    
    $status = if ($isSynced) { "SINCRONIZADO (PASSED)" } else { "DESATUALIZADO (FAILED)" }
    $color = if ($isSynced) { "Green" } else { "Red" }
    
    $versionResults += [PSCustomObject]@{
        "Componente" = $name
        "Versao"     = $installedVersion
        "Status"     = $status
        "Color"      = $color
    }
}

foreach ($res in $versionResults) {
    Write-Host "  $($res.Componente.PadRight(50)) | Versão: $($res.Versao.PadRight(18)) | Status: " -NoNewline
    Write-Host "$($res.Status)" -ForegroundColor $res.Color
}

# 3. Testar lançamento físico dos aplicativos do Office (Excel e Word)
Write-Host "`n[3/3] Testando inicialização física dos aplicativos..." -ForegroundColor Yellow

$launchResults = @()

# Função auxiliar para testar o lançamento de um processo e capturar comportamento de falha imediata / ExitCode 1060
function Test-AppLaunch {
    param(
        [string]$ProcessName,
        [string]$ExecutableName,
        [string]$Arguments = ""
    )
    
    Write-Host "  -> Testando $ProcessName ($ExecutableName $Arguments)..." -ForegroundColor Gray
    
    # Tentar encontrar o executável nos caminhos comuns se o comando direto não funcionar
    $exePath = $ExecutableName
    if (-not (Get-Command $ExecutableName -ErrorAction SilentlyContinue)) {
        # Procurar no registro App Paths
        $appPathReg = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\$ExecutableName"
        if (Test-Path $appPathReg) {
            $exePath = (Get-ItemProperty -Path $appPathReg -Name "(Default)" -ErrorAction SilentlyContinue)."(Default)"
        } else {
            # Caminhos comuns de instalação do Office
            $commonPaths = @(
                "C:\Program Files\Microsoft Office\root\Office16\$ExecutableName",
                "C:\Program Files\Microsoft Office\Office16\$ExecutableName",
                "C:\Program Files (x86)\Microsoft Office\root\Office16\$ExecutableName",
                "C:\Program Files (x86)\Microsoft Office\Office16\$ExecutableName"
            )
            foreach ($path in $commonPaths) {
                if (Test-Path $path) {
                    $exePath = $path
                    break
                }
            }
        }
    }
    
    # Se o executável não foi encontrado no sistema
    if (-not (Test-Path $exePath -ErrorAction SilentlyContinue) -and -not (Get-Command $exePath -ErrorAction SilentlyContinue)) {
        return [PSCustomObject]@{
            "Nome"   = $ProcessName
            "Status" = "NÃO INSTALADO (SKIPPED)"
            "Detalhe"= "Executável não encontrado no sistema."
            "Color"  = "Yellow"
        }
    }
    
    # Tentar lançar o processo
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $exePath
        $psi.Arguments = $Arguments
        $psi.UseShellExecute = $true
        
        $proc = [System.Diagnostics.Process]::Start($psi)
        
        # Esperar um tempo curto para ver se ele fecha imediatamente (sinal de crash / 1060)
        # Redirecionamentos de IFEO fecham quase que instantaneamente (milissegundos)
        Start-Sleep -Seconds 4
        
        if ($proc.HasExited) {
            $exitCode = $proc.ExitCode
            if ($exitCode -eq 1060) {
                return [PSCustomObject]@{
                    "Nome"   = $ProcessName
                    "Status" = "FALHOU (CODE 1060)"
                    "Detalhe"= "O processo fechou imediatamente com código de saída 1060 (Sequestro ativo!)."
                    "Color"  = "Red"
                }
            } else {
                return [PSCustomObject]@{
                    "Nome"   = $ProcessName
                    "Status" = "FECHADO (WARNING)"
                    "Detalhe"= "O processo fechou prematuramente com código de saída: $exitCode."
                    "Color"  = "Yellow"
                }
            }
        } else {
            # Se ainda estiver rodando, abriu com absoluto sucesso!
            # Vamos encerrar o processo para não deixar janelas abertas
            try {
                $proc.Kill()
            } catch {}
            
            return [PSCustomObject]@{
                "Nome"   = $ProcessName
                "Status" = "SUCESSO (PASSED)"
                "Detalhe"= "O aplicativo iniciou perfeitamente e permaneceu ativo."
                "Color"  = "Green"
            }
        }
    } catch {
        return [PSCustomObject]@{
            "Nome"   = $ProcessName
            "Status" = "ERRO AO INICIAR (FAILED)"
            "Detalhe"= $_.Exception.Message
            "Color"  = "Red"
        }
    }
}

# Testar Excel Normal
$launchResults += Test-AppLaunch -ProcessName "Excel (Normal)" -ExecutableName "excel.exe"

# Testar Excel em Modo de Segurança
$launchResults += Test-AppLaunch -ProcessName "Excel (Safe Mode)" -ExecutableName "excel.exe" -Arguments "/safe"

# Testar Word Normal (opcional, se disponível, para ver se outros apps do Office também estão corrigidos)
$launchResults += Test-AppLaunch -ProcessName "Word (Normal)" -ExecutableName "winword.exe"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "                   RELATORIO DE EXECUCAO                  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

foreach ($res in $launchResults) {
    $nome = [string]$res.Nome
    $status = [string]$res.Status
    $detalhe = [string]$res.Detalhe
    $color = [string]$res.Color
    
    $nomePad = $nome.PadRight(20)
    $statusPad = $status.PadRight(22)
    
    # Use standard console write or simple string formatting to prevent any NoNewline issues
    $header = "  " + $nomePad + " | "
    Write-Host $header -NoNewline
    Write-Host $statusPad -ForegroundColor $color -NoNewline
    Write-Host " | $detalhe"
}

Write-Host "==========================================================" -ForegroundColor Cyan
