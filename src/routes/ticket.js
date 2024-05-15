import express from "express";
import{PURCHASE_TICKET, GET_ALL_TICKETS} from "../controllers/ticket.js"
import auth from "../middlewares/auth.js"

const router = express.Router()

router.post("/tickets", auth, PURCHASE_TICKET)
router.get("/tickets", auth, GET_ALL_TICKETS)

export default router