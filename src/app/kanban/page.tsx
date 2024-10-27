import { AddTask } from "@/components/add-task";
import { Board } from "@/components/board";

export default async function Page() {
  return (
    <>
      <AddTask />
      <Board />
    </>
  );
}
