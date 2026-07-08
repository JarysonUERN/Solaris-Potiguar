<img src= "FrontEnd\src\assets\images\SolarisP.png" />

<div style= "margin: 20px;">

> **AI-powered decision support for small solar energy producers in Northeast Brazil.**
</div>
Solaris Potiguar is an AI-powered decision support platform that helps small rural producers, cooperatives, and agribusinesses maximize the value of their photovoltaic systems. By combining weather forecasts, operational context, and multi-agent reasoning accelerated by AMD infrastructure, Solaris transforms complex energy data into simple, actionable recommendations.



# The Problem

Northeast Brazil has one of the highest solar irradiation levels in the world, making photovoltaic generation increasingly accessible to small rural producers and cooperatives.

However, owning solar panels does not automatically mean using energy efficiently.

Most small producers still decide **when to consume**, **when to shift activities**, and **how to use stored energy** based on experience rather than data. While large power plants rely on sophisticated Energy Management Systems (EMS), smaller operations rarely have access to affordable decision-support tools.

As a result, many producers miss opportunities to increase self-consumption, better utilize solar generation, and reduce electricity costs.

---

# Our Solution

Solaris Potiguar democratizes intelligent energy management.

Instead of presenting complex dashboards and technical metrics, Solaris provides clear operational recommendations based on each property's characteristics.

The platform combines:

- Weather forecasts
- Solar generation estimation
- Operational profile
- Consumption patterns
- Battery availability (when applicable)

These inputs are analyzed collaboratively by multiple AI agents, producing recommendations such as:

> **"High solar generation is expected tomorrow between 10 AM and 1 PM. If possible, schedule irrigation during this period to maximize self-consumption."**

The goal is not to replace existing Energy Management Systems, but to make intelligent decision support accessible to smaller producers.

---

# Multi-Agent Architecture

| Agent | Responsibility |
|--------|----------------|
| 🌤️ Weather Agent | Retrieves and interprets weather forecasts and solar irradiation data |
| ⚡ Consumption Agent | Analyzes operational profiles and consumption behavior |
| 🔋 Storage Agent | Evaluates battery availability and energy storage opportunities |
| 🧠 Orchestrator Agent | Combines all analyses into practical recommendations in natural language |

---

# Technology Stack

## Frontend

| Technology | Detail |
|------------|--------|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | 4 |
| React Router DOM | 7 |
| Lucide React | Icons |
| Oxlint | Linter |
| i18n | Portuguese / English |
| Custom Hooks | useTheme |

**Pages (6 routes):** Landing, Login, Register, Onboarding, Dashboard, Result

---

## Backend

q| Technology | Detail |
|------------|--------|
| Framework | Ruby on Rails 7.2 (API Only) |
| Language | Ruby 4.0 |
| Database | PostgreSQL 16 |
| Authentication | JWT + bcrypt |
| HTTP Client | HTTParty (Open-Meteo, Fireworks AI) |
| Web Server | Puma (port 3000) |

**AI Agents (4 specialized models):**

| Agent | Service | Role |
|-------|---------|------|
| 🌤️ Climate | `ClimateService` | Retrieves solar irradiation, cloud cover, temperature |
| ⚡ Generation | `GenerationAgentService` | Analyzes solar generation potential |
| 🔋 Storage | `StorageAgentService` | Evaluates battery usage opportunities |
| 🧠 Orchestrator | `OrchestratorAgentService` | Synthesizes all insights into recommendations |

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/solaris_potiguar/login` | User authentication (returns JWT) |
| POST | `/solaris_potiguar/register` | Create new user |
| GET | `/solaris_potiguar/user` | Get current user profile |
| PUT | `/solaris_potiguar/user` | Update user profile |
| POST | `/solaris_potiguar/onboarding` | Register property / solar setup |
| POST | `/api/setup` | Create property |
| GET | `/api/setup/:id` | Get property details |
| PUT | `/api/setup/:id` | Update property |
| GET | `/api/climate/fetch/:property_id` | Fetch weather data (Open-Meteo) |
| POST | `/api/analysis` | Run multi-agent analysis |
| GET | `/api/analysis/:id` | Get single analysis result |
| GET | `/api/analysis/property/:property_id` | List analyses for a property |

---

### User Onboarding

- AMD Developer Cloud (MI300X GPU instances)
- AMD Instinct MI300X GPUs
- Fireworks AI (Llama 3.1 8B Instruct)
- ROCm
- Multi-agent inference pipeline

---

# Product Flow

The platform follows a simple workflow designed for non-technical users.

```
User Setup
      ↓
Weather Forecast
      ↓
Solar Generation Estimation
      ↓
