"use client";

import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { getSession } from "next-auth/react";
import axios from "axios";
import { Session } from "next-auth";

export const Board = () => {
  const socket = useSocket();

  const [tasks, setTasks] = useState({});
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
          params: { email: userEmail },
        });
        setTasks(data);
        console.log("this is the data", tasks);
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
        <div>This is good </div>
      </DragDropContext>
    </div>
  );
};
