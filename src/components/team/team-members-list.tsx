"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreVertical, Mail, Shield, Trash2, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function TeamMembersList() {
  const [members, setMembers] = useState(generateMockMembers());

  const updateRole = (memberId: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    toast.success("Role updated successfully");
  };

  const removeMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    toast.success("Member removed from organization");
  };

  const resendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">Admin</Badge>;
      case "manager":
        return <Badge variant="secondary">Manager</Badge>;
      case "viewer":
        return <Badge variant="outline">Viewer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Card>
      <div className="divide-y">
        {members.map((member) => (
          <div key={member.id} className="p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{member.name}</h4>
                  {member.status === "pending" && (
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  )}
                  {member.isOwner && (
                    <Badge variant="default" className="text-xs">
                      Owner
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>Joined {member.joinedAt}</span>
                  {member.lastActive && <span>Last active: {member.lastActive}</span>}
                </div>
              </div>

              {/* Role Selector */}
              <div className="w-[140px]">
                {member.isOwner ? (
                  getRoleBadge("admin")
                ) : (
                  <Select
                    value={member.role}
                    onValueChange={(newRole) => updateRole(member.id, newRole)}
                    disabled={member.status === "pending"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Actions Menu */}
              {!member.isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => resendInvite(member.email)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Invite
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => removeMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Mock data generator
function generateMockMembers() {
  return [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@citycannabis.ca",
      role: "admin",
      status: "active",
      isOwner: true,
      joinedAt: "6mo ago",
      lastActive: "2h ago",
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah@citycannabis.ca",
      role: "manager",
      status: "active",
      isOwner: false,
      joinedAt: "4mo ago",
      lastActive: "1d ago",
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "mike@citycannabis.ca",
      role: "viewer",
      status: "active",
      isOwner: false,
      joinedAt: "2mo ago",
      lastActive: "3d ago",
    },
    {
      id: "4",
      name: "Emily Park",
      email: "emily@citycannabis.ca",
      role: "manager",
      status: "pending",
      isOwner: false,
      joinedAt: "2d ago",
      lastActive: null,
    },
  ];
}


