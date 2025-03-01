import { redirect } from 'next/navigation';

interface Props {
  params: {
    appKey: string;
  };
  searchParams: {
    accountId?: string;
  };
}

export default function AppPage({ params, searchParams }: Props) {
  const { appKey } = params;
  const { accountId } = searchParams;

  if (!accountId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          No account ID provided. Please access this page through the account apps page.
        </div>
      </div>
    );
  }

  // Redirect to the app's dashboard by default
  redirect(`/apps/${appKey}/dashboard?accountId=${accountId}`);
} 