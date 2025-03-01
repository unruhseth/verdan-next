import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import UserSidebar from "@/components/UserSidebar";

interface Props {
  children: React.ReactNode;
  params: { app_key: string };
}

export default async function AppsLayout({
  children,
  params,
}: Props) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get the user's role from session claims
  const role = sessionClaims?.org_role as string;
  const normalizedRole = role?.replace('-', '_');
  const isAdmin = ['org:master_admin', 'org:admin'].includes(normalizedRole);

  return (
    <div className="flex min-h-screen">
      {isAdmin ? <AdminSidebar /> : <UserSidebar />}
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4">
          {children}
        </div>
      </main>
    </div>
  );
} 