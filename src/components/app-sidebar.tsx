"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Eye,
  Bell,
  Users,
  CreditCard,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Market Advisor", href: "/app/compare", icon: TrendingUp, badge: "New" },
  { name: "Catalog", href: "/app/catalog", icon: Package, badge: null },
  { name: "Activity Log", href: "/app/activity", icon: Activity, badge: null },
  { name: "Brand Watch", href: "/app/brand-watch", icon: Eye, badge: null },
  { name: "Alerts", href: "/app/alerts", icon: Bell, badge: 3 },
  { name: "Team", href: "/app/team", icon: Users, badge: null },
  { name: "Billing", href: "/app/billing", icon: CreditCard, badge: null },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-muted/10 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-lg">LeafLedger</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="flex items-center justify-center w-full">
              <span className="text-2xl">🌿</span>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs rounded-full",
                          typeof item.badge === "number"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              collapsed && "justify-center"
            )}
            title={collapsed ? "Back to Home" : undefined}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Back to Home</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden h-16 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-lg">LeafLedger</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Mobile menu would go here - using a Sheet component */}
          <Link href="/app/alerts">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </Link>
        </div>
      </header>
    </>
  );
}

