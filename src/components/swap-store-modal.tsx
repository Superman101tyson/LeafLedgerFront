"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Store } from "@/lib/types";
import { Search, ArrowRightLeft, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface SwapStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStores: Store[];
  availableStores: Store[];
  swapsRemaining: number;
  nextRefreshTime: Date;
  onRequestSwap: (fromStoreId: string, toStoreId: string) => void;
}

export function SwapStoreModal({
  open,
  onOpenChange,
  currentStores,
  availableStores,
  swapsRemaining,
  nextRefreshTime,
  onRequestSwap,
}: SwapStoreModalProps) {
  const [selectedFromStore, setSelectedFromStore] = useState<string>("");
  const [selectedToStore, setSelectedToStore] = useState<string>("");
  const [search, setSearch] = useState("");

  const filteredAvailableStores = availableStores.filter(store => {
    const isNotCurrent = !currentStores.find(s => s.id === store.id);
    const matchesSearch = search === "" ||
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.chain.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase());
    return isNotCurrent && matchesSearch;
  });

  const canConfirm = selectedFromStore && selectedToStore && swapsRemaining > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    
    onRequestSwap(selectedFromStore, selectedToStore);
    
    const fromStore = currentStores.find(s => s.id === selectedFromStore);
    const toStore = availableStores.find(s => s.id === selectedToStore);
    
    toast.success(
      `Store swap requested: ${fromStore?.name} → ${toStore?.name}. Will activate at next refresh.`
    );
    
    // Reset and close
    setSelectedFromStore("");
    setSelectedToStore("");
    setSearch("");
    onOpenChange(false);
  };

  const nextRefreshMinutes = Math.floor((nextRefreshTime.getTime() - Date.now()) / (1000 * 60));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Swap Tracked Store
          </DialogTitle>
          <DialogDescription>
            Replace one of your tracked stores with a different one
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-4">
            {/* Swap Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {swapsRemaining} swap{swapsRemaining !== 1 ? "s" : ""} remaining this month
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Clock className="h-4 w-4" />
                  <span>Next refresh in {nextRefreshMinutes}m</span>
                </div>
              </div>
              <p className="text-xs text-blue-800">
                Store swaps will activate at the next data refresh cycle.
              </p>
            </div>

            {swapsRemaining === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-orange-900">
                    You've used all your monthly swaps
                  </p>
                  <Button variant="outline" size="sm">
                    Buy +10 Swaps ($29)
                  </Button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Remove Store */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">1. Select Store to Remove</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose which store to stop tracking
                  </p>
                </div>
                
                <RadioGroup value={selectedFromStore} onValueChange={setSelectedFromStore}>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                    {currentStores.map(store => (
                      <div
                        key={store.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => setSelectedFromStore(store.id)}
                      >
                        <RadioGroupItem value={store.id} id={store.id} />
                        <Label htmlFor={store.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{store.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {store.chain} • {store.city}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Right: Add Store */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">2. Select Replacement Store</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a new store to track
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search available stores..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <RadioGroup value={selectedToStore} onValueChange={setSelectedToStore}>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                    {filteredAvailableStores.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-4 text-center">
                        No stores available
                      </p>
                    ) : (
                      filteredAvailableStores.map(store => (
                        <div
                          key={store.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                          onClick={() => setSelectedToStore(store.id)}
                        >
                          <RadioGroupItem value={store.id} id={`to-${store.id}`} />
                          <Label htmlFor={`to-${store.id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium">{store.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {store.chain} • {store.city}
                            </div>
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedFromStore && selectedToStore && (
              <span>This will use 1 of your {swapsRemaining} remaining swaps</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!canConfirm}>
              Confirm Swap
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


