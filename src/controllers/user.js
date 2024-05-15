import { v4 as uuidv4 } from "uuid";
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import TicketModel from "../models/ticket.js";

export const CREATE_USER = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new UserModel({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: hash,
      purchasedTickets: [],
      walletBalance: req.body.walletBalance,
    });

    const createdUser = await newUser.save();

    const jwt_token = jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const jwt_refresh_token = jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // console.log("Was created");

    return res.status(200).json({
      message: "User was created",
      user: createdUser,
      jwt_token,
      jwt_refresh_token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Check your inputs" });
  }
};

export const ACCESS = async (req, res) => {
  try {
    const createdUser = await UserModel.findOne({
      email: req.body.email,
    });
    if (!createdUser) {
      return res.status(400).json({ message: "check inputs" });
    }
    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      createdUser.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "check inputs" });
    }

    createdUser.isLoggedIn = true;
    createdUser.lastLoginAt = new Date();
    await createdUser.save();

    const jwt_token = jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const jwt_refresh_token = jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res
      .status(200)
      .json({ jwt_token: jwt_token, jwt_refresh_token: jwt_refresh_token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error appeared" });
  }
};

export const REFRESH_JWT_TOKEN = async (req, res) => {
  const { jwt_refresh_token } = req.body;
  if (!jwt_refresh_token) {
    return res.status(400).json({ message: "Check JWT-refresh token" });
  }
  try {
    const decoded = jwt.verify(jwt_refresh_token, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const createdUser = await UserModel.findOne({ id: decoded.userId });
    if (!createdUser) {
      return res.status(400).json({ message: "There are no such user" });
    }
    const newJwtToked = jwt.sign(
      { userId: createdUser.id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return res.status(200).json({ jwt_token: newJwtToked, jwt_refresh_token });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Invalid or expired JWT-refresh token"});
  }
};


export const LIST_USERS = async (req, res) => {
  try {
    const createdUsers = await UserModel.find().sort({
      name: 1,
    });
    // if (!createdUsers || createdUsers.length === 0) {
    //   return res.status(404).json({ message: "No users found" });
    // }
    return res.status(200).json({ createdUsers: createdUsers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error appeared" });
  }
};


export const LOOK_UP_USER_BY_ID = async (req, res) => {
  try {
    const createdUser = await UserModel.findOne({ id: req.params.id });
    if (!createdUser) {
      return res.status(404).json({ message: "Could not find such user" });
    }
    return res.status(200).json({ createdUser: createdUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error appeared" });
  }
};


// export const LOOK_UP_USER_WITH_TICKETS = async (req, res) => {
//   const userId = req.params.userId; 
//   try {
//     const userWithTickets = await UserModel.aggregate([
//       { $match: { _id: mongoose.Types.ObjectId(userId) } }, 
//       {
//         $lookup: {
//           from: 'tickets', 
//           localField: 'purchasedTickets',
//           foreignField: '_id',
//           as: 'bought_tickets'
//         }
//       }
//     ]);

//     if (!userWithTickets || userWithTickets.length === 0) {
//       return res.status(404).json({ message: 'User not found or has no tickets' });
//     }

//     return res.status(200).json({ user: userWithTickets[0] });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Failed to retrieve user with tickets' });
//   }
// };