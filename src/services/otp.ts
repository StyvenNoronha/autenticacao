import { prisma } from "../lib/prisma";
import { v6 as uuid } from "uuid";
export const generateOPT = async (userId: number) => {
  let optArray: number[] = [];
  for (let i = 0; i < 6; i++) {
    optArray.push(Math.floor(Math.random() * 9));
  }

  let code = optArray.join("");

  let expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 60);

  const opt = await prisma.otp.create({
    data: {
      id: uuid(),
      code,
      userId,
      expiresAt,
    },
  });

  return opt
};
