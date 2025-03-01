import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has appropriate role
  const role = sessionClaims?.org_role as string;
  const normalizedRole = role?.replace('-', '_');
  
  if (!['org:account_admin', 'org:user'].includes(normalizedRole)) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen">
      <UserSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 