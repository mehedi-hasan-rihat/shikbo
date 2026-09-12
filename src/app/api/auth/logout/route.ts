import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET(): Promise<never> {
  await deleteSession();
  redirect("/login");
}
