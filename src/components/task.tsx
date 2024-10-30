import { Task as TTask } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { format } from "date-fns";

export const Task = ({ task }: { task: TTask }) => {
  const createdDate = format(new Date(task.createdAt), "hh:mm a, dd MMM yyyy");

  return (
    <Card className="w-full max-w-sm my-2 mx-auto">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      {task.description ? (
        <CardContent>
          <Link
            href={`/kanban/${task.id}`}
            className="text-gray-800 text-semibold underline hover:text-gray-900 underline-offset-2"
          >
            View description
          </Link>
        </CardContent>
      ) : null}
      <CardFooter className="text-sm text-gray-500">
        <span className="font-semibold mr-2">Created on:</span> {createdDate}
      </CardFooter>
    </Card>
  );
};
