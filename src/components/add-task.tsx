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
import { TCreateTaskSchema } from "@/lib/validators/create-task";
import { LoaderCircle } from "lucide-react";

export const AddTask = ({ userId }: { userId: string }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const socket = useSocket();

  const { t } = useTranslate();
  const { toast } = useToast();

  const {
    messages,
    handleSubmit: handleAISubmit,
    setInput: setAIInput,
    isLoading: isAILoading,
  } = useChat();

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "assistant",
    )?.content;
    if (lastAssistantMessage && description !== lastAssistantMessage) {
      setDescription(lastAssistantMessage);
    }
  }, [messages, description]);

  const handleGenerateClick = () => {
    setAIInput(title);
    handleAISubmit();
  };

  const { mutate: createTask, isPending } = useMutation({
    mutationFn: async () => {
      const payload: TCreateTaskSchema = {
        title,
        description,
      };
      const { data } = await axios.post(`/api/tasks/${userId}/create`, payload);
      return data as TTask;
    },
    onSuccess: (newTask) => {
      setTitle("");
      setDescription("");

      socket?.emit("task-created", newTask);
    },
    onError: (error) => {
      console.error("ERROR:", error);
      toast({
        title: t("something-went-wrong"),
        description: t("failed-to-create-task"),
        variant: "destructive",
      });
    },
  });

  const isSubmitDisabled = isPending || title.length === 0 || isAILoading;

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTask();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <div className="flex justify-center mt-2">
      <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            autoFocus
            type="text"
            placeholder={t("task-title")}
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 rounded"
          />
          <Button
            type="button"
            onClick={handleGenerateClick}
            className="flex items-center gap-2 font-semibold h-10 px-4 text-white rounded w-full sm:w-auto"
            disabled={title.split(" ").length < 3 || isPending || isAILoading}
          >
            {isAILoading ? (
              <LoaderCircle className="w-5 h-5 text-gray-300 animate-spin" />
            ) : (
              <GearIcon className="w-5 h-5 text-gray-300" />
            )}
            <T keyName="generate" />
          </Button>

          <Textarea
            placeholder={t("task-description")}
            value={description}
            // Prevent user input in Textarea
            readOnly
            className="mt-4 w-full h-28 px-4 py-2 border border-gray-300 rounded resize-none"
          />

          <Button
            type="submit"
            className="font-semibold h-10 px-4 text-white rounded w-full sm:w-auto"
            disabled={isSubmitDisabled}
          >
            {isPending && (
              <LoaderCircle className="w-5 h-5 text-gray-300 animate-spin" />
            )}
            <T keyName="submit" />
          </Button>
        </form>
      </div>
    </div>
  );
};
