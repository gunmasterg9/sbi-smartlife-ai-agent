# 🔮 Future Product Roadmap: SBI SmartLife AI Agent

This document details the multi-phase roadmap to transition the **SBI SmartLife AI Agent** platform from a successful hackathon demonstration to a production-scale growth platform capable of serving State Bank of India's 500M+ customers.

---

## 📅 Roadmap Overview

```
   Phase 1 (Q3 2026)      Phase 2 (Q4 2026)      Phase 3 (Q1 2027)      Phase 4 (Q2 2027)
 ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
 │ CBS Integration   │  │ Branch Pilot      │  │ Mobile App Launch │  │ Regional & Offline│
 │ • Kafka Streaming │  │ • RM Co-Pilot     │  │ • YONO 2.0 Embed  │  │ • Local Voice LLM │
 │ • ISO 20022 Specs │  │ • 50 Key Branches │  │ • Scale-Out Infra │  │ • Rural Sync      │
 └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
           │                      │                      │                      │
           ▼                      ▼                      ▼                      ▼
       CBS Sync               RM Training             YONO App               Pan-India
```

---

## 🔌 Phase 1: Core Banking System (CBS) Integration (Q3 2026)

To move beyond database-polling, the platform must stream live transactions and customer events directly from SBI's Core Banking System.

### 1. Event-Driven Transaction Streaming
* **Technology**: Apache Kafka cluster deployed in SBI’s private cloud environment.
* **Mechanism**: Change Data Capture (CDC) using Debezium tracking ledger tables in real-time.
* **Event Structure**:
  * Transactions are serialized as JSON/Avro events and pushed to Kafka topics (e.g., `sbi.cbs.transactions`).
  * The **Life Events Agent** acts as a Kafka consumer, processing events asynchronously to detect pattern changes (e.g., repeating merchant payments, salary credit increases).

### 2. ISO 20022 Banking Messages
* Standardize all communication channels with the CBS to adhere to ISO 20022 compliance schemas:
  * `pacs.008` (Customer Credit Transfer) for incoming deposits.
  * `camt.053` (Bank to Customer Statement) for generating dynamic spending summaries for the Digital Twin.

---

## 🏢 Phase 2: Branch pilot for RM Co-Pilot (Q4 2026)

Deploying a desktop dashboard co-pilot for Relationship Managers (RMs) in 50 flagship metro branches to evaluate system performance and model precision.

### 1. Relationship Manager Portal
* **Features**:
  * **Daily Lead Feed**: Shows customers flagged by the **Life Events Agent** with high conversion probabilities (e.g., "Aarav Sharma: 89% Home Loan Intent").
  * **Conversation Assistant**: Suggests email/WhatsApp scripts drafted by the **Engagement Agent** conforming to compliance templates.
  * **CSAT & CRM Integration**: Writes audit logs directly back to SBI's Siebel CRM database.

### 2. Feedback Loop & RLHF
* RMs rate agent suggestions (Thumbs Up / Thumbs Down) with optional feedback notes.
* Feedback data is fed back into a reinforcement learning pipeline to fine-tune the orchestrator's routing and specialist agent prompts.

---

## 📱 Phase 3: YONO Mobile Application Integration (Q1 2027)

Integrating the AI Assistant and Digital Twin directly into the primary YONO 2.0 app using a micro-frontend architecture.

### 1. Embeddable Chat Widget
* A React Native / Flutter chat widget embedded inside the YONO dashboard.
* Communicates with backend endpoints using secure WebSockets for real-time streaming tokens and reduced latency.

### 2. Infrastructure Scale-Out (500M Accounts)
* **API Gateway**: Kong Gateway routing requests to stateless FastAPI microservice nodes.
* **Database Scalability**:
  * **PostgreSQL Cluster**: Single primary node for writes, with multiple read-replicas geographically distributed to match branch regions (North, South, East, West).
  * **Connection Pooling**: PgBouncer managing DB connections to maintain under 5ms transaction resolution.
  * **Caching Layer**: Redis cluster caching customer profiles, digital twin attributes, and recurring agent recommendations for up to 24 hours.

---

## 🗣️ Phase 4: Regional Localization & Rural Offline Sync (Q2 2027)

Supporting SBI's massive rural customer base through multi-lingual voice recognition and offline data-saving tools.

### 1. Multi-Lingual Regional Voice Support
* Integrates Google Cloud Speech-to-Text and Text-to-Speech models.
* Supported Languages: Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, and Gujarati.
* Conversational routing preserves regional contexts, recognizing localized banking terminology.

### 2. Local Voice LLM Processing
* Deployment of distilled, quantized open-weights models (e.g., Llama-3-8B-Instruct-INT4) on localized branch servers.
* Allows conversational queries to be processed at the branch level without relying on high-bandwidth central cloud queries.

### 3. Rural Offline Sync (Low Connectivity)
* **Offline Storage**: Uses HTML5 IndexedDB inside the web interface to store interaction queues when connectivity drops.
* **Sync Protocol**: Queued interactions are encrypted and stored locally. When a network signal is established (or during branch visits), the local client triggers a synchronization API, writing the backlog to the PostgreSQL audit table and updating the Digital Twin.
