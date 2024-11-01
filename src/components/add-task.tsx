"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GearIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useTranslate, T } from "@tolgee/react";

import { useChat } from "ai/react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/providers/socket-provider";
import { Task as TTask } from "@prisma/client";

export const AddTask = ({ userId }: { userId: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const socket = useSocket();

  const { t } = useTranslate();

  const { toast } = useToast();

  const {
    messages,
    //input: AIInput,
    handleSubmit: handleAISubmit,
    setInput: setAIInput,
  } = useChat();

  useEffect(() => {
    const aiResponse = messages
      .filter((m) => m.role === "assistant")
      .map((m) => m.content)
      .join(" ");

    if (aiResponse && description !== aiResponse) setDescription(aiResponse);
  }, [messages, description]);

  const handleGenerateClick = () => {
    setAIInput(title);
    handleAISubmit();
  };

  const { mutate: createTask, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(`/api/tasks/${userId}/create`, {
        title,
        description,
      });
      console.log("this is the data we received", data);
      return data as TTask;
    },
    onSuccess: (newTask) => {
      setTitle("");
      setDescription("");

      socket?.emit("task-created", newTask);
    },
    onError: (error) => {
      console.error("Error submitting task:", error);
      toast({
        title: t("something-went-wrong"),
        description: t("failed-to-create-task"),
        variant: "destructive",
      });
    },
  });

  //useEffect(() => {
  //  console.log("Updated AI input:", AIInput);
  //}, [AIInput]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTask();
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder={t("task-title")}
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <Button
            type="button"
            onClick={handleGenerateClick}
            className="flex items-center gap-2 font-semibold h-10 px-4 text-white rounded w-full sm:w-auto"
            disabled={title.split(" ").length < 3 || isPending}
          >
            <GearIcon className="w-5 h-5" />
            <T keyName="generate" />
          </Button>

          <Textarea
            placeholder={t("task-description")}
            value={description}
            // Prevent user input in Textarea
            readOnly
            className="mt-4 w-full h-28 px-4 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:border-blue-500"
          />

          <Button
            type="submit"
            className="font-semibold h-10 px-4 text-white rounded w-full sm:w-auto"
            disabled={title.split(" ").length < 3 || isPending}
          >
            <T keyName="submit" />
          </Button>
        </form>
      </div>
    </div>
  );
};
