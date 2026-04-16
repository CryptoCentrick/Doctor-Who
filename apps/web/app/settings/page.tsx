import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsTabs } from "@/components/settings-tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-white/10">
        <CardHeader>
          <Badge variant="outline">Preferences</Badge>
          <CardTitle className="text-3xl">Profile, units, privacy, and notifications</CardTitle>
          <CardDescription>
            Configure local storage, encrypted sync, measurement units, and how Doctor Who surfaces alerts.
          </CardDescription>
        </CardHeader>
      </Card>

      <SettingsTabs />
    </div>
  );
}
