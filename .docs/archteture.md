                React Frontend
                       │
                REST API (Rails)
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
    PostgreSQL              Open-Meteo API
          │
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
 Recommendation
             │
             ▼
      React Dashboard