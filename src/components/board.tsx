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
    if (!session) return;
    const userEmail = session.user?.email || "";

    const getUserData = async () => {
      try {
        const { data } = (await axios.get("/api/tasks", {
          params: { userId, email: userEmail },
        })) as { data: { tasks: TTask[] } };

        setTasks(data.tasks);
        console.log("this is the data", data);
      } catch (e) {
        console.error(e);
      }
    };
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    console.log("socket changed");
    socket?.on("tasks-updated", (data: TTask[] | undefined) => {
      console.log("socket data", data);
      if (!data) return;
      setTasks(data);
    });
  }, [socket]);

  const columns = {
    0: "Ongoing",
    1: "Pending",
    2: "Completed",
  };

  const tasksByStatus = (status: number) =>
    (tasks?.filter((task) => task.column === status) || []).sort(
      (a, b) => a.order - b.order
    );

  const handleDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    const newTasks = tasks ? [...tasks] : [];
    const [movedTask] = newTasks.splice(source.index, 1);

    newTasks.splice(destination.index, 0, movedTask);

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

  return (
    <div className="container mx-auto mt-10 mb-5">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([status, title]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 border rounded-lg shadow-lg bg-gray-50 flex flex-col items-center"
                >
                  <h2 className="text-xl font-bold mb-4 text-center">
                    {title}
                  </h2>
                  <div className="w-full flex flex-col items-center">
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
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
