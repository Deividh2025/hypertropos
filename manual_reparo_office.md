# Playbook de Reparo: Falha de Inicialização do Microsoft Office (Word/Excel)

> **Este documento serve como um guia técnico completo e histórico de resolução para ser fornecido a outro agente Antigravity em um computador diferente com os mesmos sintomas.**

---

## 1. Sintomas do Problema
O usuário enfrenta falhas de inicialização ao tentar abrir aplicativos do Microsoft Office (principalmente Excel e Word):
1. Ao tentar abrir o Excel, aparece um popup informando: *"O Excel não pôde ser iniciado na última tentativa. Deseja iniciar no modo de segurança?"*.
2. Independentemente de escolher **Sim** ou **Não**, ou ao tentar abrir o Excel por meio de arquivos `.xlsx` ou atalhos normais, o Windows exibe o erro:
   > **"O sistema operacional não está configurado para executar este aplicativo."**
3. Reparos rápidos, reparos online e reinstalações convencionais do Office **não resolvem** o problema de forma definitiva.

---

## 2. As Três Causas Raízes Identificadas

### 🚨 Causa 1: Sequestro de Depurador pelo CCleaner (IFEO Injection)
O recurso **Smart Cleaning / Software Updater (Reactivator)** do CCleaner 7 injeta chaves de depurador no Registro do Windows. Ele configura o `CCleanerReactivator.exe` como "Debugger" oficial dos binários do Office na chave de Image File Execution Options (IFEO).
* **Caminho afetado:** `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\excel.exe` (e `winword.exe`, `powerpnt.exe`, `outlook.exe`, `chrome.exe`, etc.)
* **Efeito:** Toda vez que o Windows tenta abrir o Excel, ele desvia o fluxo e tenta abrir o CCleaner. Se o CCleaner estiver corrompido ou ausente, a inicialização falha imediatamente.

### 🚨 Causa 2: Loop de Modo de Segurança (Chaves de Resiliency)
Devido às consecutivas falhas causadas pelo bloqueio do CCleaner, o Office entra em um estado de autodirecionamento perpétuo para Modo de Segurança, gravando chaves de resiliência quebradas.
* **Caminho afetado:** `HKCU:\Software\Microsoft\Office\16.0\Excel\Resiliency\StartupItems`

### 🚨 Causa 3 (A Principal): Letra de Unidade Desalinhada no Registro Virtual Click-to-Run (C2R)
O instalador do Click-to-Run grava configurações em uma partição de registro virtualizado em `HKLM\SOFTWARE\Microsoft\Office\ClickToRun\REGISTRY\MACHINE\Software`. 
Descobrimos que, devido a instalações anteriores ou alterações de particionamento, existiam **mais de 80 entradas cruciais** gravadas apontando caminhos internos do Office para a unidade **`D:\`** (ex: `D:\Program Files\Microsoft Office\...`), enquanto a instalação real e os arquivos físicos residem em **`C:\`**.
* **Efeito:** O executável `excel.exe` inicia se clicado diretamente em `C:\`, mas quando iniciado via atalhos, associações de arquivos locais `.xlsx`, ou chamadas de sistema, o virtualizador C2R tenta carregar bibliotecas em `D:\`, falhando com o erro *"O sistema operacional não está configurado para executar este aplicativo."*.

---

## 3. Roteiro de Resolução para o Agente Antigravity

> **Instrução para o Agente:** "Leia as seções a seguir, extraia os scripts e execute-os em um PowerShell elevado (Administrador)."

### Passo 1: Limpeza do CCleaner e IFEO (PowerShell como Administrador)
Remover qualquer sequestro ativo de depurador nas chaves de Image File Execution Options:

```powershell
# Script de limpeza de IFEO Hijack
$ifeoPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options"
$appsToClean = Get-ChildItem -Path $ifeoPath

