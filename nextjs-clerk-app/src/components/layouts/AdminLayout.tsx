import { ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { userRole, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }
    
    if (userRole !== 'org:master_admin') {
        window.location.href = '/unauthorized';
        return null;
    }
    
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout; 