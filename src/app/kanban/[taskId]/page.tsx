import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslate, T } from "@/tolgee/server";
import { getServerSession } from "next-auth";

export default async function Page({ params }: { params: { taskId: string } }) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const task = await db.task.findUnique({
    where: { id: params.taskId },
  });

  if (!task) redirect("/kanban");

  const t = await getTranslate();

  return (
    <div className="flex items-center justify-center px-4 mt-20">
      <div className="w-full max-w-lg space-y-4">
        <Link
          href={"/kanban"}
          className={buttonVariants({
            variant: "secondary",
            size: "lg",
          })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <T keyName="back" />
        </Link>

        <Card className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {task.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">
              {task.description || t("no-description-provided-for-this-task")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
