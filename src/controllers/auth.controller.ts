import { Request, Response } from "express";
import { z } from "zod";
import { createUser, getUserByEmail } from "../services/user";
import { generateOPT, validateOPT } from "../services/otp";
import { sendTestEmail } from "../lib/mailtrap";
import { createJWT } from "../lib/jwt";

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

export const signup = async (request: Request, response: Response) => {
  const authSignUpSchema = z.object({
    name: z.string({ message: "Campo nome é obrigatório" }),
    email: z
      .string({ message: "Campo email é obrigatório" })
      .email("Email inválido"),
  });
  const data = authSignUpSchema.safeParse(request.body);
  if (!data.success) {
    return response.json({ error: data.error.flatten().fieldErrors });
  }
  const user = await getUserByEmail(data.data.email);
  if (user) {
    return response.json({ error: "Usuário já existe." });
  }
  const newUser = await createUser(data.data.name, data.data.email);
  response.status(201).json({ user: newUser });
};

export const useOpt = async (request: Request, response: Response) => {
  const authUseOptSchema = z.object({
    id: z.string({ message: "Id do OPT obrigatório" }),
    code: z.string().length(6, "código precisa de 6 numero"),
  });

  const data = authUseOptSchema.safeParse(request.body);
  if (!data.success) {
    return response.json({ error: data.error.flatten().fieldErrors });
  }

  const user = await validateOPT(data.data.id, data.data.code);
  if (!user) {
    return response.json({ error: "OPT invalido ou expirado" });
  }

  const token = createJWT(user.id);

  return response.json({ message: token, user });
};
