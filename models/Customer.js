
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  memberNumber: Number,
  interests: String

});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
