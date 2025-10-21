"use client";

import { ComponentType, useEffect } from "react";
import { useStores } from "@/lib/hooks";
import { toast } from "sonner";

/**
 * HOC that guards components to ensure data scope enforcement.
 * Checks if the requested stores/filters are within the org's allowlist.
 * 
 * Usage:
 * const GuardedCatalog = withDataScopeGuard(CatalogPage);
 */

interface DataScopeProps {
  storeIds?: string[];
  filters?: Record<string, any>;
}

export function withDataScopeGuard<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return function DataScopeGuardedComponent(props: P & DataScopeProps) {
    const trackedStores = useStores();
    const allowedStoreIds = trackedStores.map(s => s.id);

    useEffect(() => {
      // Check if any requested stores are outside allowlist
      if (props.storeIds && props.storeIds.length > 0) {
        const unauthorizedStores = props.storeIds.filter(
          id => !allowedStoreIds.includes(id)
        );

        if (unauthorizedStores.length > 0) {
          toast.error("Access Denied", {
            description: "Some stores are not in your tracked list. Redirecting...",
            action: {
              label: "Manage Stores",
              onClick: () => {
                // In production, navigate to store management
                window.location.href = "/app/settings/stores";
              },
            },
          });
        }
      }
    }, [props.storeIds, allowedStoreIds]);

    // Filter props to only include allowed stores
    const filteredProps = {
      ...props,
      storeIds: props.storeIds?.filter(id => allowedStoreIds.includes(id)),
    };

    return <WrappedComponent {...(filteredProps as P)} />;
  };
}

/**
 * Hook version for use in components
 */
export function useDataScopeGuard(requestedStoreIds?: string[]): {
  isAllowed: boolean;
  allowedStoreIds: string[];
  unauthorizedStoreIds: string[];
} {
  const trackedStores = useStores();
  const allowedStoreIds = trackedStores.map(s => s.id);

  if (!requestedStoreIds || requestedStoreIds.length === 0) {
    return {
      isAllowed: true,
      allowedStoreIds,
      unauthorizedStoreIds: [],
    };
  }

  const unauthorizedStoreIds = requestedStoreIds.filter(
    id => !allowedStoreIds.includes(id)
  );

  return {
    isAllowed: unauthorizedStoreIds.length === 0,
    allowedStoreIds: requestedStoreIds.filter(id => allowedStoreIds.includes(id)),
    unauthorizedStoreIds,
  };
}