Multi-Agent Analysis
      ↓
Operational Recommendation
```

Instead of technical charts, users receive practical guidance that supports better daily decisions.

---

#  Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Marketing page with hero carousel, AI architecture explainer |
| `/login` | Login | Email/password authentication |
| `/register` | Register | User registration (name, email, phone, CPF) |
| `/onboarding` | Onboarding | Multi-step property setup (panels, battery, consumption) |
| `/dashboard` | Dashboard | Weather forecast, recommendations, analysis history |
| `/result` | Result | Detailed analysis with AI summary and savings estimate |

---

#  Database Models

| Table | Key Fields |
|-------|------------|
| **users** | `full_name`, `email`, `password_digest`, `phone`, `cpf` (unique) |
| **properties** | `farm_name`, `city`, `installed_power_kwp`, `has_battery`, `battery_capacity_kwh`, `average_daily_consumption_kwh`, `operation_type`, `main_equipments` (JSONB), `user_id` (FK) |
| **analyses** | `property_id` (FK), `solar_irradiation`, `estimated_generation_kwh`, `estimated_consumption_kwh`, `balance_kwh`, `classification`, `battery_charge_kwh`, `executive_summary`, `recommendations`, `estimated_savings_kwh`, `raw_data` (JSONB) |

---

#  Analysis Pipeline

1. **Weather Fetch** — Retrieves forecast data from Open-Meteo API for the property's coordinates
2. **Energy Calculation** — Estimates solar generation and consumption via `EnergyCalculatorService`
3. **Classification** — Classifies energy balance (`EXCEDENTE`, `EQUILIBRIO`, `BAIXA_GERACAO`, `RISCO_DEFICIT`, `DEFICIT`)
4. **Multi-Agent Analysis** — 4 specialized AI agents collaborate via Fireworks AI (Llama 3.1 8B)
5. **Serialization** — Results saved to PostgreSQL, returned as structured JSON

---

#  Project Structure

```
Solaris-Potiguar/

├── FrontEnd/                          # React + Vite + TypeScript SPA
│   ├── src/
│   │   ├── components/                # Shared UI components
│   │   ├── hooks/                     # Custom React hooks (useTheme)
│   │   ├── i18n/                      # Internationalization (PT / EN)
│   │   ├── pages/                     # 6 route pages
│   │   ├── routes/                    # React Router configuration
│   │   ├── services/                  # API client
│   │   ├── styles/                    # Tailwind, fonts, theme
│   │   └── types/                     # TypeScript type definitions
│   ├── docs/                          # API documentation
│   ├── index.html
│   ├── vite.config.ts
│   └── Dockerfile
│
├── BackEnd/                           # Ruby on Rails API
│   ├── app/
│   │   ├── controllers/api/           # REST endpoints
│   │   ├── controllers/solaris_potiguar/  # Auth & onboarding
│   │   ├── models/                    # User, Property, Analysis
│   │   ├── serializers/               # JSON serialization
│   │   └── services/agents/           # 4 AI agents
│   ├── config/                        # Rails configuration
│   ├── db/migrate/                    # Database migrations
│   └── Dockerfile
│
├── .docs/                             # Project documentation
│   ├── Images/                        # Architecture & flow diagrams
│   ├── RegrasdNegocio.md              # Business rules (PT)
│   ├── useCase.md                     # Use case specifications
│   └── archteture.md                  # ASCII architecture diagram
│
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

---

# Roadmap

## Frontend MVP ✅

- [x] Landing Page
- [x] Authentication UI
- [x] Multi-step onboarding
- [x] Dashboard
- [x] Analysis Result Page
- [x] Dark / Light Theme
- [x] Internationalization (PT / EN)

---

## Backend MVP ✅

- [x] Database Modeling (3 tables: users, properties, analyses)
- [x] Domain Models (User, Property, Analysis)
- [x] REST API (12 endpoints, 6 controllers)
- [x] JWT Authentication (bcrypt + JWT tokens)
- [x] Open-Meteo Integration (weather forecast + geocoding)
- [x] Fireworks AI Integration (Llama 3.1 8B multi-agent)
- [x] Frontend Integration (all pages connected)

---

## Implemented

- [x] **Automatic daily email report** — n8n schedules at 05:00 UTC, Rails generates analyses and sends them via SMTP
- [x] **Docker automation** — n8n as a service in docker-compose, workflow pre-configured

---


# Market Opportunity

| Market | Description |
|---------|-------------|
| **TAM** | Brazilian distributed photovoltaic generation market |
| **SAM** | Rural producers and small businesses using photovoltaic systems |
| **SOM** | Small producers and cooperatives across Northeast Brazil |

---

