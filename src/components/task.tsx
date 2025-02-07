import React from "react";
import { RxDragHandleDots2 } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useTasksStore } from "@/store/useTasksStore";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function Task({
  id,
  title,
  description,
  status,
  moveUp,
  moveDown,
  isFirst,
  isLast,
}: {
  id: string;
  title: string;
  description?: string;
  status: string;
  moveUp: () => void;
  moveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const removeTask = useTasksStore((state) => state.removeTask);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex items-start justify-between rounded-lg bg-white px-1 py-2 text-gray-900",
        {
          "border-2 border-sky-500": status === "TODO",
          "border-2 border-amber-500": status === "IN_PROGRESS",
          "border-2 border-emerald-500": status === "DONE",
        }
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn("absolute left-0 top-0.5 cursor-move text-md", {
          "text-sky-500": status === "TODO",
          "text-amber-500": status === "IN_PROGRESS",
          "text-emerald-500": status === "DONE",
        })}
      >
        <RxDragHandleDots2 />
      </div>
      <div className="ml-4">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <p className="text-sm font-light text-gray-500">{description}</p>
      </div>
      <div>
        <button
          onClick={moveUp}
          className={cn("cursor-pointer h-5 w-5", {
            "text-blue-400 hover:-translate-y-px": !isFirst,
            "text-gray-500 opacity-40": isFirst,
          })}
        >
          <IoIosArrowUp />
        </button>
        <button
          onClick={moveDown}
          className={cn("cursor-pointer h-5 w-5", {
            "text-blue-400 hover:-translate-y-px": !isLast,
            "text-gray-500 opacity-40": isLast,
          })}
        >
          <IoIosArrowDown />
        </button>
        <button
          onClick={() => removeTask(id)}
          className="cursor-pointer h-5 w-5 text-gray-500 hover:text-rose-400"
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
}
