import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  boardingLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  destinationImageUrl: { type: String, required: true },
});

export default mongoose.model("Ticket", ticketSchema);
