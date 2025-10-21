"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreateAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAlertModal({ open, onOpenChange }: CreateAlertModalProps) {
  const [alertType, setAlertType] = useState("price_decrease");
  const [productName, setProductName] = useState("");
  const [threshold, setThreshold] = useState("");

  const handleCreate = () => {
    if (!productName || !threshold) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Alert created successfully!");
    onOpenChange(false);
    
    // Reset form
    setAlertType("price_decrease");
    setProductName("");
    setThreshold("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogDescription>
            Set up a new alert to monitor competitor pricing and market changes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Alert Type */}
          <div>
            <Label htmlFor="alert-type">Alert Type</Label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger id="alert-type" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_decrease">Price Decrease</SelectItem>
                <SelectItem value="price_increase">Price Increase</SelectItem>
                <SelectItem value="new_sku">New SKU Added</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Name */}
          <div>
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              placeholder="e.g. Broken Coast Sunset Sherbet 3.5g"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Or use wildcards: "Broken Coast *" for all Broken Coast products
            </p>
          </div>

          {/* Threshold/Condition */}
          {(alertType === "price_decrease" || alertType === "price_increase") && (
            <div>
              <Label htmlFor="threshold">
                {alertType === "price_decrease" ? "Alert when price drops below" : "Alert when price rises above"}
              </Label>
              <Input
                id="threshold"
                type="number"
                placeholder="e.g. 38.00"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {alertType === "out_of_stock" && (
            <div>
              <Label htmlFor="threshold">Alert when out of stock at</Label>
              <Select value={threshold} onValueChange={setThreshold}>
                <SelectTrigger id="threshold" className="mt-1">
                  <SelectValue placeholder="Select threshold..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ stores</SelectItem>
                  <SelectItem value="3">3+ stores</SelectItem>
                  <SelectItem value="5">5+ stores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Alert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


