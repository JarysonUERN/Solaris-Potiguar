# Architecture — Solaris Potiguar

## User-Facing Flow

```
                  React Frontend
                  (Port 80 / Nginx)
                         │
                   /api/**, /solaris_potiguar/**
                         │
                         ▼
                  Rails API (Port 3000)
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
      PostgreSQL              Open-Meteo API
            │                   (clima)
            ▼
     Energy Calculator
            │
            ▼
   ┌────────┼─────────┬────────┐
   ▼        ▼         ▼        ▼
 Weather Consumption Storage
  Agent     Agent     Agent
        \      |      /
         \     |     /
          ▼    ▼    ▼
        Orchestrator Agent
               │
               ▼
       Simplification Agent
               │
               ▼
       Fireworks AI (AMD Cloud)
               │
               ▼
   ┌──────────────────────────────┐
   │  Recommendation + Simplified  │
   │  Text + Savings               │
   └──────┬───────────────────────┘
          │
          ▼
   React Dashboard + Result Page

```

## Daily Automation Flow (n8n)

```
                  n8n (Port 5678)
                       │
              Schedule Trigger
              05:00 UTC daily
                       │
                       ▼
            POST /api/daily/send_reports
               Header: X-API-Key
                       │
                       ▼
              Rails DailyAnalysisController
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     User 1        User 2       User N
          │            │            │
          ▼            ▼            ▼
   Property(s)   Property(s)  Property(s)
          │            │            │
          ▼            ▼            ▼
   ┌──────────────────────────────┐
   │  ClimateService              │
   │  EnergyCalculatorService     │
   │  5 AI Agents (incl. Simpl.)  │
   │  Analysis.create!            │
   └──────────────┬───────────────┘
                 │
                 ▼
        DailyAnalysisMailer
                 │
                 ▼
     SMTP → Email do Usuário
```

## Docker Services

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   db    │◄───│ backend  │◄───│ frontend │    │   n8n    │
│Postgres │    │  Rails   │    │  Nginx   │    │workflow  │
│ :5432   │    │  :3000   │    │   :80    │    │  :5678   │
└─────────┘    └──────────┘    └──────────┘    └──────────┘
                     │
                     ▼
              Open-Meteo API
                     │
                     ▼
              Fireworks AI
              (AMD Cloud)
```

## Agent Architecture

```
Weather Agent
  ├── Input: clima (temperatura, irradiação, nebulosidade)
  ├── Modelo: Fireworks AI (gemma-7b-it)
  └── Output: análise textual do potencial solar

Consumption Agent
  ├── Input: perfil operacional, equipamentos, rotina
  ├── Modelo: Fireworks AI (gemma-7b-it)
  └── Output: análise do perfil de consumo e oportunidades

Storage Agent
  ├── Input: capacidade da bateria, geração estimada
  ├── Modelo: Fireworks AI (gemma-7b-it)
  └── Output: estratégia de armazenamento

Orchestrator Agent
  ├── Input: outputs dos 3 agentes + contexto original
  ├── Modelo: Fireworks AI (gemma-7b-it)
  └── Output: recomendação consolidada em linguagem natural

Simplification Agent
  ├── Input: output do Orchestrator Agent
  ├── Modelo: Fireworks AI (gemma-7b-it, explícito via `MODEL`)
  └── Output: texto simplificado em linguagem acessível (elimina jargão técnico)
```

Cada agente pode sobrescrever o modelo definindo a constante `MODEL` na subclasse. O `SimplificationAgentService` define `MODEL = "accounts/fireworks/models/gemma-7b-it"` explicitamente. Os demais usam o `DEFAULT_MODEL` do `BaseAgentService`.

### Idioma dos Agentes

Os agentes Orchestrator e Simplification respeitam o parâmetro `lang` enviado na requisição (`"pt"` ou `"en"`). O system prompt é ajustado dinamicamente para instruir o modelo a responder no idioma correto, incluindo exemplos de jargão a evitar em cada idioma.

## Docker Optimizations

Para reduzir o tempo de inicialização do container backend:

| Otimização | Benefício |
|---|---|
| Volume nomeado `bootsnap_cache:/rails/tmp/cache` | Persiste cache bootsnap entre restarts (evita recompilação) |
| `db:migrate` com fallback `db:prepare` | Evita carregar Rails para verificar existência do DB a cada startup |
| Bootsnap precompile no entrypoint se cache ausente | Garante cache mesmo em primeiro start |
| Gems não usadas removidas (sprockets, jbuilder, importmap, turbo, stimulus) | Reduz tempo de carregamento do Bundler em ~5-10s |
| `require "rails/all"` substituído por requires seletivos | Carrega apenas os componentes necessários (active_record, action_controller, action_view, action_mailer, active_job) |
