# 🛡️ Security & Compliance Architecture

The SBI SmartLife Platform is engineered with banking-grade security and strict compliance mechanisms, satisfying both regulatory standards (RBI circulars) and legal frameworks (DPDP Act 2023).

---

## 🔒 1. Data Protection & DPDP Act 2023 Compliance

The Digital Personal Data Protection (DPDP) Act imposes strict rules on the processing of digital personal data in India. Our system implements these safeguards natively:

### Consent Management Engine
- **Granular Consent**: Customers can explicitly grant or revoke permissions for different AI processing activities (e.g., Transaction Profiling, Product Cross-selling, Life Event Predictions).
- **Consent Revocation Flow**: If a customer withdraws consent, the backend flags the database and dynamically excludes their records from the Customer Digital Twin processing queues.
- **Anonymization Engine**: In the event of a "Right to be Forgotten" request, customer identification columns (Name, PAN, Aadhaar) are masked, while keeping anonymized transaction categories intact for macro-segmentation analytics.

---

## 📝 2. Banking-Grade Audit Trails

Every data modification or AI decision is subject to absolute audit logs:

- **Immutability**: Audit logs are written directly to a read-heavy SQL table (`audit_logs`) and cannot be edited or deleted by user roles.
- **Agent Accountability**: The system logs every action executed by the 6 AI agents, containing:
  - Agent ID and Specialist classification.
  - Context tokens, output reasoning, and action targets.
  - Execution duration (in milliseconds) and model confidence score.
- **Access Logs**: Relational reads of sensitive customer profiles or twins write an audit record containing the accessor's user ID, target customer ID, IP address, and timestamp.

---

## 🔑 3. Authentication & Authorization (RBAC)

The system implements Role-Based Access Control (RBAC) powered by JWT tokens:

| Role | Permissions | Access Scope |
| :--- | :--- | :--- |
| **`customer`** | Can chat with their assigned AI Assistant, view their own Digital Twin, track personal goals, and manage consents. | Limited to their own customer ID. |
| **`staff`** (RM) | Can query client lists, view customer digital twins, read recommendations, and track event calendars. | Can access all customers assigned to their branch. |
| **`admin`** | Complete read/write access to system parameters, user roles, database metrics, and agent performance logs. | Entire system. |
| **`compliance`**| Specialized view restricted to Audit Logs, RBI Circular checklists, consent status tables, and encryption states. | Compliance metrics only. |

---

## 🛡️ 4. RBI Circular Alignment Checklist

The platform incorporates safeguards matching several RBI guidelines:

1. **Circular on Digital Lending (RBI/2022-23/111)**:
   - Employs *Explainable AI (XAI)*. All loan product recommendations state the explicit mathematical and behavioral reasoning behind the offer.
   - Restricts lending decisions to human-in-the-loop triggers. RMs review and approve product recommendations before they are presented to the client.
2. **Circular on Cyber Security Framework (RBI/2016-17/146)**:
   - Enforces encrypted channels. All API requests must be transmitted via HTTPS.
   - Passwords are encrypted on signup using modern `bcrypt` hashing algorithms.
