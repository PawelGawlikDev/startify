import { useRef, useState, useCallback } from "react";

export const useDragAndDrop = (
  quickLinkOrder: number[],
  updateOrder: (order: number[]) => void
) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const isThrottleActive = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateLocalStorage = useCallback(
    (order: number[]) => {
      updateOrder(order);
      localStorage.setItem("speedLinkOrder", JSON.stringify(order));
    },
    [updateOrder]
  );

  const onDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, index: number) => {
      setDraggingIndex(index);
      event.dataTransfer.effectAllowed = "move";
      event.currentTarget.classList.add("dragging");
    },
    []
  );

  const onDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
      if (
        draggingIndex === null ||
        draggingIndex === targetIndex ||
        isThrottleActive.current
      ) {
        return;
      }

      const updatedOrder = [...quickLinkOrder];
      const [movedItem] = updatedOrder.splice(draggingIndex, 1);

      updatedOrder.splice(targetIndex, 0, movedItem);

      updateLocalStorage(updatedOrder);
      setDraggingIndex(targetIndex);

      isThrottleActive.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        isThrottleActive.current = false;
      }, 250);
    },
    [draggingIndex, quickLinkOrder, updateLocalStorage]
  );

  const onDragEnd = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove("dragging");
    setDraggingIndex(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove("dragging");
    setDraggingIndex(null);
  }, []);

  return {
    onDragStart,
    onDragEnter,
    onDragEnd,
    onDragOver,
    onDrop
  };
};
