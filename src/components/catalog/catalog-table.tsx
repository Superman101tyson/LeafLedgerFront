"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MOCK_VARIANTS, BC_STORES } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, ExternalLink, Filter, Star, Bell, Sparkles } from "lucide-react";
import { PriceLadderModal } from "./price-ladder-modal";
import { MiniSparkline } from "./mini-sparkline";

interface CatalogTableProps {
  pricePerGram?: boolean;
}

export function CatalogTable({ pricePerGram = false }: CatalogTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [watchedProducts, setWatchedProducts] = useState<Set<string>>(new Set());

  const toggleRow = (variantId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(variantId)) {
      newExpanded.delete(variantId);
    } else {
      newExpanded.add(variantId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleWatch = (variantId: string) => {
    const newWatched = new Set(watchedProducts);
    if (newWatched.has(variantId)) {
      newWatched.delete(variantId);
    } else {
      newWatched.add(variantId);
    }
    setWatchedProducts(newWatched);
  };

  // Get unique brands and categories
  const brands = useMemo(() => {
    const brandSet = new Set(MOCK_VARIANTS.map((v) => v.product.brand));
    return Array.from(brandSet).sort();
  }, []);

  const categories = useMemo(() => {
    const catSet = new Set(MOCK_VARIANTS.map((v) => v.product.category));
    return Array.from(catSet).sort();
  }, []);

  // Filter and sort
  const filteredVariants = useMemo(() => {
    let filtered = MOCK_VARIANTS.filter((variant) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = variant.product.name.toLowerCase().includes(query);
        const matchesBrand = variant.product.brand.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand) return false;
      }

      // Category filter
      if (categoryFilter !== "all" && variant.product.category !== categoryFilter) return false;

      // Brand filter
      if (brandFilter !== "all" && variant.product.brand !== brandFilter) return false;

      // In stock (mock: just show items with coverage > 5)
      if (inStockOnly && variant.coverage < 6) return false;

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.product.name.localeCompare(b.product.name);
        case "price_asc":
          return a.medianPrice - b.medianPrice;
        case "price_desc":
          return b.medianPrice - a.medianPrice;
        case "coverage":
          return b.coverage - a.coverage;
        case "popularity":
          return (b.coverage * 10 + Math.abs(b.delta7d)) - (a.coverage * 10 + Math.abs(a.delta7d));
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, categoryFilter, brandFilter, inStockOnly, sortBy]);

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4" />
            Filters & Search
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="text-xs">Search Products</Label>
              <Input
                id="search"
                placeholder="Product name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category" className="text-xs">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div>
              <Label htmlFor="brand" className="text-xs">Brand</Label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger id="brand" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sort" className="text-xs">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price_asc">Price (Low-High)</SelectItem>
                  <SelectItem value="price_desc">Price (High-Low)</SelectItem>
                  <SelectItem value="coverage">Coverage (High-Low)</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredVariants.length} of {MOCK_VARIANTS.length} products
            </p>
            {watchedProducts.size > 0 && (
              <Badge variant="secondary">
                <Bell className="h-3 w-3 mr-1" />
                {watchedProducts.size} watched
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-sm w-12"></th>
                <th className="text-left p-4 font-medium text-sm">Product</th>
                <th className="text-left p-4 font-medium text-sm">Category</th>
                <th className="text-left p-4 font-medium text-sm">Sizes & Prices</th>
                <th className="text-center p-4 font-medium text-sm">Coverage</th>
                <th className="text-right p-4 font-medium text-sm">Min</th>
                <th className="text-right p-4 font-medium text-sm">Median</th>
                <th className="text-right p-4 font-medium text-sm">P90</th>
                <th className="text-center p-4 font-medium text-sm">Δ7d</th>
                <th className="text-center p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-muted-foreground">
                    No products match your filters
                  </td>
                </tr>
              ) : (
                filteredVariants.map((variant) => {
                const isExpanded = expandedRows.has(variant.id);
                const priceData = generateMockPriceHistory();
                
                return (
                  <>
                    {/* Main Row */}
                    <tr 
                      key={variant.id} 
                      className="border-b hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => toggleRow(variant.id)}
                    >
                      <td className="p-4">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(variant.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {variant.product.name}
                              {variant.coverage >= 10 && (
                                <Sparkles className="h-3 w-3 text-amber-500" title="Popular" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{variant.product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{variant.product.category}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary">
                            {variant.size} {formatCurrency(variant.minPrice)}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge>{variant.coverage} stores</Badge>
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(variant.minPrice)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(variant.medianPrice)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(variant.p90Price)}
                      </td>
                      <td className="p-4">
                        <div className={`flex items-center justify-center gap-1 text-sm font-medium ${
                          variant.delta7d > 0 ? "text-red-600" : variant.delta7d < 0 ? "text-green-600" : ""
                        }`}>
                          {variant.delta7d > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : variant.delta7d < 0 ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : null}
                          <span>{formatPercent(variant.delta7d)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant={watchedProducts.has(variant.id) ? "default" : "outline"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatch(variant.id);
                            }}
                            title={watchedProducts.has(variant.id) ? "Remove from watchlist" : "Add to watchlist"}
                          >
                            <Bell className={`h-4 w-4 ${watchedProducts.has(variant.id) ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariant(variant.id);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="bg-accent/20 border-b">
                        <td colSpan={10} className="p-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-sm">Store Price Grid</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {BC_STORES.slice(0, variant.coverage).map((store, idx) => {
                                const price = variant.minPrice + (Math.random() * (variant.p90Price - variant.minPrice));
                                const onSale = Math.random() > 0.8;
                                
                                return (
                                  <div 
                                    key={store.id}
                                    className="border rounded-lg p-3 bg-background"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{store.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{store.city}</div>
                                      </div>
                                      {onSale && (
                                        <Badge variant="destructive" className="text-xs">Sale</Badge>
                                      )}
                                    </div>
                                    <div className="mt-2 text-lg font-bold">
                                      {formatCurrency(price)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Last seen: 2h ago
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="pt-4 border-t">
                              <h4 className="font-semibold text-sm mb-3">30-Day Price Trend</h4>
                              <div className="h-32">
                                <MiniSparkline data={priceData} />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedVariant && (
        <PriceLadderModal
          variantId={selectedVariant}
          open={!!selectedVariant}
          onOpenChange={(open) => !open && setSelectedVariant(null)}
        />
      )}
    </>
  );
}

// Helper to generate mock price history
function generateMockPriceHistory() {
  const basePrice = 35 + Math.random() * 20;
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: basePrice + Math.random() * 5 - 2.5,
  }));
}

