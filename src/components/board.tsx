"use client";

import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
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
        const { data } = await axios.get("/api/tasks", {
          params: { userId, email: userEmail },
        });
        setTasks(data.tasks);
        console.log("this is the data", data);
      } catch (e) {
        console.error(e);
      }
    };
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const columns = {
    0: "Ongoing",
    1: "Pending",
    2: "Completed",
  };

  const tasksByStatus = (status: number) =>
    tasks?.filter((task) => task.order === status) || [];

  const handleDragEnd = () => {
    console.log("dragged");
  };

  return (
    <div className="container mx-auto mt-10">
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
