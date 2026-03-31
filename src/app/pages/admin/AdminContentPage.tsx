import { Navigate } from 'react-router-dom';

/** @deprecated Use Site Configuration → Content tab. */
export const AdminContentPage = () => <Navigate to="/admin/configuration?tab=site-content" replace />;
