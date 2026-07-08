# Use Cases — Solaris Potiguar

This document describes the primary user interactions with Solaris Potiguar.

---

# UC-01 — Explore the Platform

| Field | Description |
|--------|-------------|
| **Primary Actor** | Visitor |
| **Goal** | Understand the platform's value proposition and navigate to authentication pages. |
| **Preconditions** | None |
| **Postconditions** | Visitor may proceed to registration or login. |

## Main Flow

1. Visitor accesses the landing page.
2. The system presents the platform, its benefits and AI architecture.
3. The visitor chooses to register or log in.

---

# UC-02 — Register an Account

| Field | Description |
|--------|-------------|
| **Primary Actor** | Visitor |
| **Goal** | Create a new user account. |
| **Preconditions** | None |
| **Postconditions** | User account is created. |

## Main Flow

1. User provides personal information.
2. System validates required fields.
3. System creates the account.
4. User is redirected to onboarding.

## Alternative Flows

- Invalid data.
- Email already registered.

---

# UC-03 — Authenticate

| Field | Description |
|--------|-------------|
| **Primary Actor** | Registered User |
| **Goal** | Access the platform securely. |
| **Preconditions** | Existing account. |
| **Postconditions** | Authenticated session established. |

## Main Flow

1. User enters credentials.
2. System validates authentication.
3. User accesses the dashboard.

## Alternative Flows

- Invalid credentials.

---

# UC-04 — Configure Property

| Field | Description |
|--------|-------------|
| **Primary Actor** | Authenticated User |
| **Goal** | Register the property's energy profile. |
| **Preconditions** | Authenticated user. |
| **Postconditions** | Property configuration is stored. |

## Main Flow

1. User provides property information.
2. User informs photovoltaic system data.
3. User selects an operational profile.
4. User describes the operation routine.
5. System validates and stores the configuration.
6. Dashboard becomes available.

---

# UC-05 — View Dashboard

| Field | Description |
|--------|-------------|
| **Primary Actor** | Authenticated User |
| **Goal** | Monitor the property's current status. |
| **Preconditions** | Property configured. |
| **Postconditions** | None. |

## Main Flow

1. User opens the dashboard.
2. System displays weather forecast.
3. System displays latest recommendation.
4. System displays previous analyses.

---

# UC-06 — Request Energy Analysis

| Field | Description |
|--------|-------------|
| **Primary Actor** | Authenticated User |
| **Goal** | Obtain an AI-based recommendation. |
| **Preconditions** | Property configured. |
| **Postconditions** | Analysis stored in history. |

## Main Flow

1. User requests a new analysis.
2. System retrieves weather data.
3. System estimates photovoltaic generation.
4. AI agents analyze:
   - Weather
   - Consumption
   - Storage
5. Orchestrator Agent consolidates the results.
6. Recommendation is presented.
7. Analysis is saved.

## Alternative Flows

- Weather service unavailable.
- AI service unavailable.

---

# UC-07 — View Analysis Details

| Field | Description |
|--------|-------------|
| **Primary Actor** | Authenticated User |
| **Goal** | Understand how the recommendation was generated. |
| **Preconditions** | Existing analysis. |
| **Postconditions** | None. |

## Main Flow

1. User selects an analysis.
2. System presents each AI agent's reasoning.
3. System presents the orchestrated recommendation.

---

# UC-08 — Update Profile

| Field | Description |
|--------|-------------|
| **Primary Actor** | Authenticated User |
| **Goal** | Update personal information. |
| **Preconditions** | Authenticated session. |
| **Postconditions** | User information updated. |

## Main Flow

1. User edits profile information.
2. System validates changes.
3. Updated information is saved.

---

# UC-09 — Update Property

| Field | Description |
|--------|-------------|
| **Primary Actor** | Authenticated User |
| **Goal** | Modify the property's configuration. |
| **Preconditions** | Property already registered. |
| **Postconditions** | Property configuration updated. |

## Main Flow

1. User edits the property's information.
2. System validates the new data.
3. Configuration is updated.

---

# UC-10 — Receive Daily Recommendation ✅

| Field | Description |
|--------|-------------|
| **Primary Actor** | System (n8n + Rails) |
| **Goal** | Notify users proactively about optimization opportunities. |
| **Preconditions** | SMTP configured, `DAILY_ANALYSIS_API_KEY` set, n8n workflow active. |
| **Postconditions** | Recommendation delivered via email. |

## Main Flow

1. **n8n Schedule Trigger** fires at 05:00 UTC.
2. n8n sends `POST /api/daily/send_reports` with `X-API-Key`.
3. Rails iterates all users and properties:
   - Retrieves weather data from Open-Meteo
   - Calculates energy generation, consumption, balance
   - Runs 4 AI agents (Weather, Consumption, Storage, Orchestrator)
   - Persists each analysis to the database
4. Rails sends a summary email via **DailyAnalysisMailer** to each user.
5. Rails returns a JSON summary to n8n.
6. n8n logs success (or triggers error flow on failure).

## Alternative Flows

- **Weather API unavailable**: analysis skipped for that property, logged as error.
- **AI service unavailable**: analysis skipped, logged as error.
- **Property missing coordinates**: skipped, logged as error.
- **n8n retry**: up to 3 retries with 5s interval on HTTP failure.

---

# Use Case Relationships

```text
Visitor
 ├── Explore Platform
 │
 ├── Register
 │      │
 │      ▼
 │ Configure Property
 │      │
 │      ▼
 │ View Dashboard
 │      ├── Request Analysis
 │      │        │
 │      │        ▼
 │      │  View Analysis Details
 │      │
 │      ├── Update Profile
 │      ├── Update Property
 │      └── Receive Daily Recommendation (n8n → sistema)
 │
 └── Login
        │
        ▼
   View Dashboard
```