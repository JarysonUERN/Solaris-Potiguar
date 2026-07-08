
# Solaris Potiguar — Business Rules

Este documento descreve as principais regras de negócio do Solaris Potiguar, uma plataforma de apoio à decisão baseada em IA para pequenos produtores e cooperativas que utilizam energia solar.

---

# BR001 — Um usuário possui apenas uma propriedade cadastrada

Cada usuário pode cadastrar apenas **uma propriedade** no MVP.

**Justificativa:** simplificar o escopo do hackathon e reduzir a complexidade da aplicação.

---

# BR002 — O onboarding deve ser concluído antes da primeira análise

Nenhuma análise poderá ser executada enquanto o usuário não concluir o onboarding.

Campos obrigatórios:

- Nome da propriedade
- Cidade
- Potência instalada (kWp)
- Tipo de operação
- Consumo médio mensal
- Descrição da operação

---

# BR003 — A cidade determina a previsão climática

A previsão meteorológica será obtida automaticamente através da API Open-Meteo utilizando a cidade cadastrada pelo usuário.

O usuário não informa dados climáticos manualmente.

---

# BR004 — Toda análise utiliza a previsão meteorológica mais recente

Antes da execução dos agentes, o sistema deve consultar a API de clima.

Caso a consulta falhe:

- A análise não deve ser executada.
- O usuário deve ser informado sobre a indisponibilidade do serviço.

---

# BR005 — O perfil operacional influencia o comportamento da IA

Cada propriedade deve possuir um perfil operacional.

Perfis disponíveis:

- Irrigação agrícola
- Pecuária
- Avicultura
- Agroindústria
- Comércio
- Residencial rural
- Outro

Cada perfil fornece um contexto inicial para o Consumption Agent.

---

# BR006 — A descrição da operação complementa o perfil

Além do perfil operacional, o usuário poderá descrever sua rotina em linguagem natural.

Exemplo:

> "As bombas funcionam normalmente entre 14h e 17h."

Essa descrição será utilizada pelos agentes como contexto adicional durante a análise.

---

# BR007 — Os equipamentos principais influenciam as recomendações

O usuário poderá selecionar os principais equipamentos consumidores de energia.

Exemplos:

- Bombas de irrigação
- Câmara fria
- Motores elétricos
- Sistema de ventilação
- Ordenhadeiras
- Iluminação

Essas informações são utilizadas pelo Consumption Agent.

---

# BR008 — O sistema considera a existência de baterias

Caso a propriedade possua baterias:

- O Storage Agent participa da análise.

Caso contrário:

- Recomendações relacionadas ao armazenamento não serão geradas.

---

# BR009 — A geração estimada depende da potência instalada

A geração estimada considera:

- Potência instalada (kWp)
- Irradiação prevista
- Condições climáticas

---

# BR010 — O armazenamento é limitado pela capacidade informada

A energia recomendada para armazenamento nunca poderá ultrapassar a capacidade de baterias cadastrada pelo usuário.

---

# BR011 — O sistema apenas recomenda ações

O Solaris Potiguar não controla equipamentos automaticamente.

O sistema apenas fornece recomendações.

Exemplos:

- Antecipar irrigação
- Armazenar energia
- Aproveitar período de alta geração

A decisão permanece sempre com o usuário.

---

# BR012 — As recomendações devem ser compreensíveis

Todas as recomendações devem ser apresentadas em linguagem simples.

Evitar:

- Métricas complexas
- Linguagem excessivamente técnica

Exemplo:

❌ Irradiância prevista: 7,6 kWh/m²

✅ Amanhã haverá excelente geração solar entre 10h e 13h.

---

# BR013 — Toda análise é composta por quatro agentes

Uma análise somente será considerada concluída após a execução de:

1. Weather Agent
2. Consumption Agent
3. Storage Agent
4. Orchestrator Agent

---

# BR014 — O Orchestrator não cria dados

O Orchestrator apenas sintetiza os resultados produzidos pelos demais agentes.

Ele não altera:

- previsões meteorológicas;
- cálculos energéticos;
- classificações produzidas pelos outros agentes.

---

# BR015 — O histórico registra todas as análises

Após uma análise bem-sucedida, o sistema deve armazenar:

- Data da análise
- Resumo da recomendação
- Recomendações geradas
- Economia estimada (quando disponível)

---

# BR016 — A flexibilidade operacional influencia as recomendações

Durante o onboarding, o usuário informa se consegue alterar sua rotina operacional.

Caso a resposta seja negativa, o sistema não deve sugerir mudanças de horário que não possam ser executadas.

---

# BR017 — O Consumption Agent utiliza perfis de consumo

No MVP, o Consumption Agent utiliza:

- Perfil operacional selecionado
- Equipamentos cadastrados
- Descrição da rotina

O sistema não aprende automaticamente através de histórico real de consumo.

Essa funcionalidade fica prevista para versões futuras.

---

# BR019 — O relatório diário é enviado automaticamente para todos os usuários

Todos os dias às 05:00 UTC, o n8n dispara uma requisição para o endpoint interno `/api/daily/send_reports`.

O sistema então:
1. Itera todos os usuários com propriedades cadastradas
2. Para cada propriedade, executa análise completa (clima + energia + 4 agentes AI)
3. Envia um e-mail com o resumo para cada usuário

**Observação:** Se uma propriedade não possuir coordenadas (latitude/longitude), a análise é pulada e registrada como erro.

---

# BR020 — O relatório diário é autenticado por API Key

O endpoint `/api/daily/send_reports` não utiliza JWT (autenticação de usuário), mas sim uma **API Key** compartilhada via variável de ambiente `DAILY_ANALYSIS_API_KEY`.

A chave é enviada no header `X-API-Key` e comparada de forma segura (constant-time) com o valor esperado.

---

# BR018 — O objetivo do sistema é apoiar decisões

O Solaris Potiguar é uma plataforma de apoio à decisão.

Seu objetivo é auxiliar pequenos produtores na tomada de decisões relacionadas ao aproveitamento da energia solar.

O sistema não substitui softwares industriais de gestão energética.

---

# Regras dos Agentes

##  Weather Agent

Responsável por:

- Consultar a Open-Meteo API
- Interpretar a previsão climática
- Estimar o potencial de geração solar

---

##  Consumption Agent

Responsável por:

- Interpretar o perfil operacional
- Analisar os equipamentos cadastrados
- Considerar a descrição da rotina
- Identificar oportunidades de deslocamento de carga

---

## Storage Agent

Responsável por:

- Verificar disponibilidade de baterias
- Avaliar oportunidades de armazenamento
- Recomendar quando armazenar ou consumir imediatamente

---

##  Orchestrator Agent

Responsável por:

- Receber as análises dos demais agentes
- Consolidar os resultados
- Resolver conflitos entre recomendações
- Produzir uma recomendação final em linguagem natural

---

# Objetivo do Produto

O Solaris Potiguar não busca maximizar a geração de energia.

Seu objetivo é ajudar pequenos produtores, cooperativas e agroindústrias a **maximizar o aproveitamento econômico da energia solar**, fornecendo recomendações inteligentes baseadas em:

- previsão meteorológica;
- características da propriedade;
- perfil operacional;
- disponibilidade de armazenamento;
- análise colaborativa de múltiplos agentes de IA.

Essa é a principal regra de negócio do sistema e representa sua proposta de valor.