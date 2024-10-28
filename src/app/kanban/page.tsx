import { AddTask } from "@/components/add-task";
import { Board } from "@/components/board";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const dbUser = await db.user.findUnique({
    where: { email: session.user?.email || "" },
    select: { id: true },
  });

  if (!dbUser) redirect("/register");

  const userId = dbUser.id;

  return (
    <>
      <AddTask userId={userId} />
      <Board userId={userId} />
    </>
  );
}
