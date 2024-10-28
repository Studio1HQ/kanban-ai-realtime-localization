import { db } from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const passedEmail = url.searchParams.get("email") || "";
    const userId = url.searchParams.get("userId");

    if (!userId || session.user?.email !== passedEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userWithBoardsAndTasks = await db.user.findUnique({
      where: { email: passedEmail, id: userId },
      select: {
        id: true,
        password: false,
        tasks: true,
      },
    });

    if (!userWithBoardsAndTasks) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userWithBoardsAndTasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
