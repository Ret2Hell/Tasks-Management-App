"use client";

import Task from "./task";
import { useMemo } from "react";
import { Status, useTasksStore } from "@/store/useTasksStore";
import { useDroppable } from "@dnd-kit/core";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Column({
  title,
  status,
}: {
  title: string;
  status: Status;
}) {
  const tasks = useTasksStore((state) => state.tasks);
  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.status === status),
    [tasks, status]
  );
  function moveUp(id: string) {
    const index = filteredTasks.findIndex((task) => task.id === id);
    if (index === 0) return;

    const pushedDownTaskId = filteredTasks[index - 1].id;
    useTasksStore.getState().moveUp(id, pushedDownTaskId);
  }
  function moveDown(id: string) {
    const index = filteredTasks.findIndex((task) => task.id === id);
    if (index === filteredTasks.length - 1) return;

    const pushedUpTaskId = filteredTasks[index + 1].id;
    useTasksStore.getState().moveUp(pushedUpTaskId, id);
  }

  const { setNodeRef } = useDroppable({ id: status });
  const [parent] = useAutoAnimate();

  return (
    <section className="h-[600px] flex-1">
      <h2 className="ml-1 font-serif text-2xl font-semibold">{title}</h2>

      <div
        ref={setNodeRef}
        className="mt-3.5 h-full w-full flex-1 rounded-xl bg-gray-700/50 p-4"
      >
        <div ref={parent} className="flex flex-col gap-4">
          {filteredTasks.map((task) => (
            <Task
              key={task.id}
              {...task}
              moveUp={() => moveUp(task.id)}
              moveDown={() => moveDown(task.id)}
              isFirst={filteredTasks.findIndex((t) => t.id === task.id) === 0}
              isLast={
                filteredTasks.findIndex((t) => t.id === task.id) ===
                filteredTasks.length - 1
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
