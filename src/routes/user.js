import express from "express";
import {
  CREATE_USER,
  ACCESS,
  LIST_USERS,
  LOOK_UP_USER_BY_ID,
  REFRESH_JWT_TOKEN,
//   LOOK_UP_USER_WITH_TICKETS,
} from "../controllers/user.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/users", CREATE_USER);
router.post("/users/access", ACCESS);
router.get("/users", auth, LIST_USERS);
router.get("/users/:id", auth, LOOK_UP_USER_BY_ID);
router.post("/jwt/", REFRESH_JWT_TOKEN);
// router.get("/users/aggreg/:id", LOOK_UP_USER_WITH_TICKETS )

export default router;
