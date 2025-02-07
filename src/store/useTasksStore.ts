import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid";

export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

export type State = {
  tasks: Task[];
};

export type Actions = {
  addTask: (title: string, description?: string) => void;
  removeTask: (id: string) => void;
  changeStatus: (id: string, newStatus: Status) => void;
  moveUp: (id: string, pushedDownTaskId: string) => void;
  moveDown: (id: string, pushedUpTaskId: string) => void;
};

export const useTasksStore = create<State & Actions>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title: string, description?: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: uuid(), title, description, status: "TODO" },
          ],
        })),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      changeStatus: (id: string, newStatus: Status) =>
        set((state) => {
          const tasks = state.tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          );
          const taskIndex = tasks.findIndex((task) => task.id === id);
          const [task] = tasks.splice(taskIndex, 1);
          tasks.push(task);
          return { tasks };
        }),
      moveUp: (id: string, pushedDownTaskId) => {
        set((state) => {
          const tasks = [...state.tasks];
          const index = tasks.findIndex((task) => task.id === id);
          const pushedDownTaskIndex = tasks.findIndex(
            (task) => task.id === pushedDownTaskId
          );

          tasks[index] = tasks[pushedDownTaskIndex];
          tasks[pushedDownTaskIndex] = state.tasks[index];

          return { tasks };
        });
      },
      moveDown: (id: string, pushedUpTaskId) => {
        set((state) => {
          const tasks = [...state.tasks];
          const index = tasks.findIndex((task) => task.id === id);
          const pushedUpTaskIndex = tasks.findIndex(
            (task) => task.id === pushedUpTaskId
          );

          tasks[index] = tasks[pushedUpTaskIndex];
          tasks[pushedUpTaskIndex] = state.tasks[index];

          return { tasks };
        });
      },
    }),
    { name: "tasks" }
  )
);
