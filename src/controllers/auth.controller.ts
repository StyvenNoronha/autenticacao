import { Request, Response } from "express";
import { z } from "zod";
import { getUserByEmail } from "../services/user";
import { generateOPT } from "../services/otp";
import { sendTestEmail } from "../lib/mailtrap";

export const auth = async (request: Request, response: Response) => {
  const authSignInSchema = z.object({
    email: z
      .string({ message: "campo email é obrigatório" })
      .email("E=mail invalido"),
  });

  const data = authSignInSchema.safeParse(request.body);
  if (!data.success) {
    return response.json({ error: data.error.flatten().fieldErrors });
  }

  const user = await getUserByEmail(data.data.email);
  if (!user) {
    return response.json({ error: "Usuário não existe." });
  }

  const opt = await generateOPT(user.id);

  await sendTestEmail(
    user.email,
    "Seu código de acesso e " + opt.code,
    "Digite seu código: " + opt.code,
  );

  response.json({ message: opt.id });
};
