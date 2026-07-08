#!/bin/sh
# Script para importar o workflow de relatório diário no n8n
# Uso: ./import-workflow.sh [container_name]
# O container do n8n precisa estar rodando

CONTAINER="${1:-solaris-n8n}"
WORKFLOW_FILE="/import/daily_analysis_workflow.json"
API_KEY="${N8N_API_KEY:-}"

echo "📥 Importando workflow para o container $CONTAINER..."

# Executa o comando de import dentro do container
docker exec -e N8N_API_KEY="$API_KEY" "$CONTAINER" n8n import:workflow --input="$WORKFLOW_FILE" --api-key="$API_KEY"

if [ $? -eq 0 ]; then
  echo "✅ Workflow importado com sucesso!"
  echo "🌐 Acesse http://localhost:5678 para visualizar no n8n"
else
  echo "❌ Erro ao importar workflow"
  echo ""
  echo "Alternativa manual:"
  echo "1. Acesse http://localhost:5678"
  echo "2. Vá em Workflows > Import from File"
  echo "3. Selecione: n8n/workflows/daily_analysis_workflow.json"
  echo "4. Ative o workflow"
fi
