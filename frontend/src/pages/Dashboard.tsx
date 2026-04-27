import { Routes, Route, Navigate } from 'react-router-dom';
import ProfileTab from './dashboard/ProfileTab';
import MedicalTab from './dashboard/MedicalTab';
import EmergencyTab from './dashboard/EmergencyTab';
import ContactsTab from './dashboard/ContactsTab';
import OverviewTab from './dashboard/OverviewTab';
import ReportsTab from './dashboard/ReportsTab';
import AccessLogsTab from './dashboard/AccessLogsTab';
import HospitalFinderTab from './dashboard/HospitalFinderTab';
import FamilyTab from './dashboard/FamilyTab';

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<OverviewTab />} />
      <Route path="/profile" element={<ProfileTab />} />
      <Route path="/medical" element={<MedicalTab />} />
      <Route path="/contacts" element={<ContactsTab />} />
      <Route path="/emergency" element={<EmergencyTab />} />
      <Route path="/reports" element={<ReportsTab />} />
      <Route path="/logs" element={<AccessLogsTab />} />
      <Route path="/hospitals" element={<HospitalFinderTab />} />
      <Route path="/family" element={<FamilyTab />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default Dashboard;

/* 
  FUTURE PLACEHOLDERS:
  TODO: NFC integration - Allow writing the public slug to NFC tags for instant tap-to-access.
  TODO: Mobile app - React Native application using the same backend APIs.
  TODO: AI health insights - Use AI to analyze the user's medical history and suggest proactive measures.
  TODO: Hospital integrations - HL7/FHIR integration to sync medical records directly from hospitals.
*/
