"use client";

import { useState } from "react";
import { PlanTier } from "@/lib/types";
import { PLANS, BC_STORES } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Search, X, AlertCircle } from "lucide-react";

interface StoresStepProps {
  plan: PlanTier;
  selectedStores: string[];
  onStoresChange: (stores: string[]) => void;
}

export function StoresStep({ plan, selectedStores, onStoresChange }: StoresStepProps) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<string | null>(null);

  const planDetails = PLANS.find(p => p.id === plan);
  const maxStores = planDetails?.stores || 5;
  const isAtLimit = selectedStores.length >= maxStores;

  const cities = Array.from(new Set(BC_STORES.map(s => s.city)));
  
  const filteredStores = BC_STORES.filter(store => {
    const matchesSearch = search === "" || 
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.chain.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase());
    const matchesCity = !cityFilter || store.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const toggleStore = (storeId: string) => {
    if (selectedStores.includes(storeId)) {
      onStoresChange(selectedStores.filter(id => id !== storeId));
    } else if (!isAtLimit) {
      onStoresChange([...selectedStores, storeId]);
    }
  };

  const removeStore = (storeId: string) => {
    onStoresChange(selectedStores.filter(id => id !== storeId));
  };

  return (
    <div className="space-y-4">
      {/* Store Limit Indicator */}
      <Card className={`p-4 ${isAtLimit ? "border-orange-300 bg-orange-50" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAtLimit && <AlertCircle className="h-5 w-5 text-orange-600" />}
            <span className="font-medium">
              {selectedStores.length} of {maxStores} store slots used
            </span>
          </div>
          {isAtLimit && (
            <Button variant="outline" size="sm">
              Add +5 Stores ($49/mo)
            </Button>
          )}
        </div>
      </Card>

      {/* Selected Stores Tray */}
      {selectedStores.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStores.map(storeId => {
            const store = BC_STORES.find(s => s.id === storeId);
            return store ? (
              <Badge key={storeId} variant="secondary" className="gap-1 px-3 py-1.5">
                {store.name}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeStore(storeId)}
                />
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* City Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={cityFilter === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCityFilter(null)}
        >
          All Cities
        </Badge>
        {cities.map(city => (
          <Badge
            key={city}
            variant={cityFilter === city ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setCityFilter(city)}
          >
            {city}
          </Badge>
        ))}
      </div>

      {/* Store List */}
      <div className="border rounded-lg max-h-96 overflow-y-auto">
        {filteredStores.map(store => {
          const isSelected = selectedStores.includes(store.id);
          const canSelect = !isAtLimit || isSelected;

          return (
            <div
              key={store.id}
              className={`flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-accent ${!canSelect ? "opacity-50" : "cursor-pointer"}`}
              onClick={() => canSelect && toggleStore(store.id)}
            >
              <Checkbox 
                checked={isSelected}
                disabled={!canSelect}
              />
              <div className="flex-1">
                <div className="font-medium">{store.name}</div>
                <div className="text-sm text-muted-foreground">
                  {store.chain} • {store.city}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


