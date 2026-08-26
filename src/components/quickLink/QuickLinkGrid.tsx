import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useQuickLinkOrder } from "@/hooks/useQuickLinkOrder";
import { cn } from "@/utils/cn";
import {
  AddQuickLinkButton,
  QuickLink,
  QuickLinkDragOverlay
} from "./QuickLink";
import QuickLinkModal from "./QuickLinkModal";
import { useSettings } from "@/context/SettingsContext";
import { defaultSettings } from "@/constants/defaultSettings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

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

  const {
    activeId,
    collisionDetection,
    handleDragCancel,
    handleDragEnd,
    handleDragStart,
    sensors,
    sortingStrategy
  } = useDragAndDrop(quickLinkOrder, (order) => {
    setQuickLinkOrder(order);
    localStorage.setItem("quickLinkOrder", JSON.stringify(order));
  });

  const activeLink =
    activeId === null
      ? null
      : sortedQuickLinks.find((link) => link.id === activeId);

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          data-testid="QuickLinkModal"
          showCloseButton={false}
          className="max-w-[min(92vw,480px)] border-none bg-transparent p-0 shadow-none ring-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Quick Link</DialogTitle>
            <DialogDescription>Add or edit a quick link.</DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

      <DndContext
        collisionDetection={collisionDetection}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}>
        <SortableContext items={quickLinkOrder} strategy={sortingStrategy}>
          <div
            data-testid="QuickLinkGrid"
            className={cn(
              "grid w-full max-w-7xl gap-4 p-4",
              "auto-rows-min grid-cols-1 min-[500px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            )}>
            {sortedQuickLinks.map((link) => (
              <SortableQuickLink
                key={link.id}
                id={link.id}
                isDragging={activeId === link.id}
                link={link}
                setEditingLink={setEditingLink}
                setQuickLinkOrder={setQuickLinkOrder}
                setShowModal={setShowModal}
              />
            ))}

            {(quickLinkOrder.length > 0 || quickLinks?.length === 0) && (
              <AddQuickLinkButton
                quickLinkSettings={quickLink}
                setShowModal={setShowModal}
                setEditingLink={setEditingLink}
              />
            )}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeLink ? (
            <QuickLinkDragOverlay pageName={activeLink.name} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

function SortableQuickLink({
  id,
  isDragging,
  link,
  setEditingLink,
  setQuickLinkOrder,
  setShowModal
}: {
  id: number;
  isDragging: boolean;
  link: { id: number; name: string; url: string };
  setEditingLink: React.Dispatch<
    React.SetStateAction<{
      name: string;
      url: string;
      id: number;
    } | null>
  >;
  setQuickLinkOrder: React.Dispatch<React.SetStateAction<number[]>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={cn(
        "cursor-grab touch-none transition-opacity duration-150 active:cursor-grabbing",
        isDragging && "cursor-grabbing opacity-0"
      )}
      {...attributes}
      {...listeners}>
      <QuickLink
        setEditingLink={setEditingLink}
        setShowModal={setShowModal}
        setQuickLinkOrder={setQuickLinkOrder}
        id={link.id}
        pageName={link.name}
        url={link.url}
      />
    </div>
  );
}
