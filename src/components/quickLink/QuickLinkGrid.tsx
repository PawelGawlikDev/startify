import { AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useQuickLinkOrder } from "@/hooks/useQuickLinkOrder";
import { cn } from "@/utils/cn";
import { AddQuickLinkButton, QuickLink } from "./QuickLink";
import QuickLinkModal from "./QuickLinkModal";
import { useSettings } from "@/context/SettingsContext";
import { defaultSettings } from "@/constants/defaultSettings";
import { Overlay } from "../Overlay";

export default function QuickLinkGrid() {
  const { getSetting } = useSettings();
  const quickLink = getSetting("quickLink") ?? defaultSettings.quickLink;
  const [showModal, setShowModal] = useState(false);
  const { quickLinkOrder, setQuickLinkOrder, quickLinks } = useQuickLinkOrder();
  const [editingLink, setEditingLink] = useState<{
    name: string;
    url: string;
    id: number;
  } | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (showModal && event.key === "Escape") setShowModal(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showModal]);

  const sortedQuickLinks = useMemo(() => {
    if (!quickLinks) return [];

    return quickLinkOrder
      .map((id) => quickLinks.find((link) => link.id === id))
      .filter((link): link is NonNullable<typeof link> => link !== undefined);
  }, [quickLinks, quickLinkOrder]);

  const { onDragStart, onDragEnter, onDragEnd, onDragOver, onDrop } =
    useDragAndDrop(quickLinkOrder, (order) => {
      setQuickLinkOrder(order);
      localStorage.setItem("quickLinkOrder", JSON.stringify(order));
    });

  return (
    <div
      data-testid="QuickLinkGrid"
      className={cn(
        "grid w-full max-w-7xl gap-4 p-4",
        "auto-rows-min grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      )}>
      <AnimatePresence>
        {showModal && (
          <Overlay dataTestId="QuickLinkModal">
            <QuickLinkModal
              setShowModal={setShowModal}
              id={editingLink?.id}
              dialName={editingLink?.name}
              dialUrl={editingLink?.url}
              onAddLink={(id) => {
                setQuickLinkOrder((prevOrder) => {
                  if (prevOrder.includes(id)) return prevOrder;
                  return [...prevOrder, id];
                });
              }}
            />
          </Overlay>
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
