import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
  incidentType: { type: String, required: true },
  location: { type: String, required: true },
  landmark: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  peopleAffected: { type: Number, default: 0 },
  vulnerablePeople: [{ type: String }],
  resourcesNeeded: [{ type: String }],
  urgency: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  status: { type: String, enum: ['Active', 'Escalated', 'Rescue in Progress', 'Resolved'], default: 'Active' },
  confidence: { type: Number, min: 0, max: 1 },
  verificationStatus: { type: String, enum: ['Verified', 'Unverified', 'False Alarm'], default: 'Unverified' },
  sourceReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  updates: [{
    message: String,
    timestamp: { type: Date, default: Date.now },
    source: String // e.g., 'AI', 'Responder'
  }]
}, {
  timestamps: true
});

export default mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);
