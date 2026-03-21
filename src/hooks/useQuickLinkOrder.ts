import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";

import { db } from "@/indexdb";

export function useQuickLinkOrder() {
  const [quickLinkOrder, setQuickLinkOrder] = useState<number[]>([]);
  const quickLinks = useLiveQuery(async () => await db.quickLinks.toArray());

  const initializeOrder = useCallback(() => {
    if (!quickLinks) return;

    const savedOrder = localStorage.getItem("quickLinkOrder");
    const allIds = quickLinks.map((link) => link.id);
    let newOrder: number[];

    if (savedOrder) {
      const parsedOrder: number[] = JSON.parse(savedOrder);
      const savedSet = new Set(parsedOrder);
      const missing = allIds.filter((id) => !savedSet.has(id));

      newOrder = [
        ...parsedOrder.filter((id) => allIds.includes(id)),
        ...missing
      ];
    } else {
      newOrder = allIds;
    }

    return newOrder;
  }, [quickLinks]);

  useEffect(() => {
    const newOrder = initializeOrder();
    if (newOrder) {
      setQuickLinkOrder((prev) => {
        const sameLength = prev.length === newOrder.length;
        const sameValues = prev.every((id, i) => id === newOrder[i]);

        return sameLength && sameValues ? prev : newOrder;
      });
    }
  }, [quickLinks, initializeOrder]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "quickLinkOrder") {
        const newOrder = event.newValue ? JSON.parse(event.newValue) : [];
        setQuickLinkOrder(newOrder);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saveOrder = useCallback((order: number[]) => {
    localStorage.setItem("quickLinkOrder", JSON.stringify(order));
  }, []);

  return { quickLinkOrder, setQuickLinkOrder, saveOrder, quickLinks };
}
