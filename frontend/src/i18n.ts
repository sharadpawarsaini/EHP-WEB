import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav_overview": "Overview",
      "nav_profile": "Profile",
      "nav_medical": "Medical Info",
      "nav_reports": "Medical Reports",
      "nav_contacts": "Contacts",
      "nav_emergency": "Emergency Link",
      "nav_logs": "Access Logs",
      "nav_hospitals": "Hospital Finder",
      "nav_vitals": "Health Trends",
      "nav_family": "Family",
      "nav_logout": "Log out",
      
      "emergency_title": "EHP Emergency Passport",
      "doctor_view": "Doctor View",
      "public_view": "Public View",
      "blood_group": "Blood Group",
      "allergies": "Allergies",
      "conditions": "Chronic Conditions",
      "medications": "Current Medications",
      "contacts": "Emergency Contacts",
      "doctor_access": "Doctor Access",
      "access_code_prompt": "Enter Access Code",
      "unlock": "Unlock History",
      "no_allergies": "No known allergies",
      "no_conditions": "No chronic conditions",
      "no_medications": "No current medications",
      "call": "Call",
      "profile_locked": "Access Restricted",
      "locked_msg": "This profile is currently locked by the owner for privacy."
    }
  },
  hi: {
    translation: {
      "nav_overview": "अवलोकन",
      "nav_profile": "प्रोफ़ाइल",
      "nav_medical": "चिकित्सा जानकारी",
      "nav_reports": "चिकित्सा रिपोर्ट",
      "nav_contacts": "संपर्क",
      "nav_emergency": "आपातकालीन लिंक",
      "nav_logs": "एक्सेस लॉग",
      "nav_hospitals": "अस्पताल खोजें",
      "nav_vitals": "स्वास्थ्य रुझान",
      "nav_family": "परिवार",
      "nav_logout": "लॉग आउट",

      "emergency_title": "EHP आपातकालीन पासपोर्ट",
      "doctor_view": "डॉक्टर व्यू",
      "public_view": "सार्वजनिक व्यू",
      "blood_group": "रक्त समूह",
      "allergies": "एलर्जी",
      "conditions": "पुरानी बीमारियाँ",
      "medications": "वर्तमान दवाएं",
      "contacts": "आपातकालीन संपर्क",
      "doctor_access": "डॉक्टर एक्सेस",
      "access_code_prompt": "एक्सेस कोड दर्ज करें",
      "unlock": "इतिहास अनलॉक करें",
      "no_allergies": "कोई ज्ञात एलर्जी नहीं",
      "no_conditions": "कोई पुरानी बीमारी नहीं",
      "no_medications": "कोई वर्तमान दवा नहीं",
      "call": "कॉल करें",
      "profile_locked": "पहुँच प्रतिबंधित",
      "locked_msg": "यह प्रोफ़ाइल वर्तमान में गोपनीयता के लिए मालिक द्वारा लॉक की गई है।"
    }
  },
  es: {
    translation: {
      "nav_overview": "Resumen",
      "nav_profile": "Perfil",
      "nav_medical": "Información Médica",
      "nav_reports": "Informes Médicos",
      "nav_contacts": "Contactos",
      "nav_emergency": "Enlace de Emergencia",
      "nav_logs": "Registros de Acceso",
      "nav_hospitals": "Buscador de Hospitales",
      "nav_vitals": "Tendencias de Salud",
      "nav_family": "Familia",
      "nav_logout": "Cerrar sesión",

      "emergency_title": "Pasaporte de Emergencia EHP",
      "doctor_view": "Vista Médica",
      "public_view": "Vista Pública",
      "blood_group": "Grupo Sanguíneo",
      "allergies": "Alergias",
      "conditions": "Condiciones Crónicas",
      "medications": "Medicamentos Actuales",
      "contacts": "Contactos de Emergencia",
      "doctor_access": "Acceso Médico",
      "access_code_prompt": "Ingrese el código de acceso",
      "unlock": "Desbloquear Historial",
      "no_allergies": "Sin alergias conocidas",
      "no_conditions": "Sin condiciones crónicas",
      "no_medications": "Sin medicamentos actuales",
      "call": "Llamar",
      "profile_locked": "Acceso Restringido",
      "locked_msg": "Este perfil está actualmente bloqueado por el propietario por privacidad."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
