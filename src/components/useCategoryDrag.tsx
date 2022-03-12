import { useRef } from "react";
import { ItemTypes } from "../lib/draggable";
import { useDrag, useDrop } from "react-dnd";

/**
 * Array slice, drag and drop friendly
 *
 * @param {any[]} collection  array to slice
 * @param {any} item item to move
 * @param {number} placement  where to put item
 * @returns {any[]}  rearranged array
 */
export function rearrange(collection, item, placement) {
  // remove item from array
  const removed = [...collection.slice(0, item), ...collection.slice(item + 1)];
  // get location for placement in removed item array
  const index = removed.indexOf(collection[placement]);
  // place item
  if (item > placement) {
    // moving item down. Indexes affected by removal
    const first = removed.slice(0, index);
    const entry = collection[item];
    const end = removed.slice(index);
    return [...first, entry, ...end];
  } else {
    // moving item up. Index the same prior to removal
    const first = removed.slice(0, index + 1);
    const entry = collection[item];
    const end = removed.slice(index + 1);
    return [...first, entry, ...end];
  }
}

export function useCategoryDrag({ category, index, onDrop }) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CATEGORY,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      onDrop(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CATEGORY,
    item: () => {
      return { ...category, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return [ref];
}
