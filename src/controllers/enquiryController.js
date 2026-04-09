import Enquiry from '../models/Enquiry.js';
import { sendEmail } from '../config/emailService.js';
import mongoose from 'mongoose';

export const submitEnquiry = async (req, res) => {
  try {
    // Ensure database connection in serverless environment
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 Database not connected, attempting to connect...');
      const connectDB = (await import('../config/db.js')).default;
      await connectDB();
    }

    console.log('📝 Enquiry submission received:', {
      department: req.body.department,
      email: req.body.email,
      timestamp: new Date().toISOString()
    });

    const { department, firstName, lastName, email, phone, companyName, message } = req.body;

    // Validate required fields
    if (!department || !firstName || !lastName || !email || !message) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        required: ['department', 'firstName', 'lastName', 'email', 'message']
      });
    }

    // Create enquiry in database
    console.log('💾 Creating enquiry in database...');
    const enquiry = await Enquiry.create({
      department,
      firstName,
      lastName,
      email,
      phone: phone || '',
      companyName: companyName || '',
      message,
    });
    console.log('✅ Enquiry created successfully:', enquiry._id);

    // Return success immediately to avoid timeout
    res.status(201).json({ success: true, data: enquiry });

    // Send thank you email asynchronously (fire and forget)
    // This prevents email issues from affecting the user experience
    try {
      console.log('📧 Attempting to send thank you email...');
      await sendEmail({
        to: email,
        subject: `Thank you for contacting UpDownLive - ${department}`,
        text: `Hello ${firstName},\n\nThank you for reaching out to us. We have received your message regarding "${department}" and our team will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nUpDownLive Team`,
        html: `
          <h3>Hello ${firstName},</h3>
          <p>Thank you for reaching out to us. We have received your message regarding <strong>${department}</strong> and our team will get back to you shortly.</p>
          <p><strong>Your message:</strong><br/>${message}</p>
          <p>Best regards,<br/>UpDownLive Team</p>
        `
      });
      console.log('✅ Thank you email sent successfully');
    } catch (emailError) {
      console.error('⚠️  Email sending failed (non-critical):', emailError.message);
      // Email failure doesn't affect the enquiry submission
    }
  } catch (error) {
    console.error('❌ Error submitting enquiry:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Server error';
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data provided';
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      errorMessage = 'Database error';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage, 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    // Ensure database connection in serverless environment
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 Database not connected, attempting to connect...');
      const connectDB = (await import('../config/db.js')).default;
      await connectDB();
    }

    console.log('📋 Fetching enquiries from database...');
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${enquiries.length} enquiries`);
    
    res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    console.error('❌ Error fetching enquiries:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Server error';
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data provided';
    } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      errorMessage = 'Database error';
    } else if (error.name === 'MongooseError') {
      errorMessage = 'Database connection error';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage, 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

export const updateEnquiryNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { notice } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { notice },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error updating enquiry notice:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
