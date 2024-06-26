import { v4 as uuidv4 } from "uuid";
import TicketModel from "../models/ticket.js";
import UserModel from "../models/user.js";

export const PURCHASE_TICKET = async (req, res) => {
  try {
    const { userId, ...ticketData } = req.body;

    const createdUser = await UserModel.findOne({ id: userId });

    if (!createdUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const ticketPrice = req.body.ticketPrice;
    const walletBalance = createdUser.walletBalance;

    if (walletBalance < ticketPrice) {
      return res.status(400).json({ message: "Not enough money" });
    }

    const ticket = new TicketModel({
      id: uuidv4(),
      userId: req.body.userId,
      title: req.body.title,
      ticketPrice: req.body.ticketPrice,
      boardingLocation: req.body.boardingLocation,
      destinationLocation: req.body.destinationLocation,
      destinationImageUrl: req.body.destinationImageUrl,
    });
    const savedTicket = await ticket.save();

    createdUser.purchasedTickets.push(savedTicket.id);
    createdUser.walletBalance -= ticketPrice;

    await createdUser.save();
    return res
      .status(201)
      .json({ status: "Ticket added successfully", ticket: savedTicket });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to purchase ticket" });
  }
};

export const GET_ALL_TICKETS = async (req, res) => {
  try {
    const createdTickets = await TicketModel.find();

    return res.status(200).json({ createdTickets: createdTickets });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

export const GET_BY_ID = async (req, res) => {
  try {
    const ticket = await TicketModel.findOne({ id: req.params.id });
    return res.status(200).json({ ticket: ticket });
  } catch (err) {
    console.log(err);
  }
};

export const DELETE_BY_ID = async (req, res) => {
  try {
    const ticket = await TicketModel.findOne({ id: req.params.id });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.userId !== req.body.userId) {
      return res.status(401).json({ message: "This ticket does not belong to you" });
    }

    const response = await TicketModel.deleteOne({ id: req.params.id });
    return res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};