# Script para importar o workflow de relatório diário no n8n
# Uso: .\import-workflow.ps1 [-ContainerName <nome>]
# O container do n8n precisa estar rodando

param(
    [string]$ContainerName = "solaris-n8n"
)

$WorkflowFile = "/import/daily_analysis_workflow.json"
$ApiKey = $env:N8N_API_KEY

Write-Host "📥 Importando workflow para o container $ContainerName ..." -ForegroundColor Cyan

if ($ApiKey) {
    docker exec -e "N8N_API_KEY=$ApiKey" $ContainerName n8n import:workflow --input="$WorkflowFile" --api-key="$ApiKey"
} else {
    docker exec $ContainerName n8n import:workflow --input="$WorkflowFile"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Workflow importado com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Acesse http://localhost:5678 para visualizar no n8n" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro ao importrar workflow" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativa manual:"
    Write-Host "1. Acesse http://localhost:5678"
    Write-Host "2. Va em Workflows > Import from File"
    Write-Host "3. Selecione: n8n/workflows/daily_analysis_workflow.json"
    Write-Host "4. Ative o workflow"
}
