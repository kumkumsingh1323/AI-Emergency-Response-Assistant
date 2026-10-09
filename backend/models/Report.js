import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  originalMessage: { type: String, required: true },
  source: { type: String, enum: ['Text', 'Audio', 'WhatsApp', 'SMS', 'Social Media'], default: 'Text' },
  aiExtractedData: {
    isEmergency: Boolean,
    incidentType: String,
    location: String,
    landmark: String,
    peopleAffected: Number,
    vulnerablePeople: [String],
    resourcesNeeded: [String],
    urgency: String,
    confidence: Number,
    verificationStatus: String
  },
  associatedIncident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }
}, {
  timestamps: true
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
