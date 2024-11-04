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
import { T, useTranslate } from "@tolgee/react";
import { useToast } from "@/hooks/use-toast";

export const Board = ({ userId }: { userId: string }) => {
  const socket = useSocket();
  const { toast } = useToast();

  const { t } = useTranslate();

  const [tasks, setTasks] = useState<TTask[] | null>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSession();
        setSession(sessionData);
      } catch (error) {
        console.error("ERROR:", error);
        toast({
          title: t("something-went-wrong"),
          variant: "destructive",
        });
      }
    };
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!session) return;

    const fetchUserTasks = async () => {
      try {
        const userEmail = session.user?.email || "";
        const { data } = (await axios.get("/api/tasks", {
          params: { userId, email: userEmail },
        })) as { data: { tasks: TTask[] } };

        setTasks(data.tasks);
      } catch (error) {
        console.error("ERROR:", error);
      }
    };
    fetchUserTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    const handleTasksUpdated = (data: TTask[] | undefined) => {
      if (!data) return;
      setTasks(data);
    };

    const handleTaskCreated = (newTask: TTask) => {
      setTasks((prevTasks) => [...(prevTasks || []), newTask]);
    };

    socket?.on("tasks-updated", handleTasksUpdated);
    socket?.on("task-created", handleTaskCreated);

    return () => {
      socket?.off("tasks-updated", handleTasksUpdated);
      socket?.off("task-created", handleTaskCreated);
    };
  }, [socket]);

  const tasksByStatus = (status: number) =>
    tasks?.filter((task) => task.column === status);

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

    socket?.emit("task-drag", {
      source,
      destination,
      email: session?.user?.email || "",
    });
  };

  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="container mx-auto mt-10 mb-5">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    {tasksByStatus(Number(status))?.map((task, index) => (
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
