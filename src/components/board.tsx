"use client";

import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { getSession } from "next-auth/react";
import axios from "axios";
import { Session } from "next-auth";
import { Task } from "@prisma/client";

export const Board = ({ userId }: { userId: string }) => {
  const socket = useSocket();

  const [tasks, setTasks] = useState<Task[] | null>([]);
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

  const handleDragEnd = () => {
    console.log("dragged");
  };

  return (
    <div className="container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Array.isArray(tasks) &&
          tasks.map((task) => <div key={task.id}>{task.title}</div>)}
      </DragDropContext>
    </div>
  );
};
