import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { AuthValidator, TAuthValidator } from "@/lib/validators/auth";
import { db } from "@/db";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // These are used in the default sign-in page from next-auth.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const payload: TAuthValidator | null =
          credentials?.email && credentials?.password
            ? {
                email: credentials.email,
                password: credentials.password,
              }
            : null;

        if (!payload) return null;

        const validatedFields = AuthValidator.safeParse(payload);

        if (!validatedFields.success) return null;

        const { email: userInputEmail, password: userInputPassword } =
          validatedFields.data;

        const potentialUser = await db.user.findUnique({
          where: {
            email: userInputEmail,
          },
        });

        if (!potentialUser) return null;

        const isCorrectPassword = await compare(
          userInputPassword,
          potentialUser.password,
        );

        if (!isCorrectPassword) return null;

        //Because getting the error in the IDE: _ is assigned a value but never used.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = potentialUser;

        return userWithoutPassword;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
