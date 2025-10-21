"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ChevronRight, Package, Store, TrendingUp, TrendingDown } from "lucide-react";

interface BrandTableProps {
  searchQuery: string;
  sortBy: string;
  onSelectBrand: (brandName: string) => void;
}

export function BrandTable({ searchQuery, sortBy, onSelectBrand }: BrandTableProps) {
  // Mock brand data
  const brands = useMemo(() => {
    const mockBrands = [
      { name: "Broken Coast", skus: 24, coverage: 95, medianPrice: 42.99, delta7d: -2.1, category: "Premium" },
      { name: "Simply Bare", skus: 18, coverage: 88, medianPrice: 44.99, delta7d: 0, category: "Premium" },
      { name: "Spinach", skus: 32, coverage: 92, medianPrice: 29.99, delta7d: 1.5, category: "Value" },
      { name: "REDECAN", skus: 28, coverage: 85, medianPrice: 26.99, delta7d: -0.8, category: "Value" },
      { name: "Good Supply", skus: 21, coverage: 78, medianPrice: 25.99, delta7d: 0.5, category: "Value" },
      { name: "7ACRES", skus: 15, coverage: 72, medianPrice: 38.99, delta7d: -1.2, category: "Premium" },
      { name: "Edison", skus: 19, coverage: 68, medianPrice: 34.99, delta7d: 2.3, category: "Mid" },
      { name: "Aurora", skus: 22, coverage: 65, medianPrice: 31.99, delta7d: 0, category: "Mid" },
      { name: "San Rafael '71", skus: 16, coverage: 70, medianPrice: 39.99, delta7d: -0.5, category: "Premium" },
      { name: "RIFF", skus: 14, coverage: 62, medianPrice: 27.99, delta7d: 1.8, category: "Value" },
    ];

    // Filter by search
    let filtered = mockBrands;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = mockBrands.filter((b) => b.name.toLowerCase().includes(query));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "skus_desc":
          return b.skus - a.skus;
        case "skus_asc":
          return a.skus - b.skus;
        case "coverage_desc":
          return b.coverage - a.coverage;
        case "coverage_asc":
          return a.coverage - b.coverage;
        case "median_price_desc":
          return b.medianPrice - a.medianPrice;
        case "median_price_asc":
          return a.medianPrice - b.medianPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, sortBy]);

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-sm">Brand</th>
              <th className="text-center p-4 font-medium text-sm">Category</th>
              <th className="text-center p-4 font-medium text-sm">SKUs</th>
              <th className="text-center p-4 font-medium text-sm">Coverage</th>
              <th className="text-right p-4 font-medium text-sm">Median Price</th>
              <th className="text-center p-4 font-medium text-sm">Δ7d</th>
              <th className="text-center p-4 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                  No brands match your search
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr
                  key={brand.name}
                  className="border-b hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-semibold">{brand.name}</div>
                  </td>
                  <td className="p-4 text-center">
                    <Badge
                      variant={
                        brand.category === "Premium"
                          ? "default"
                          : brand.category === "Value"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {brand.category}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{brand.skus}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{brand.coverage}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-semibold">
                    {formatCurrency(brand.medianPrice)}
                  </td>
                  <td className="p-4 text-center">
                    <div
                      className={`flex items-center justify-center gap-1 text-sm font-medium ${
                        brand.delta7d > 0
                          ? "text-red-600"
                          : brand.delta7d < 0
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {brand.delta7d > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : brand.delta7d < 0 ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : null}
                      <span>
                        {brand.delta7d > 0 ? "+" : ""}
                        {brand.delta7d.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectBrand(brand.name)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {brands.length > 0 && (
        <div className="p-4 border-t text-sm text-muted-foreground">
          Showing {brands.length} brands
        </div>
      )}
    </Card>
  );
}


