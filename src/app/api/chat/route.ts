import { ResponseBodySchema } from "@/lib/validators/message";
import { NextRequest, NextResponse } from "next/server";

import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 15 seconds
export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedFields = ResponseBodySchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    const { messages } = validatedFields.data;

    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user")?.content;

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 },
      );
    }

    const response = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: convertToCoreMessages([
        {
          role: "user",
          content: `Generate a short description for a kanban board task with the title: ${lastUserMessage}.
          Make sure to give the response in plain text and not include any markdown characters.`,
        },
      ]),
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
