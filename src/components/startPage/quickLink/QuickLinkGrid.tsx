import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

import { useStorage } from "@plasmohq/storage/hook";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { db } from "@/indexdb";
import type { QuickLinkSettings } from "@/types";
import { cn } from "@/utils/cn";

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

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (showModal && event.key === "Escape") {
        setShowModal(false);
      }
    });

    return () => {
      document.removeEventListener("keydown", (event) => {
        if (showModal && event.key === "Escape") {
          setShowModal(false);
        }
      });
    };
  });

  const { onDragEnter, onDragStart, onDragEnd, onDragOver, onDrop } =
    useDragAndDrop(quickLinkOrder, setQuickLinkOrder);

  return (
    <div
      data-testid="QuickLinkGrid"
      className={cn(
        "grid w-full max-w-7xl grid-cols-2 gap-6 p-4 sm:grid-cols-3 md:grid-cols-4",
        quickLink?.bigQuickLinks ? "lg:grid-cols-6" : "lg:grid-cols-6"
      )}>
      <AnimatePresence>
        {showModal && (
          <motion.div
            data-testid="QuickLinkModal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <QuickLinkModal
              quickLinkSettings={quickLink}
              setShowModal={setShowModal}
              id={editingLink?.id}
              dialName={editingLink?.name}
              dialUrl={editingLink?.url}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
