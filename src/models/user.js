import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: {
    type: String,
    required: true,
    match: [/^[A-Z][a-zA-Z]*$/, "Name must start with capital letter "],
  },

  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Check your email address, please. Now"],
  },

  password: {
    type: String,
    required: true,
    match: [
      /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/,
      "In password must be at least 6 characters and contain one number",
    ],
  },
  
  purchasedTickets: { type: Array, required: false },
  walletBalance: { type: Number, required: true },
});

export default mongoose.model("User", userSchema);
