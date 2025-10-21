"use client";

import { useState } from "react";
import { Store } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Search, X, AlertCircle } from "lucide-react";

interface StorePickerProps {
  stores: Store[];
  selected: string[];
  max: number;
  onChange: (selected: string[]) => void;
  onLimitHit?: () => void;
}

export function StorePicker({ 
  stores, 
  selected, 
  max, 
  onChange, 
  onLimitHit 
}: StorePickerProps) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [chainFilter, setChainFilter] = useState<string | null>(null);

  const isAtLimit = selected.length >= max;

  const cities = Array.from(new Set(stores.map(s => s.city)));
  const chains = Array.from(new Set(stores.map(s => s.chain)));
  
  const filteredStores = stores.filter(store => {
    const matchesSearch = search === "" || 
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.chain.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase());
    const matchesCity = !cityFilter || store.city === cityFilter;
    const matchesChain = !chainFilter || store.chain === chainFilter;
    return matchesSearch && matchesCity && matchesChain;
  });

  const toggleStore = (storeId: string) => {
    if (selected.includes(storeId)) {
      onChange(selected.filter(id => id !== storeId));
    } else if (!isAtLimit) {
      onChange([...selected, storeId]);
    } else {
      onLimitHit?.();
    }
  };

  const removeStore = (storeId: string) => {
    onChange(selected.filter(id => id !== storeId));
  };

  return (
    <div className="space-y-4">
      {/* Store Limit Indicator & Upsell */}
      <Card className={`p-4 ${isAtLimit ? "border-orange-300 bg-orange-50" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isAtLimit && <AlertCircle className="h-5 w-5 text-orange-600" />}
            <span className="font-medium">
              {selected.length} / {max} store slots used
            </span>
          </div>
          {isAtLimit && (
            <Button variant="outline" size="sm" onClick={onLimitHit}>
              Add +5 Stores ($49/mo)
            </Button>
          )}
        </div>
      </Card>

      {/* Selected Stores Tray */}
      {selected.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">Selected Stores:</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(storeId => {
              const store = stores.find(s => s.id === storeId);
              return store ? (
                <Badge key={storeId} variant="secondary" className="gap-1.5 px-3 py-1.5">
                  {store.name}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeStore(storeId)}
                  />
                </Badge>
              ) : null;
            })}
          </div>
        </Card>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, chain, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* City Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Filter by City:</p>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={cityFilter === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCityFilter(null)}
            >
              All
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
        </div>

        {/* Chain Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Filter by Chain:</p>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={chainFilter === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setChainFilter(null)}
            >
              All
            </Badge>
            {chains.map(chain => (
              <Badge
                key={chain}
                variant={chainFilter === chain ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setChainFilter(chain)}
              >
                {chain}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Store List */}
      <div className="border rounded-lg max-h-96 overflow-y-auto">
        {filteredStores.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No stores found matching your filters
          </div>
        ) : (
          filteredStores.map(store => {
            const isSelected = selected.includes(store.id);
            const canSelect = !isAtLimit || isSelected;

            return (
              <div
                key={store.id}
                className={`flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-accent transition-colors ${!canSelect ? "opacity-50" : "cursor-pointer"}`}
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
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {store.address}
                  </div>
                </div>
                {store.distance && (
                  <Badge variant="outline" className="text-xs">
                    {store.distance.toFixed(1)} km
                  </Badge>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


