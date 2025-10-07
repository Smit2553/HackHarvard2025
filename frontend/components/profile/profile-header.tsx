import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  onStartSession: () => void;
}

export function ProfileHeader({ onStartSession }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">Recent Sessions</h2>
      <Button onClick={onStartSession}>Start New Session</Button>
    </div>
  );
}
