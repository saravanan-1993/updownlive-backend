import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      enum: ['Newsroom', 'Advertise', 'Support'],
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: false,
    },
    companyName: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    notice: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
