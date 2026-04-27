import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
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
