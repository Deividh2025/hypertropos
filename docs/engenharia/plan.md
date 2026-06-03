# Plano de Reparo: Falha de Inicialização do Microsoft Excel (Erro 1060 / Sequestro de IFEO pelo CCleaner)

🤖 **Applying knowledge of `@[project-planner]`...**

Este documento detalha o plano de diagnóstico, correção e verificação manual para resolver a falha crítica na inicialização do Microsoft Excel e outros aplicativos afetados devido a redirecionamentos incorretos de **Image File Execution Options (IFEO)** criados pelo recurso "Sleep Mode" do CCleaner.

---

## 1. Causa Raiz (Root Cause)

O recurso **Sleep Mode** do CCleaner otimiza o desempenho do sistema colocando aplicativos em segundo plano em "estado de suspensão". Tecnicamente, ele faz isso configurando redirecionamentos no registro do Windows chamados **Image File Execution Options (IFEO)**.

Para cada aplicativo suspenso, o CCleaner altera a chave de registro:
`HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\<nome_do_app>.exe`

Definindo o valor `Debugger` como:
`"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"`

### O Problema:
Quando o usuário tenta iniciar o aplicativo (ex: `excel.exe`), o Windows tenta executar o depurador associado (`CCleanerReactivator.exe`). Se o CCleaner estiver corrompido, desinstalado incorretamente, ou se o seu serviço reativador estiver ausente/desativado, o Windows falha imediatamente ao tentar carregar o executável do "depurador". Isso resulta no **Exit Code 1060** (`ERROR_SERVICE_DOES_NOT_EXIST` / "O serviço especificado não existe como serviço instalado").

---

## 2. Aplicativos Afetados Identificados

Com base em varreduras profundas do registro, o "Sleep Mode" do CCleaner sequestrou o fluxo de inicialização dos seguintes executáveis:

| Aplicativo | Executável | Caminho do Depurador Configurado (Sequestrado) |
| :--- | :--- | :--- |
| **Microsoft Excel** | `excel.exe` | `"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"` |
| **Microsoft Word** | `winword.exe` | `"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"` |
| **Microsoft PowerPoint** | `powerpnt.exe` | `"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"` |
| **Microsoft Outlook** | `outlook.exe` | `"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"` |
| **Google Chrome** | `chrome.exe` | `"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"` |
| **Opera Browser** | `opera.exe` | `"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"` |
| **TeamViewer** | `teamviewer.exe` | `"C:\Program Files\Piriform\CCleaner 7\CCleanerReactivator.exe"` |

---

## 3. Script de Reparo Proposto (`fix_office_ccleaner.ps1`)

O script abaixo foi desenvolvido em PowerShell para automatizar a limpeza do registro com total segurança.

> [!IMPORTANT]  
> Este script **deve ser executado como Administrador**, pois modifica chaves sob `HKEY_LOCAL_MACHINE` (HKLM).

```powershell
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
```

---

## 4. Plano de Execução e Passos de Verificação Manual

### Passo 1: Revisão e Aprovação do Plano
* **Ação:** O usuário revisa este plano e concede permissão para prosseguir com a gravação e execução do script de reparo.

### Passo 2: Execução do Reparo
1. Criar o script `fix_office_ccleaner.ps1` em um diretório seguro de trabalho.
2. Iniciar um console do PowerShell com privilégios elevados ("Executar como Administrador").
3. Executar o script utilizando o comando:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; .\fix_office_ccleaner.ps1
   ```

### Passo 3: Verificação Manual (Pós-Reparo)
Para cada um dos aplicativos afetados, siga o roteiro de testes:

1. **Microsoft Excel:**
   * Tente abrir o Excel pelo menu Iniciar.
   * Tente abrir o Excel via comando Executar (`Win + R` -> `excel.exe`).
   * Tente abrir um arquivo `.xlsx` existente.
   * *Resultado Esperado:* O Excel deve abrir imediatamente sem exibir erros ou fechar abruptamente.

2. **Outros Aplicativos do Office (Word, PowerPoint, Outlook):**
   * Execute os aplicativos através de seus respectivos atalhos.
   * *Resultado Esperado:* Inicialização normal sem o erro de código 1060.

3. **Navegadores e utilitários (Chrome, Opera, TeamViewer):**
   * Inicialize os aplicativos.
   * *Resultado Esperado:* Todos os navegadores devem carregar normalmente.

---

## 5. Estratégia de Rollback (Reversão de Segurança)

Caso ocorra qualquer comportamento inesperado ou necessidade de desfazer o reparo:
1. Navegue até a pasta `IFEO_Backup` criada na Área de Trabalho do usuário (`C:\Users\<Usuario>\Desktop\IFEO_Backup`).
2. Dê um duplo clique nos arquivos `.reg` correspondentes aos aplicativos que deseja reverter (ex: `excel.exe.reg`).
3. Confirme a mesclagem no Registro do Windows.
4. O redirecionamento original do CCleaner será restaurado imediatamente.
