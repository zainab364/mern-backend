require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>console.log("Connected To the Database"))
.catch((error) => console.error('Error connecting to MongoDB:', error));


// Define Contact Schema and Model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const Contact = mongoose.model('Contact', contactSchema);

// POST route to save contact form data
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  try {
    // Create a new Contact document
    const newContact = new Contact({ name, email, message });
    // Save the document in MongoDB
    await newContact.save();
     // Send a success response
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Failed to send message', error });
  }
});

// Start the server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
