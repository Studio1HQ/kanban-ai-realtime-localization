import { db } from "@/db";
import { CreateTaskSchema } from "@/lib/validators/create-task";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validatedFields = CreateTaskSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { title, description } = validatedFields.data;

    const newTask = await db.task.create({
      data: {
        title,
        ...(description ? { description } : {}),
        userId: params.userId,
        order: 0,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
