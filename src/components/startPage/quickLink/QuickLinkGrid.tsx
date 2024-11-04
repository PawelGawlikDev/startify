import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { useDragAndDrop } from "~hooks/useDragAndDrop";
import { db } from "~indexdb";
import type { QuickLinkSettings } from "~types";
import { cn } from "~utils/cn";

import { AddQuickLinkButton, QuickLink } from "./QuickLink";
import QuickLinkModal from "./QuickLinkModal";

export default function QuickLinkGrid() {
  const [quickLink] = useStorage<QuickLinkSettings>("quickLink", {
    bigQuickLinks: false,
    type: "gradient"
  });

  const [showModal, setShowModal] = useState(false);
  const [quickLinkOrder, setQuickLinkOrder] = useState<number[]>([]);
  const [editingLink, setEditingLink] = useState<{
    name: string;
    url: string;
    favicon: string;
    id: number;
  } | null>(null);
  const quickLinks = useLiveQuery(async () => await db.quickLinks.toArray());

  useEffect(() => {
    const savedOrder = localStorage.getItem("speedLinkOrder");

    if (savedOrder) {
      setQuickLinkOrder(JSON.parse(savedOrder));
    } else if (quickLinks && quickLinks.length > 0) {
      const currentOrderIds = quickLinks.map((dial) => dial.id);

      if (JSON.stringify(currentOrderIds) !== JSON.stringify(quickLinkOrder)) {
        setQuickLinkOrder(currentOrderIds);
      }
    }
  }, [quickLinks]);

  const { onDragEnter, onDragStart, onDragEnd, onDragOver, onDrop } =
    useDragAndDrop(quickLinkOrder, setQuickLinkOrder);

  return (
    <div
      data-testid="QuickLinkGrid"
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full p-4 max-w-7xl",
        quickLink?.bigQuickLinks ? "lg:grid-cols-6" : "lg:grid-cols-6"
      )}>
      {showModal && (
        <QuickLinkModal
          quickLinkSettings={quickLink}
          setShowModal={setShowModal}
          id={editingLink?.id}
          favicon={editingLink?.favicon}
          dialName={editingLink?.name}
          dialUrl={editingLink?.url}
        />
      )}
      {quickLinkOrder
        .map((id: number) => quickLinks?.find((dial) => dial.id === id))
        .filter(Boolean)
        .map((dial, index) => (
          <div
            data-testid="QuickLinkWrapper"
            key={dial.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragEnd={onDragEnd}
            onDrop={onDrop}>
            <QuickLink
              quickLinkSettings={quickLink}
              setEditingLink={setEditingLink}
              setShowModal={setShowModal}
              id={dial.id}
              pageName={dial.name}
              favicon={dial?.favicon}
              url={dial.url}
            />
          </div>
        ))}
      <AddQuickLinkButton
        quickLinkSettings={quickLink}
        setShowModal={setShowModal}
        setEditingLink={setEditingLink}
      />
    </div>
  );
}
