import { useRef, useState, useCallback } from "react";

export const useDragAndDrop = (
  quickLinkOrder: number[],
  updateOrder: (order: number[]) => void
) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const lastDragTime = useRef<number>(0);

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
      const now = Date.now();

      if (
        draggingIndex === null ||
        draggingIndex === targetIndex ||
        now - lastDragTime.current < 200
      ) {
        return;
      }

      const updatedOrder = [...quickLinkOrder];
      const [movedItem] = updatedOrder.splice(draggingIndex, 1);

      updatedOrder.splice(targetIndex, 0, movedItem);

      updateLocalStorage(updatedOrder);
      setDraggingIndex(targetIndex);

      lastDragTime.current = now;
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
    onDrop,
    draggingIndex
  };
};
