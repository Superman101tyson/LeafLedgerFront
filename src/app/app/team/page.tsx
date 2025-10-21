"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Shield, AlertCircle } from "lucide-react";
import { TeamMembersList } from "@/components/team/team-members-list";
import { InviteMemberModal } from "@/components/team/invite-member-modal";

export default function TeamPage() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Mock org data
  const orgData = {
    name: "City Cannabis Co",
    plan: "Professional",
    seatLimit: 10,
    seatsUsed: 4,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Team Management"
        subtitle="Manage your organization's members and their permissions"
        actions={
          <Button onClick={() => setInviteModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        }
      />

      {/* Org Info Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{orgData.name}</CardTitle>
              <CardDescription>Organization settings and seats</CardDescription>
            </div>
            <Badge variant="default">{orgData.plan} Plan</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">
                {orgData.seatsUsed} / {orgData.seatLimit} seats used
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {orgData.seatLimit - orgData.seatsUsed} seats available
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Info Card */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-2">Role Permissions</p>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
                <div>
                  <span className="font-semibold">Admin:</span> Full access including billing, team management, and all features
                </div>
                <div>
                  <span className="font-semibold">Manager:</span> Access to all analytics and alerts, can export data
                </div>
                <div>
                  <span className="font-semibold">Viewer:</span> Read-only access to dashboards and reports
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <TeamMembersList />

      {/* Invite Modal */}
      <InviteMemberModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        seatsAvailable={orgData.seatLimit - orgData.seatsUsed}
      />
    </div>
  );
}