# Business Model

### B2B SaaS

Monthly subscriptions for:

- Agricultural cooperatives
- Rural producers
- Small agribusinesses

### White Label

Platform licensing for:

- Local solar integrators
- Energy consulting companies

---

# Why AMD?

Solaris Potiguar runs its multi-agent reasoning pipeline on Fireworks AI, which leverages AMD infrastructure to deliver fast and cost-effective large model inference.
Each analysis request triggers four sequential AI agents — Weather, Consumption, Storage, and Orchestrator — all powered by fireworks/models/gpt-oss-120b, a 120-billion parameter open-source model. The full pipeline completes in approximately 20 seconds, producing a structured, property-specific recommendation from raw climate and operational data.

Running a 120B parameter model at this scale through AMD-accelerated infrastructure makes it economically viable to serve small rural producers — a segment that cannot afford enterprise-grade energy software. The combination of AMD compute efficiency and the Fireworks AI API allows Solaris to keep inference costs low enough to support a SaaS model accessible to cooperatives and small agribusinesses.

---

# Elevator Pitch

> Every day, thousands of small rural producers in Northeast Brazil make energy decisions manually. Solaris Potiguar brings AI-powered decision support to these producers by combining weather forecasts, operational context, and multi-agent reasoning accelerated by AMD infrastructure. Instead of expensive enterprise software, Solaris delivers simple recommendations that help producers make better use of their own solar energy.

---

# How to Run with Docker

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- `config/master.key` file present inside the `BackEnd/` directory (Rails master key)

## Environment Variables

Copy the example file and fill in the variables:

```bash
cp .env.example .env
```

Expected content of `.env`:

```env
# ─── Required ─────────────────────────────────────
RAILS_MASTER_KEY=<content of config/master.key>
FIREWORKS_API_KEY=<your Fireworks AI key>

# ─── API key for daily automation (n8n → Rails) ──
# Generate with: openssl rand -hex 32
DAILY_ANALYSIS_API_KEY=<your secret key>

# ─── SMTP for sending emails ─────────────────────
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=<your email>
SMTP_PASSWORD=<your app password>
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS=true
N8N_SMTP_SENDER=noreply@solarispotiguar.com

# ─── Optional ─────────────────────────────────────
N8N_HOST=localhost
N8N_PROTOCOL=http
```

## Starting the Services

```bash
# Build and start all services
docker compose up --build

# Run in the background (detached)
docker compose up --build -d

# Stop the services
docker compose down

# Stop and remove volumes (database data)
docker compose down -v
```

## Accessing the Application

| Service | URL |
|----------|------------------------------|
| Frontend | http://localhost |
| Backend | http://localhost:3000 |
| n8n | http://localhost:5678 |
| Database | http://localhost:5432 (postgres/postgres) |

The Nginx instance in the frontend container automatically proxies calls to `/api/`, `/solaris_potiguar/`, and `/up` to the backend.

## Import the Workflow into n8n

After starting the containers, import the daily report workflow:

**Windows (PowerShell):**
```powershell
.\n8n\import-workflow.ps1
```

**Linux / macOS:**
```bash
chmod +x n8n/import-workflow.sh
./n8n/import-workflow.sh
```

**Or manually:**
1. Go to http://localhost:5678
2. Open **Workflows** > **Import from File**
3. Select `n8n/workflows/daily_analysis_workflow.json`
4. Activate the workflow (the **Active** button)

> The workflow runs automatically every day at **05:00 UTC** (about **02:00 BRT**).

## Automation Flow

```
⏰ n8n Schedule Trigger (05:00 UTC)
        │
        ▼
📡 POST /api/daily/send_reports  (with X-API-Key)
        │
        ▼
⚙️ Rails iterates through all users/properties
        │
        ├── 🌤️ ClimateService (Open-Meteo)
        ├── ⚡ EnergyCalculatorService
        ├── 🤖 WeatherAgent / ConsumptionAgent / StorageAgent
        ├── 🧠 OrchestratorAgent
        └── 💾 Saves the analysis to the database
        │
        ▼
📧 DailyAnalysisMailer sends an email to each user
        │
        ▼
✅ Summary returned to n8n
```

## Useful Commands

```bash
# View logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f n8n
docker compose logs -f db

# Run commands in the backend
docker compose exec backend rails db:migrate
docker compose exec backend rails db:seed
docker compose exec backend rails console

# Run commands in the frontend
docker compose exec frontend sh

# Rebuild a specific service
docker compose build backend
docker compose build frontend

# Check n8n workflow execution
docker compose exec n8n n8n list:workflows
```

---

## Developed for the **AMD Hackathon 2026 – Unicorn Track**.