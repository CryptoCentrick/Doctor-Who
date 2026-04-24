"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function SettingsTabs() {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="glass-panel border-border/70">
          <CardHeader>
            <CardTitle>Profile & units</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Display name</span>
              <Input defaultValue="Alex Rivers" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Date of birth</span>
              <Input type="date" defaultValue="1991-08-19" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Height unit</span>
              <Input defaultValue="Metric (cm)" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Weight unit</span>
              <Input defaultValue="Metric (kg)" />
            </label>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="privacy">
        <Card className="glass-panel border-border/70">
          <CardHeader>
            <CardTitle>Storage & sharing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Store biometric data locally by default",
              "Enable encrypted cloud sync",
              "Allow anonymous product analytics"
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-[24px] border border-border/60 bg-background/25 p-4">
                <div>
                  <p className="font-semibold">{item}</p>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? "Recommended for privacy-first setup." : "Change this anytime from settings."}
                  </p>
                </div>
                <Switch defaultChecked={index === 0} />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="glass-panel border-border/70">
          <CardHeader>
            <CardTitle>Alert preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Daily report summary at 7:00 AM",
              "Critical anomaly alerts",
              "Mindfulness break reminders",
              "Weekly achievement badges"
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-[24px] border border-border/60 bg-background/25 p-4">
                <span className="font-medium">{item}</span>
                <Switch defaultChecked={index < 3} />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

