import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const extractReportData = async (text) => {
  if (!genAI) {
    // Mock for demo mode if no API key
    return {
      isEmergency: true,
      incidentType: "Flood",
      location: "Mock Location",
      landmark: "Mock Landmark",
      peopleAffected: 5,
      vulnerablePeople: ["elderly"],
      resourcesNeeded: ["rescue"],
      urgency: "HIGH",
      confidence: 0.8,
      verificationStatus: "Unverified"
    };
  }

  const prompt = `
    Analyze the following emergency report and extract structured information.
    Return ONLY a valid JSON object with the following fields:
    - isEmergency (boolean)
    - incidentType (string, e.g., Flood, Fire, Medical)
    - location (string)
    - landmark (string, e.g., 'Velachery MRTS')
    - peopleAffected (number, default to 0 if unknown)
    - vulnerablePeople (array of strings)
    - resourcesNeeded (array of strings)
    - urgency (string: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    - confidence (number between 0 and 1 indicating how confident you are in the extraction)
    - verificationStatus (string, return "Unverified")

    Report: "${text}"
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    // Clean potential markdown blocks
    let responseText = result.response.text();
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json\n/g, '').replace(/```/g, '');
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI extraction error:", error);
    throw error;
  }
};

export const evaluateIncidentMatch = async (newReportData, existingIncidents) => {
  if (!genAI || existingIncidents.length === 0) return null;

  const prompt = `
    A new emergency report came in: ${JSON.stringify(newReportData)}.
    Here are the currently active incidents: ${JSON.stringify(existingIncidents)}.
    Does this new report describe an UPDATE to one of these existing incidents, or is it a completely NEW incident?
    Consider location similarity, landmark, time, and incident type. 'Velachery MRTS' and 'Same place' should match.
    Return ONLY a JSON object with:
    - isMatch (boolean)
    - matchedIncidentId (string, the ID of the matched incident, or null if false)
    - matchReason (string, brief explanation)
    - confidence (number 0 to 1)
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    let responseText = result.response.text();
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json\n/g, '').replace(/```/g, '');
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI match error:", error);
    return { isMatch: false };
  }
};
