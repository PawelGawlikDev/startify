import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { db } from "@/indexdb";
import { cn } from "@/utils/cn";
import { AddQuickLinkButton, QuickLink } from "./QuickLink";
import QuickLinkModal from "./QuickLinkModal";
import { useSettings } from "@/context/SettingsContext";
import { defaultSettings } from "@/constants/defaultSettings";

export default function QuickLinkGrid() {
  const { getSetting } = useSettings();
  const quickLink = getSetting("quickLink") ?? defaultSettings.quickLink;

  const [showModal, setShowModal] = useState(false);
  const [quickLinkOrder, setQuickLinkOrder] = useState<number[]>([]);
  const [editingLink, setEditingLink] = useState<{
    name: string;
    url: string;
    id: number;
  } | null>(null);
  const quickLinks = useLiveQuery(async () => await db.quickLinks.toArray());

  useEffect(() => {
    if (!quickLinks) return;

    const savedOrder = localStorage.getItem("quickLinkOrder");
    const allIds = quickLinks.map((link) => link.id);
    let newOrder: number[] = [];

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

    setQuickLinkOrder((prev) => {
      const sameLength = prev.length === newOrder.length;
      const sameValues = prev.every((id, i) => id === newOrder[i]);

      return sameLength && sameValues ? prev : newOrder;
    });
  }, [quickLinks]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (showModal && event.key === "Escape") setShowModal(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  useEffect(() => {
    localStorage.setItem("quickLinkOrder", JSON.stringify(quickLinkOrder));
  }, [quickLinkOrder]);

  const sortedQuickLinks = useMemo(() => {
    if (!quickLinks) return [];

    return quickLinkOrder
      .map((id) => quickLinks.find((link) => link.id === id))
      .filter((link): link is NonNullable<typeof link> => link !== undefined);
  }, [quickLinks, quickLinkOrder]);

  const { onDragStart, onDragEnter, onDragEnd, onDragOver, onDrop } =
    useDragAndDrop(quickLinkOrder, setQuickLinkOrder);

  return (
    <div
      data-testid="QuickLinkGrid"
      className={cn(
        "grid w-full max-w-7xl gap-4 p-4",
        "auto-rows-min grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      )}>
      <AnimatePresence>
        {showModal && (
          <motion.div
            data-testid="QuickLinkModal"
            className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <QuickLinkModal
              setShowModal={setShowModal}
              id={editingLink?.id}
              dialName={editingLink?.name}
              dialUrl={editingLink?.url}
              onAddLink={(id) => {
                setQuickLinkOrder((prevOrder) => {
                  if (prevOrder.includes(id)) return prevOrder;

                  const newOrder = [...prevOrder, id];

                  localStorage.setItem(
                    "quickLinkOrder",
                    JSON.stringify(newOrder)
                  );

                  return newOrder;
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {sortedQuickLinks.map((link, index) => (
        <div
          key={link.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={onDragOver}
          onDragEnter={(e) => onDragEnter(e, index)}
          onDragEnd={onDragEnd}
          onDrop={onDrop}>
          <QuickLink
            setEditingLink={setEditingLink}
            setShowModal={setShowModal}
            setQuickLinkOrder={setQuickLinkOrder}
            id={link.id}
            pageName={link.name}
            url={link.url}
          />
        </div>
      ))}

      {(quickLinkOrder.length > 0 || quickLinks?.length === 0) && (
        <AddQuickLinkButton
          quickLinkSettings={quickLink}
          setShowModal={setShowModal}
          setEditingLink={setEditingLink}
        />
      )}
    </div>
  );
}
