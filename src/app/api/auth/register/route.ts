import { AuthValidator } from "@/lib/validators/auth";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/db";

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

    const hashedPassword = await hash(password, 12);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
