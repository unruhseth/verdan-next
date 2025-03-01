import AccountTopNav from "@/components/AccountTopNav";

interface AccountLayoutProps {
  children: React.ReactNode;
  params: {
    accountId: string;
  };
}

export default function AccountLayout({ children, params }: AccountLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <AccountTopNav accountId={params.accountId} />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
} 