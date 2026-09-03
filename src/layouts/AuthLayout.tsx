import { Outlet } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

export default function AuthLayout() {
  useScrollToTop();
  return (
    <div className="relative min-h-screen bg-mesh-gradient">
      <div className="container-px flex min-h-screen items-center justify-center py-12">
        <Outlet />
      </div>
    </div>
  );
}
