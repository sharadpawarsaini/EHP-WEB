# 🚑 EHP (Emergency Health Passport)

**The Most Advanced, Privacy-First Digital Medical Identity Platform.**

EHP is an enterprise-grade SaaS application designed to securely manage, protect, and instantly share critical medical data during emergencies. Built with zero-knowledge architecture and hybrid offline telemetry, it ensures that first responders have the data they need to save lives, while keeping sensitive medical records locked away from prying eyes.

---

## 🚀 Key Features

### 1. Hybrid Offline Emergency Bridge (SOS QR)
- **Zero-Network Fallback**: Generates a dynamic QR code that acts as an offline `vCard`. Even in zero-network environments (subways, rural areas), scanning the QR code with any native smartphone camera instantly loads critical survival data (Blood Type, Allergies, Emergency Contacts).
- **Online Deep Link**: If the responder has a network connection, the QR code also provides a direct link to the full Public Emergency Profile.
- **Physical Assets**: Auto-generates printable Wallet Cards (via `jsPDF`) and Lock Screen Wallpapers containing the emergency QR node.

### 2. Zero-Knowledge "Privacy Vault"
- **Client-Side Encryption**: Employs the **Web Crypto API (AES-GCM & PBKDF2)** to encrypt sensitive medical documents directly within the browser.
- **Absolute Privacy**: The server only receives and stores unreadable ciphertext (`413 Payload limit increased to 50mb`). Even platform administrators and database breaches cannot expose the user's files without their private passphrase.

### 3. Stealth Mode (Ghost Profile Auth)
- **Dual-PIN Authentication**: Users can configure a "Safety PIN". If forced to log in under duress, entering the Safety PIN seamlessly logs them into a sanitized, read-only "Ghost Dashboard" populated with mock data, completely hiding their real medical conditions and Privacy Vault.

### 4. Doctor Access & Decryption
- **Secure Clinical Handover**: While paramedics see basic triage info, hospital doctors require a unique 6-digit **Access Code** to unlock the patient's full clinical history, imaging reports, and vaccination records.
- **Audit Logging**: Every time a public profile or doctor portal is accessed, an immutable access log (IP, User Agent, Timestamp) is recorded in the user's dashboard.

### 5. AI Medical Triage
- **Groq Llama-3 Integration**: A blazing-fast AI assistant integrated into the dashboard to analyze symptoms, summarize complex lab reports, and provide immediate triage recommendations based on the user's existing health profile.

### 6. Comprehensive Clinical Management
- **Vitals Tracking**: Monitor heart rate, blood pressure, and SPO2.
- **Medical Archives**: Track past surgeries, hospital visits, active medications, and vaccination schedules.
- **Hospital Finder**: Geolocation-based nearest hospital routing.
- **NFC Integration**: Ready-to-use bridging system to pair the digital EHP profile with physical NFC silicone bands or tags.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: React.js powered by Vite for lightning-fast HMR and optimized builds.
- **Styling**: Tailwind CSS combined with highly customized design tokens for a premium, responsive SaaS aesthetic.
- **Animations**: Framer Motion for liquid-smooth page transitions and micro-interactions.
- **Icons**: Lucide-React.
- **State & Routing**: Context API (Auth, Profile, Theme) and React Router DOM.
- **Localization**: `i18next` for robust multi-language support.

### Backend Infrastructure
- **Runtime**: Node.js with Express framework.
- **Database**: MongoDB with Mongoose ODM (Schemas mapped for every clinical metric).
- **Security**: JWT (JSON Web Tokens) for stateless authentication, bcrypt for password hashing, and CORS protection.
- **Storage**: Cloudinary for persistent, scalable image and document storage.

---

## 📂 Project Structure
```text
EHP/
├── backend/                  # Node.js / Express Server
│   ├── src/
│   │   ├── config/           # Database & Env configurations
│   │   ├── controllers/      # Business logic (Emergency, Privacy, Auth)
│   │   ├── middleware/       # JWT Auth & Error Handling guards
│   │   ├── models/           # Mongoose Schemas (PrivacyVault, User, Profile)
│   │   └── routes/           # Express API route definitions
│   └── index.ts              # Entry point
│
└── frontend/                 # React / Vite Application
    ├── src/
    │   ├── components/       # Reusable UI (Layout, Sidebar, Modals)
    │   ├── context/          # Global State (Stealth Mode tracking)
    │   ├── pages/            # Main views & Dashboard Tabs
    │   │   └── dashboard/    # Complex sub-views (PrivacyVault, EmergencyTab)
    │   ├── services/         # Axios API configuration
    │   └── utils/            # Web Crypto API utilities & formatters
    ├── index.css             # Global Tailwind directives
    └── tailwind.config.js    # Design system configuration
```

---

## 🔒 Security Summary
EHP is not just a medical record app; it is a **Data Fortress**. By combining Stealth Mode routing, Zero-Knowledge file encryption, and Offline-First QR telemetry, EHP provides enterprise-level security guarantees suitable for politicians, executives, and privacy-conscious individuals worldwide.
