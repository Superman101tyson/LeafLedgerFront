"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seatsAvailable: number;
}

export function InviteMemberModal({ open, onOpenChange, seatsAvailable }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const handleInvite = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (seatsAvailable <= 0) {
      toast.error("No seats available. Please upgrade your plan.");
      return;
    }

    toast.success(`Invitation sent to ${email}`);
    onOpenChange(false);
    
    // Reset form
    setEmail("");
    setRole("viewer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. They'll receive an email with a link to accept.
          </DialogDescription>
        </DialogHeader>

        {seatsAvailable <= 0 && (
          <div className="flex items-start gap-2 p-3 border border-orange-200 bg-orange-50 rounded">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-sm text-orange-900">
              <p className="font-semibold mb-1">No seats available</p>
              <p>You've used all available seats on your current plan. Upgrade to add more team members.</p>
            </div>
          </div>
        )}

        <div className="space-y-4 py-4">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              disabled={seatsAvailable <= 0}
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={setRole}
              disabled={seatsAvailable <= 0}
            >
              <SelectTrigger id="role" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div>
                    <div className="font-semibold">Admin</div>
                    <div className="text-xs text-muted-foreground">Full access including billing & team</div>
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div>
                    <div className="font-semibold">Manager</div>
                    <div className="text-xs text-muted-foreground">Access to analytics, alerts, exports</div>
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div>
                    <div className="font-semibold">Viewer</div>
                    <div className="text-xs text-muted-foreground">Read-only access to dashboards</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seats Info */}
          <div className="text-sm text-muted-foreground">
            {seatsAvailable > 0 ? (
              <p>{seatsAvailable} seat{seatsAvailable !== 1 ? "s" : ""} remaining on your plan</p>
            ) : (
              <p>0 seats remaining - please upgrade your plan</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={seatsAvailable <= 0}>
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


