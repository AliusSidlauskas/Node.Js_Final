import express from "express";
import{PURCHASE_TICKET} from "../controllers/ticket.js"

const router = express.Router()

router.post("/tickets", PURCHASE_TICKET)

export default router