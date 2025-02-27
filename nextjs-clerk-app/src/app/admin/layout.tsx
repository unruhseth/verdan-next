import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is master_admin
  const role = sessionClaims?.org_role as string;
  const normalizedRole = role?.replace('-', '_');
  
  if (normalizedRole !== 'org:master_admin') {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 