foreach ($app in $appsToClean) {
    $appName = $app.PSChildName
    $appKeyPath = $app.PSPath
    
    # 1. Verificar valor Debugger direto
    $prop = Get-ItemProperty -Path $appKeyPath -Name "Debugger" -ErrorAction SilentlyContinue
    if ($prop -and ($prop.Debugger -like "*CCleaner*")) {
        Write-Host "Removendo Debugger do CCleaner de: $appName" -ForegroundColor Green
        Remove-ItemProperty -Path $appKeyPath -Name "Debugger" -Force
    }
    
    # 2. Verificar subchaves (filtros do CCleaner v6+)
    $subkeys = Get-ChildItem -Path $appKeyPath -ErrorAction SilentlyContinue
    foreach ($sub in $subkeys) {
        $subProp = Get-ItemProperty -Path $sub.PSPath -Name "Debugger" -ErrorAction SilentlyContinue
        if ($subProp -and ($subProp.Debugger -like "*CCleaner*")) {
            Write-Host "Removendo subchave de depurador de: $appName\$($sub.PSChildName)" -ForegroundColor Green
            Remove-Item -Path $sub.PSPath -Force -Recurse
        }
    }
}

# Desativar tarefas agendadas do CCleaner para prevenir novos sequestros
Get-ScheduledTask -TaskName "*CCleaner*" -ErrorAction SilentlyContinue | Disable-ScheduledTask
```

### Passo 2: Limpar chaves de Resiliência (PowerShell como Administrador)
Resetar o estado de carregamento do Excel para remover o loop de modo de segurança:

```powershell
# Limpar registros de resiliência e arquivos corrompidos de toolbar
Remove-Item -Path "HKCU:\Software\Microsoft\Office\16.0\Excel\Resiliency" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Microsoft\Excel\*.xlb" -Force -ErrorAction SilentlyContinue
```

### Passo 3: Correção de Alinhamento de Drives do Registro Virtual Click-to-Run (C2R)
Este script verifica o caminho real onde o Office está instalado e corrige todas as chaves virtuais desalinhadas de `D:\` para `C:\`.

```powershell
# Script de Alinhamento do Registro Virtual Click-to-Run (C2R)
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Error "Este script deve ser executado como ADMINISTRADOR!"
    Exit
}

# 1. Detectar o caminho de instalacao real do Office
$instPath = "C:\Program Files\Microsoft Office"
$configPath = "HKLM:\SOFTWARE\Microsoft\Office\ClickToRun\Configuration"
if (Test-Path $configPath) {
    $prop = Get-ItemProperty -Path $configPath -Name "InstallationPath" -ErrorAction SilentlyContinue
    if ($prop -and $prop.InstallationPath) {
        $instPath = $prop.InstallationPath
    }
}
Write-Host "Caminho fisico de instalacao real: $instPath" -ForegroundColor Yellow

# 2. Criar backup da chave de registro por seguranca
$regPath = "HKLM:\SOFTWARE\Microsoft\Office\ClickToRun\REGISTRY"
$backupDir = "$env:USERPROFILE\Desktop\OfficeRegistryBackup"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}
$backupFile = Join-Path $backupDir "c2r_virtual_registry_backup.reg"
Write-Host "Criando backup em: $backupFile" -ForegroundColor Yellow
& reg.exe export "HKLM\SOFTWARE\Microsoft\Office\ClickToRun\REGISTRY" "$backupFile" /y | Out-Null

# 3. Escanear e realinhar referencias do drive D: para C:
$keys = Get-ChildItem -Path $regPath -Recurse -ErrorAction SilentlyContinue
$keys = @(Get-Item -Path $regPath) + $keys
$totalUpdated = 0

foreach ($k in $keys) {
    try {
        $props = Get-ItemProperty -Path $k.PSPath -ErrorAction SilentlyContinue
        if ($null -ne $props) {
            foreach ($p in $props.PSObject.Properties.Name) {
                $val = $props.$p
                if ($null -ne $val -and ($val -like "*D:\Program Files\Microsoft Office*")) {
                    $newVal = $val -ireplace "D:\\Program Files\\Microsoft Office", $instPath
                    Set-ItemProperty -Path $k.PSPath -Name $p -Value $newVal -Force
                    Write-Host "ATUALIZADO: $($k.PSPath) -> Prop: $p" -ForegroundColor Green
                    $totalUpdated++
                }
            }
        }
    } catch {}
}

Write-Host "Procedimento finalizado! Total de chaves alinhadas: $totalUpdated" -ForegroundColor Green
Write-Host "REINICIE o computador para carregar as novas configuracoes do virtualizador." -ForegroundColor Yellow
```

---
**Guia gerado com sucesso por Antigravity em 2026-05-24.**
