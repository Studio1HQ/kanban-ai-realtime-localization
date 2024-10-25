import { AuthValidator } from "@/lib/validators/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedFields = AuthValidator.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({
        errors: validatedFields.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validatedFields.data;
    console.log("this is the user data", email, password);

    return NextResponse.json({ email, password });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
