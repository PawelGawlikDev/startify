import { useRef, useState } from "react";

export const useDragAndDrop = (
  quickLinkOrder: number[],
  updateOrder: (order: number[]) => void
) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [isThrottleActive, setIsThrottleActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateLocalStorage = (order: number[]) => {
    updateOrder(order);
    localStorage.setItem("speedLinkOrder", JSON.stringify(order));
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggingIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.currentTarget.style.opacity = "0";
  };

  const onDragEnter = (
    event: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    if (
      draggingIndex === null ||
      draggingIndex === targetIndex ||
      isThrottleActive
    ) {
      return;
    }

    const updatedOrder = [...quickLinkOrder];
    const [movedItem] = updatedOrder.splice(draggingIndex, 1);

    updatedOrder.splice(targetIndex, 0, movedItem);

    updateLocalStorage(updatedOrder);
    setDraggingIndex(targetIndex);

    setIsThrottleActive(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsThrottleActive(false);
    }, 250);
  };

  const onDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.opacity = "1";
    setDraggingIndex(null);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.currentTarget.style.opacity = "1";
    setDraggingIndex(null);
  };

  return { onDragStart, onDragEnter, onDragEnd, onDragOver, onDrop };
};
