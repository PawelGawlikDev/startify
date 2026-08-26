import { useMemo, useState, useCallback, useEffect } from "react";

import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";

export const useDragAndDrop = (
  quickLinkOrder: number[],
  updateOrder: (order: number[]) => void
) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);

      if (!over || active.id === over.id) return;

      const oldIndex = quickLinkOrder.indexOf(Number(active.id));
      const newIndex = quickLinkOrder.indexOf(Number(over.id));

      if (oldIndex < 0 || newIndex < 0) return;

      const updatedOrder = arrayMove(quickLinkOrder, oldIndex, newIndex);

      updateOrder(updatedOrder);
      localStorage.setItem("quickLinkOrder", JSON.stringify(updatedOrder));
    },
    [quickLinkOrder, updateOrder]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeIndex = useMemo(
    () => (activeId === null ? null : quickLinkOrder.indexOf(activeId)),
    [activeId, quickLinkOrder]
  );

  useEffect(() => {
    if (activeId === null) return;

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "grabbing";

    return () => {
      document.body.style.cursor = previousCursor;
    };
  }, [activeId]);

  return {
    activeId,
    activeIndex,
    collisionDetection: closestCenter,
    handleDragCancel,
    handleDragEnd,
    handleDragStart,
    sensors,
    sortingStrategy: rectSortingStrategy
  };
};
