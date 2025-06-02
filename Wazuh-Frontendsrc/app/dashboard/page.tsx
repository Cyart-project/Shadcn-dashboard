import { AgentsOverview } from "@/components/wazuh/agents-overview";
import { AlertsSummary } from "@/components/wazuh/alerts-summary";
import { SystemStatus } from "@/components/wazuh/system-status";
import { RecentAlerts } from "@/components/wazuh/recent-alerts";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SystemStatus />
          <AlertsSummary />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <AgentsOverview className="lg:col-span-4" />
          <RecentAlerts className="lg:col-span-3" />
        </div>
      </main>
    </div>
  );
}
