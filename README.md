# TradePro | Professional Trading Journal & Analytics

**TradePro** is a high-performance, full-stack trading journal designed for disciplined traders. It combines a bespoke **Translucent Crystal UI** with a robust **Node.js/PostgreSQL** backend to provide real-time equity tracking and institutional-grade performance analytics.

---

## 🚀 Technical Highlights (Tier 1 Architecture)

This project implements senior-level engineering patterns to ensure scalability and maintainability:

*   **Custom Hook Architecture**: Employs a `useAppLogic` hook to decouple business logic, API orchestration, and state management from the UI layer, following the **Separation of Concerns** principle.
*   **Secure Authentication**: Implements **JWT (JSON Web Tokens)** for session management, paired with **Bcrypt** password hashing and custom Express middleware for protected route access.
*   **Relational Data Modeling**: Powered by **PostgreSQL** on Neon, ensuring ACID compliance and relational integrity between Users and Trades.
*   **Data Validation**: Utilizes **Zod** for strict schema validation on the backend, preventing malformed data from entering the database.

---

## 🎨 Design Philosophy: Tactile Glassmorphism

The UI is designed to minimize cognitive load while maintaining a premium, "Silicon Valley" aesthetic:
*   **ICT/SMC Integration**: The background features sharpened, subtly blurred institutional trading charts (Standard Deviation, OTE, and Market Structure Alignment) to ground the app in real-world price action.
*   **Translucent Crystal Theme**: Cards utilize high-opacity white backgrounds with `backdrop-blur` and `ring` borders to create depth without sacrificing readability.
*   **Data-First Typography**: Numbers are rendered with specific tracking and weights to ensure financial data is scannable at a glance.

---

## 🛠️ Tech Stack

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS
*   Recharts (Equity Curve Visualization)
*   Lucide React (Iconography)

**Backend:**
*   Node.js & Express
*   PostgreSQL (Neon DB)
*   Zod Schema Validation
*   JWT & Bcrypt Security

---

## ✨ Features

*   **Interactive Equity Curve**: Real-time visual representation of account growth with gradient-filled area charts.
*   **Performance Metrics**: Automated calculation of Win Rate, Total PnL, and Average Trade Profit.
*   **Timeframe Analytics**: Filter performance history by Week, Month, Year, or All-Time.
*   **Live Ledger Search**: Instant ticker-based filtering within the trade history table.
*   **Global Auth**: Full user registration and login system.

---

