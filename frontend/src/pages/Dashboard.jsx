import { useAuth } from '../context/AuthContext';
import OperatorDashboard from './dashboards/OperatorDashboard';
import CitizenDashboard from './dashboards/CitizenDashboard';
import ResponderDashboard from './dashboards/ResponderDashboard';
import TeamLeaderDashboard from './dashboards/TeamLeaderDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  
  if (!user) return null;

  switch (user.role) {
    case 'Citizen':
      return <CitizenDashboard />;
    case 'Responder':
      return <ResponderDashboard />;
    case 'Team Leader':
      return <TeamLeaderDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    case 'Control Room Operator':
    default:
      return <OperatorDashboard />;
  }
}
