import AppCard from '@/components/AppCard';

export default function TaskManagerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AppCard
        name="Task Manager"
        description="Manage your tasks efficiently."
        faIcon="fa-list-check"
        className="max-w-sm mx-auto"
      />
    </div>
  );
} 