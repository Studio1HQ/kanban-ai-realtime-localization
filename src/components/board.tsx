"use client";

import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { getSession } from "next-auth/react";
import axios from "axios";
import { Session } from "next-auth";
import { Task as TTask } from "@prisma/client";
import { Task } from "@/components/task";
import { T } from "@tolgee/react";
import { useQuery } from "@tanstack/react-query";

export const Board = ({ userId }: { userId: string }) => {
  const socket = useSocket();

  const [tasks, setTasks] = useState<TTask[] | null>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  useEffect(() => {
    console.log("socket changed");
    socket?.on("tasks-updated", (data: TTask[] | undefined) => {
      console.log("socket data", data);
      if (!data) return;
      setTasks(data);
    });

    return () => {
      socket?.off("tasks-updated");
    };
  }, [socket]);

  useEffect(() => {
    console.log("socket changed in the task-created");
    socket?.on("task-created", (newTask: TTask) => {
      console.log("socket data", newTask);
      setTasks((prevTasks) => [...(prevTasks || []), newTask]);
    });

    return () => {
      socket?.off("task-created");
    };
  }, [socket]);

  const fetchUserData = async (userId: string, userEmail: string) => {
    const { data } = (await axios.get("/api/tasks", {
      params: { userId, email: userEmail },
    })) as { data: { tasks: TTask[] } };
    return data.tasks;
  };

  useQuery({
    queryKey: ["userTasks"],
    queryFn: async () => {
      const userTasks = await fetchUserData(userId, session?.user?.email || "");
      setTasks(userTasks);
      return userTasks;
    },
    enabled: !!session,
  });

  const tasksByStatus = (status: number) =>
    tasks?.filter((task) => task.column === status) || [];

  const columns = {
    0: "Ongoing",
    1: "Pending",
    2: "Completed",
  };

  const handleDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    const newTasks = tasks ? [...tasks] : [];
    const [movedTask] = newTasks.splice(source.index, 1);

    movedTask.column = Number(destination.droppableId);
    movedTask.order = Number(destination.index);

    // Insert the moved task at the new index
    newTasks.splice(destination.index, 0, movedTask);

    setTasks(newTasks);

    console.log("this is the moved task", movedTask);

    socket?.emit("task-drag", {
      id: movedTask.id,
      newColumn: movedTask.column,
      newOrder: movedTask.order,
      email: session?.user?.email || "",
    });

    console.log(destination, source);
  };

  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="container mx-auto mt-10 mb-5">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([status, title]) => (
            <div
              key={status}
              className="p-4 border rounded-lg shadow-lg bg-gray-50 flex flex-col items-center"
            >
              <h2 className="text-xl font-bold mb-4 text-center">
                <T keyName={title.toLowerCase()} />
              </h2>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="w-full flex flex-col items-center min-h-40"
                  >
                    {tasksByStatus(Number(status)).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-full"
                          >
                            <Task task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
