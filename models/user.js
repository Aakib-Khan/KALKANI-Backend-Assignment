import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    pincode: { type: Number, required: true, minlength: 4, maxlength: 6 },
    city: { type: String, required: true },
    state: { type: String, required: true },
    type: { type: String, enum: ['Home', 'Office'], required: true }
  });
  
  const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: Number, required: true, unique: true },
    birthdate: { type: Date },
    addresses: { type: [addressSchema], validate: [arrayMinLength, 1] }
  },
  {
    timestamps:true
  }
  );

  function arrayMinLength(val) {
    return val.length >= 1;
  }
  
  
  export default mongoose.model('User', userSchema);
