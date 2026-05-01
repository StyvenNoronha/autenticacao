import { Request, Response } from "express";
import { email, z } from "zod";
import { da } from "zod/v4/locales";
import { getUserByEmail } from "../services/user";

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
  if(!user){
    return response.json({error: "Usuário não existe."})
  }
};
