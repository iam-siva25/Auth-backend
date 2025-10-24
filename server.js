require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected')

// 🔑 FIX: Define an array of allowed origins to include localhost
const allowedOrigins = [
    'https://authentication-xi-seven.vercel.app',
    'http://localhost:3000' // <-- ADDED for local development
];

// Configure CORS to check the origin against the allowed list
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) 
        // OR requests from one of the allowed origins.
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // This must remain true to send/receive cookies (for authentication)
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
   .then(()=> console.log('MongoDb successfully connected'))
   .catch(err => console.log('MongoDb connection err', err))

// route registration
app.use('/api/auth', authRoutes);
app.use('/api/data', protectedRoutes)

app.listen(PORT, ()=>{
  console.log(`server running on ${PORT}`);
})