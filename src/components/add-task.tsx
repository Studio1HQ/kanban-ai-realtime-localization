"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GearIcon } from "@radix-ui/react-icons";

import { useChat } from "ai/react";

export const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const {
    messages,
    input: AIInput,
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

  useEffect(() => {
    console.log("Updated AI input:", AIInput);
  }, [AIInput]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Task Submitted:", { title, description, AIInput });
    setTitle("");
    setDescription("");
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
            placeholder="Task Title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <Button
            onClick={handleGenerateClick}
            className="flex items-center gap-2 font-semibold h-10 px-4 text-white rounded w-full sm:w-auto"
            disabled={title.split(" ").length < 3}
          >
            <GearIcon className="w-5 h-5" />
            Generate
          </Button>

          <Textarea
            placeholder="Task Description"
            value={description}
            readOnly // Prevent user input in Textarea
            className="mt-4 w-full h-28 px-4 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:border-blue-500"
          />

          <Button
            type="submit"
            className="font-semibold h-10 px-4 text-white rounded w-full sm:w-auto"
            disabled={title.split(" ").length < 3}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};
