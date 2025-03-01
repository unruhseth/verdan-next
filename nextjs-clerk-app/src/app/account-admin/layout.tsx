import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AccountAdminSidebar from "@/components/AccountAdminSidebar";

export default async function AccountAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is account_admin
  const role = sessionClaims?.org_role as string;
  const normalizedRole = role?.replace('-', '_');
  
  if (normalizedRole !== 'org:account_admin') {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen">
      <AccountAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 