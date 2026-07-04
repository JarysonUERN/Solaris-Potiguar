#  Solaris Potiguar

> **AI-powered decision support for small solar energy producers in Northeast Brazil.**

Solaris Potiguar is an AI-powered decision support platform that helps small rural producers, cooperatives, and agribusinesses maximize the value of their photovoltaic systems. By combining weather forecasts, operational context, and multi-agent reasoning accelerated by AMD infrastructure, Solaris transforms complex energy data into simple, actionable recommendations.

Developed for the **AMD Hackathon 2026 – Unicorn Track**.

---

#  The Problem

Northeast Brazil has one of the highest solar irradiation levels in the world, making photovoltaic generation increasingly accessible to small rural producers and cooperatives.

However, owning solar panels does not automatically mean using energy efficiently.

Most small producers still decide **when to consume**, **when to shift activities**, and **how to use stored energy** based on experience rather than data. While large power plants rely on sophisticated Energy Management Systems (EMS), smaller operations rarely have access to affordable decision-support tools.

As a result, many producers miss opportunities to increase self-consumption, better utilize solar generation, and reduce electricity costs.

---

#  Our Solution

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

#  Multi-Agent Architecture

| Agent | Responsibility |
|--------|----------------|
| 🌤️ Weather Agent | Retrieves and interprets weather forecasts and solar irradiation data |
| ⚡ Consumption Agent | Analyzes operational profiles and consumption behavior |
| 🔋 Storage Agent | Evaluates battery availability and energy storage opportunities |
| 🧠 Orchestrator Agent | Combines all analyses into practical recommendations in natural language |

---

#  Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- i18n (Portuguese / English)
- Custom Hooks

---

## Backend

- Ruby on Rails (API Only)
- PostgreSQL
- RESTful API
- JWT Authentication

Planned endpoints:

```
POST /api/v1/login
POST /api/v1/register

GET  /api/v1/user
PATCH /api/v1/user

POST /api/v1/onboarding

GET  /api/v1/dashboard
POST /api/v1/analysis
GET  /api/v1/analysis/history
```

---

## AI & Cloud

- AMD Developer Cloud
- AMD Instinct MI300X GPUs
- Fireworks AI
- Llama Models
- ROCm

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

# 📦 Project Structure

```
Solaris-Potiguar/

├── FrontEnd/
│   ├── src/
│   ├── docs/
│   └── ...
│
├── BackEnd/
│   ├── app/
│   ├── config/
│   └── ...
│
├── docs/
│   ├── Architecture.md
│   ├── BusinessRules.md
│   ├── API.md
│   ├── Pitch.md
│   └── Diagrams/
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

#  Roadmap

## Frontend MVP

- [x] Landing Page
- [x] Authentication UI
- [x] Multi-step onboarding
- [x] Dashboard
- [x] Analysis Result Page
- [x] Dark / Light Theme
- [x] Internationalization (PT / EN)

---

## Backend MVP

- [ ] Database Modeling
- [ ] Domain Models
- [ ] REST API
- [ ] JWT Authentication
- [ ] Open-Meteo Integration
- [ ] Fireworks AI Integration
- [ ] Frontend Integration

---

## Future Improvements

- [ ] Automated daily recommendations via Email / WhatsApp
- [ ] Cooperative management dashboard
- [ ] White-label platform for solar integrators
- [ ] SaaS subscription model
- [ ] Deployment on AMD Developer Cloud
- [ ] End-to-end tests

---

#  Market Opportunity

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

#  Why AMD?

Solaris leverages AMD infrastructure to execute multiple AI agents efficiently and cost-effectively.

AMD Developer Cloud and Fireworks AI enable scalable inference, allowing the platform to orchestrate specialized reasoning agents that collaborate to generate contextual recommendations for each property.

The AMD ecosystem makes enterprise-grade AI accessible to applications that serve small producers and regional businesses.

---

#  Elevator Pitch

> Every day, thousands of small rural producers in Northeast Brazil make energy decisions manually. Solaris Potiguar brings AI-powered decision support to these producers by combining weather forecasts, operational context, and multi-agent reasoning accelerated by AMD infrastructure. Instead of expensive enterprise software, Solaris delivers simple recommendations that help producers make better use of their own solar energy.

---

## Developed for the **AMD Hackathon 2026 – Unicorn Track**.