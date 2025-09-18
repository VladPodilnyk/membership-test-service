import express, { Request, Response } from "express"
import * as membershipService from "../services/membership.service"

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
  const rows = membershipService.getAll();
  res.status(200).json(rows);
})

router.post("/", (req: Request, res: Response) => {
  const result = membershipService.newMembership(req.body);
  switch (result.kind) {
    case "success":
      res.status(201).json(result.data);
      break;
    case "failure":
      res.status(400).json({ message: result.message });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
  }
})

export default router;
