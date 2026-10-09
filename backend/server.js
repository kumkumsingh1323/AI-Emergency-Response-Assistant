import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import apiRoutes from './routes/api.routes.js';
import Incident from './models/Incident.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const seedMemoryDB = async () => {
  const count = await Incident.countDocuments();
  if (count > 0) return;
  
  console.log("Seeding mock data into memory DB...");
  await Incident.insertMany([
    {
      incidentType: "Flood",
      location: "Velachery MRTS, Chennai",
      landmark: "Station Entrance",
      coordinates: { lat: 12.9774, lng: 80.2227 },
      peopleAffected: 12,
      vulnerablePeople: ["elderly diabetic person", "pregnant woman"],
      resourcesNeeded: ["rescue boats", "insulin"],
      urgency: "CRITICAL",
      status: "Active",
      confidence: 0.98,
      verificationStatus: "Verified",
      updates: [{ message: "Initial distress signal via SMS", source: "System" }]
    },
    {
      incidentType: "Fire",
      location: "T Nagar, Chennai",
      landmark: "Textile Shop, Pondy Bazaar",
      coordinates: { lat: 13.0392, lng: 80.2333 },
      peopleAffected: 45,
      vulnerablePeople: ["children"],
      resourcesNeeded: ["fire engines", "ambulances"],
      urgency: "HIGH",
      status: "Active",
      confidence: 0.95,
      verificationStatus: "Verified",
      updates: [{ message: "Multiple calls received from bystanders", source: "System" }]
    },
    {
      incidentType: "Medical Emergency",
      location: "Adyar, Chennai",
      landmark: "Main Road, Adyar Bridge",
      coordinates: { lat: 13.0033, lng: 80.2555 },
      peopleAffected: 2,
      vulnerablePeople: [],
      resourcesNeeded: ["ambulance"],
      urgency: "MEDIUM",
      status: "Active",
      confidence: 0.85,
      verificationStatus: "Unverified",
      updates: [{ message: "Reported via Twitter", source: "System" }]
    },
    {
      incidentType: "Building Collapse",
      location: "Guindy, Chennai",
      landmark: "Industrial Estate",
      coordinates: { lat: 13.0067, lng: 80.2206 },
      peopleAffected: 5,
      vulnerablePeople: [],
      resourcesNeeded: ["heavy machinery", "search dogs"],
      urgency: "LOW",
      status: "Resolved",
      confidence: 0.99,
      verificationStatus: "Verified",
      updates: [{ message: "Rescue operations completed successfully", source: "System" }]
    }
  ]);
  console.log("Mock data seeded successfully.");
};

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    let isMemory = false;
    
    if (!uri) {
      console.log('No MONGODB_URI. Starting in-memory MongoDB for demo...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      isMemory = true;
    } else {
      console.log('Connecting to MongoDB Atlas...');
    }
    
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');

    // Always seed if DB is empty (works for both Atlas and in-memory)
    await seedMemoryDB();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
