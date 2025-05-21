import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { db } from "@/indexdb";

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

  const handleAddQuickLink = (newId: number) => {
    setQuickLinkOrder((prevOrder) => {
      const updatedOrder = [...prevOrder, newId];

      localStorage.setItem("speedLinkOrder", JSON.stringify(updatedOrder));

      return updatedOrder;
    });
  };

  useEffect(() => {
    const savedOrder = localStorage.getItem("speedLinkOrder");

    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);

      if (quickLinks) {
        const validIds = quickLinks.map((link) => link.id);
        const filteredOrder = parsedOrder.filter((id: number) =>
          validIds.includes(id)
        );

        if (JSON.stringify(filteredOrder) !== JSON.stringify(quickLinkOrder)) {
          setQuickLinkOrder(filteredOrder);
          localStorage.setItem("speedLinkOrder", JSON.stringify(filteredOrder));
        }
      }
    } else if (quickLinks && quickLinks.length > 0) {
      const currentOrderIds = quickLinks.map((dial) => dial.id);

      setQuickLinkOrder(currentOrderIds);
      localStorage.setItem("speedLinkOrder", JSON.stringify(currentOrderIds));
    }
  }, [quickLinks]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (showModal && event.key === "Escape") {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal, setShowModal]);

  const { onDragEnter, onDragStart, onDragEnd, onDragOver, onDrop } =
    useDragAndDrop(quickLinkOrder, setQuickLinkOrder);

  return (
    <div
      data-testid="QuickLinkGrid"
      className="mx-auto grid auto-rows-min grid-cols-2 place-items-center items-start gap-6 p-4 sm:max-w-screen-md sm:grid-cols-3 md:max-w-screen-lg md:grid-cols-4 lg:grid-cols-6">
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
              onAddLink={handleAddQuickLink}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {quickLinks &&
        quickLinkOrder
          .map((id: number) => quickLinks.find((dial) => dial.id === id))
          .filter(
            (dial): dial is (typeof quickLinks)[number] => dial !== undefined
          )
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
                setQuickLinkOrder={setQuickLinkOrder}
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
