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
      Fireworks AI (AMD Cloud)
              │
              ▼
  ┌──────────────────────────────┐
  │  Recommendation + Savings     │
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
  │  4 AI Agents                 │
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
  ├── Modelo: Fireworks AI (Llama)
  └── Output: análise textual do potencial solar

Consumption Agent
  ├── Input: perfil operacional, equipamentos, rotina
  ├── Modelo: Fireworks AI (Llama)
  └── Output: análise do perfil de consumo e oportunidades

Storage Agent
  ├── Input: capacidade da bateria, geração estimada
  ├── Modelo: Fireworks AI (Llama)
  └── Output: estratégia de armazenamento

Orchestrator Agent
  ├── Input: outputs dos 3 agentes + contexto original
  ├── Modelo: Fireworks AI (Llama)
  └── Output: recomendação consolidada em linguagem natural
```
