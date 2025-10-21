"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ScopeBar } from "@/components/scope-bar";
import { DataFreshness } from "@/components/data-freshness";
import { CatalogTable } from "@/components/catalog/catalog-table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

export default function CatalogPage() {
  const [competitorSet, setCompetitorSet] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [viewMode, setViewMode] = useState<"parent" | "variant">("variant");
  const [pricePerGram, setPricePerGram] = useState(false);

  const lastUpdated = new Date(Date.now() - 45 * 60 * 1000); // 45 minutes ago
  const nextUpdate = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours from now

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Product Catalog"
        subtitle="Browse and compare cannabis products across your tracked stores"
        actions={
          <>
            <div className="flex items-center gap-2">
              <Switch
                id="price-per-gram"
                checked={pricePerGram}
                onCheckedChange={setPricePerGram}
              />
              <Label htmlFor="price-per-gram" className="text-sm">
                Price per gram
              </Label>
            </div>
            <DataFreshness lastUpdated={lastUpdated} nextUpdate={nextUpdate} />
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </>
        }
      />

      <ScopeBar
        competitorSet={competitorSet}
        onCompetitorSetChange={setCompetitorSet}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <CatalogTable pricePerGram={pricePerGram} />
    </div>
  );
}

