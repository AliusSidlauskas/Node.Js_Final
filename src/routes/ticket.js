import express from "express";
import { PURCHASE_TICKET, GET_ALL_TICKETS, GET_BY_ID, DELETE_BY_ID } from "../controllers/ticket.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/tickets", auth, PURCHASE_TICKET);
router.get("/tickets", auth, GET_ALL_TICKETS);
router.get("/tickets/:id", auth, GET_BY_ID);
router.delete("/tickets/:id", auth, DELETE_BY_ID);

export default router;