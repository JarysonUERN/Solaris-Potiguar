# API Reference — Solaris Potiguar

Base URL: `http://localhost:3000`

---

## Autenticação

### POST /solaris_potiguar/login

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Resposta (200):**
```json
{
  "token": "eyJ...",
  "email": "user@example.com",
  "full_name": "João Silva",
  "property_id": 1
}
```

---

### POST /solaris_potiguar/register

```json
{
  "full_name": "João Silva",
  "email": "user@example.com",
  "password": "123456",
  "phone": "(84) 99999-9999",
  "has_whatsapp": true,
  "cpf": "123.456.789-00"
}
```

**Resposta (201):** dados do usuário criado.

---

## Usuário

Requires `Authorization: Bearer <token>` header.

### GET /solaris_potiguar/user

Retorna dados do usuário autenticado.

### PUT /solaris_potiguar/user

```json
{ "full_name": "...", "phone": "...", "has_whatsapp": false }
```

---

## Onboarding / Propriedade

### POST /solaris_potiguar/onboarding

Cria a propriedade do usuário autenticado.

```json
{
  "farm_name": "Sítio Esperança",
  "city": "Apodi",
  "installed_power_kwp": 10.5,
  "average_daily_consumption_kwh": 40,
  "operation_type": "irrigacao",
  "operation_description": "As bombas funcionam das 14h às 17h",
  "has_battery": true,
  "battery_capacity_kwh": 20,
  "peak_consumption_period": "afternoon",
  "flexible_operation": true,
  "main_equipments": ["Bombas de irrigação", "Motor elétrico"]
}
```

---

## Setup (CRUD de propriedade)

Requires `Authorization: Bearer <token>`.

### POST /api/setup
Cria uma propriedade (mesmo payload do onboarding).

### GET /api/setup/:id
Retorna os dados da propriedade.

### PUT /api/setup/:id
Atualiza a propriedade.

---

## Clima

### GET /api/climate/fetch/:property_id

Retorna dados climáticos atualizados da Open-Meteo para a propriedade.

---

## Análise

Requires `Authorization: Bearer <token>`.

### POST /api/analysis

```json
{ "property_id": 1 }
```

Executa análise completa (clima + energia + 4 agentes AI). Retorna o resultado completo da análise.

### GET /api/analysis/:id

Retorna uma análise específica.

### GET /api/analysis/property/:property_id

Lista as últimas 20 análises de uma propriedade.

---

## Relatório Diário (Automação n8n)

Requires `X-API-Key` header (não JWT).

### POST /api/daily/send_reports

Endpoint interno chamado pelo n8n para gerar análises de todas as propriedades e enviar e-mails.

**Headers:**
```
X-API-Key: <DAILY_ANALYSIS_API_KEY>
Content-Type: application/json
```

**Resposta (200):**
```json
{
  "message": "Relatório diário processado",
  "total_analyses": 5,
  "total_errors": 0,
  "results": [
    { "user": "joao@example.com", "property": "Sítio Esperança", "analysis_id": 42 }
  ],
  "errors": []
}
```

---

## Modelos de Dados

### User
| Campo | Tipo | Descrição |
|---|---|---|
| id | bigint | PK |
| full_name | string | Obrigatório |
| email | string | Único, formato email |
| password_digest | string | bcrypt |
| phone | string | Opcional |
| has_whatsapp | boolean | Default: false |
| cpf | string | Único, opcional |

### Property
| Campo | Tipo | Descrição |
|---|---|---|
| id | bigint | PK |
| user_id | bigint | FK → users |
| farm_name | string | Obrigatório |
| city | string | Obrigatório |
| latitude | decimal(10,7) | Geocodificado |
| longitude | decimal(10,7) | Geocodificado |
| installed_power_kwp | decimal(10,3) | Obrigatório |
| has_battery | boolean | Default: false |
| battery_capacity_kwh | decimal(10,3) | Se has_battery |
| average_daily_consumption_kwh | decimal(10,3) | Obrigatório |
| operation_type | string | irrigacao, avicultura, comercio, etc. |
| peak_consumption_period | string | morning, afternoon, night |
| flexible_operation | boolean | Default: false |
| main_equipments | jsonb | Lista de equipamentos |
| operation_description | text | Descrição em linguagem natural |

### Analysis
| Campo | Tipo | Descrição |
|---|---|---|
| id | bigint | PK |
| property_id | bigint | FK → properties |
| analysis_date | datetime | Default: now() |
| solar_irradiation | decimal(10,2) | kWh/m² |
| temperature | decimal(5,2) | °C |
| estimated_generation_kwh | decimal(10,3) | Geração estimada |
| estimated_consumption_kwh | decimal(10,3) | Consumo estimado |
| balance_kwh | decimal(10,3) | Geração - Consumo |
| classification | string | superavit / deficit / equilibrio |
| battery_charge_kwh | decimal(10,3) | Carga da bateria |
| battery_status | string | charging / discharging / idle |
| executive_summary | text | Resumo do Orchestrator Agent |
| recommendations | text | Recomendações |
| estimated_savings_kwh | decimal(10,3) | Economia em kWh |
| estimated_savings_currency | decimal(12,2) | Economia em R$ |
| currency | string | "BRL" |
| raw_data | jsonb | Dados completos dos agentes |
