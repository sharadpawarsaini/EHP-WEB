# 📱 EHP Mobile — React Native (Expo)

Native mobile application for the **Emergency Health Profile (EHP)** healthcare platform, built with **React Native**, **TypeScript**, and **Expo SDK 51**.

---

## 🎨 Design & Theme
- Identical **White & Sky-Blue Healthcare Gradient Theme**
- Glassmorphic card containers with soft blue borders (`#dbeafe`)
- High-contrast typography & emergency color coding (Rose for Allergies, Green for Adherence)

---

## 📱 Included Screens & Features (Matching Website 1:1)

### 🔐 Authentication & Onboarding
- **`LoginScreen`** — Email/password login + Fingerprint/Face ID biometric sign-in + First responder quick scanner link.
- **`RegisterScreen`** — Full member onboarding with blood group, full name, phone number, and password setup.

### 🏠 Patient Health Dashboard
- **`HomeScreen` (Overview)** — Real-time health readiness score ring, active Life-Link emergency shield banner, quick action cards, and daily dose adherence streak counter.
- **`MedicalScreen`** — Severe allergies tags, chronic conditions list, organ donor badge, and DNR / digital health directives.
- **`MedicinesScreen`** — Active prescription tracker, schedule badges (Morning, Afternoon, Night), and instant prescription manager.
- **`VitalsScreen`** — Live biometric telemetry strip (Blood Pressure, Heart Rate, SpO2, Glucose, Temp) and historical health logs.
- **`ProfileScreen`** — Personal demographics, emergency contact phone with 1-tap dial, and secure session logout.

### 📋 Extended Care & Diagnostic Modules
- **`ReportsScreen`** — Diagnostic lab reports vault (Blood tests, MRI, X-rays).
- **`HospitalVisitsScreen`** — Clinical visit histories, attending doctors, and admission diagnoses.
- **`AppointmentsScreen`** — Doctor appointment bookings and scheduled times.
- **`FamilyScreen`** — Multi-profile dependent management (children and elderly parents).
- **`VaccinationsScreen`** — Immunization and COVID-19 booster records.
- **`HospitalFinderScreen`** — Live Emergency Room bed availability, ICU counters, and 1-click GPS map directions.
- **`InsuranceScreen`** — Health policy number, coverage amount, and cashless TPA desk contact.
- **`AccessLogsScreen`** — Audit trail of IP addresses and timestamps whenever your emergency card is scanned.
- **`QRCardScreen`** — Live render of your personal emergency QR code with token rotation and NFC card setup guide.
- **`SettingsScreen`** — Dose reminder push notifications, biometric unlock toggle, and password changer.

### 🚑 Emergency First Responder System
- **`QRScannerScreen`** — Camera QR code scanner for paramedics and first responders.
- **`EmergencyCardScreen`** — Zero-authentication public emergency card displaying patient's blood group, allergies, chronic conditions, and 1-tap call buttons for emergency contacts.

---

## 🚀 How to Run on Your Phone

### 1. Quick Start
Double-click `run_app.bat` inside the `mobile/` directory, or run:
```bash
cd mobile
npm install
npx expo start
```

### 2. Testing on Android / iPhone
1. Download **Expo Go** from the Google Play Store or Apple App Store.
2. Open the Expo Go app and scan the QR code displayed in your terminal.
3. The EHP Mobile app will load directly on your phone with live reload!

### 3. Generate Android APK
To generate a standalone `.apk` for distribution:
```bash
npx eas-cli build --platform android --profile preview
```
