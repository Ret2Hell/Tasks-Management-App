"use client";

import Column from "./column";
import NewTaskDialog from "./new-task-dialog";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Status, useTasksStore } from "@/store/useTasksStore";

export default function Columns() {
  const changeStatus = useTasksStore((state) => state.changeStatus);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const newStatus = over.id as Status;

    if (active.id !== newStatus) {
      changeStatus(active.id as string, newStatus);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <div className="flex justify-end">
          <NewTaskDialog />
        </div>
        <section className="mt-5 flex gap-6 lg:gap-12">
          <Column title="Todo" status="TODO" />
          <Column title="In Progress" status="IN_PROGRESS" />
          <Column title="Done" status="DONE" />
        </section>
      </div>
    </DndContext>
  );
}
