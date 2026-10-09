import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Incident from './models/Incident.js';
import Report from './models/Report.js';

dotenv.config();

const seedDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.log("No MONGODB_URI found, skipping seed.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Incident.deleteMany({});
    await Report.deleteMany({});
    console.log('Cleared existing data');

    const incident = new Incident({
      incidentType: "Flood",
      location: "Velachery MRTS, Chennai",
      landmark: "Velachery MRTS",
      coordinates: { lat: 12.9774, lng: 80.2227 },
      peopleAffected: 6,
      vulnerablePeople: ["elderly diabetic person"],
      resourcesNeeded: ["rescue team", "insulin"],
      urgency: "HIGH",
      status: "Active",
      confidence: 0.95,
      verificationStatus: "Unverified",
      updates: [
        { message: "Initial report: 6 people trapped near Velachery MRTS.", source: "System" }
      ]
    });
    
    await incident.save();

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
