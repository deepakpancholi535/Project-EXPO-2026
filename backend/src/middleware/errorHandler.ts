import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // eslint-disable-next-line no-console
  console.error(error);
  res.status(500).json({
    message: "Something went wrong",
    error: error.message
  });
};
