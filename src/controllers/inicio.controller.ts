import { Request, Response } from "express";

export const ping = (request: Request, response: Response) => {
  response.json({ message: "servidor ON" });
};

