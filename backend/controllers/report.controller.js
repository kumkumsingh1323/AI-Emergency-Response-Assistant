import Report from '../models/Report.js';
import Incident from '../models/Incident.js';
import { extractReportData, evaluateIncidentMatch } from '../services/ai.service.js';

export const processIncomingReport = async (req, res) => {
  try {
    const { message, source } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // 1. Ingest & Understand: Extract data using AI
    const extractedData = await extractReportData(message);
    
    // Save raw report early
    const report = new Report({
      originalMessage: message,
      source: source || 'Text',
      aiExtractedData: extractedData
    });

    if (!extractedData.isEmergency) {
      await report.save();
      return res.status(200).json({ message: 'Non-emergency report logged', report });
    }

    // 2. Track: Find existing active incidents
    const activeIncidents = await Incident.find({ status: { $ne: 'Resolved' } });
    
    // 3. Match: Check if this report belongs to an existing incident
    const matchResult = await evaluateIncidentMatch(extractedData, activeIncidents);

    let incident;

    if (matchResult?.isMatch && matchResult.matchedIncidentId) {
      // Update existing incident
      incident = await Incident.findById(matchResult.matchedIncidentId);
      if (incident) {
        // Simple logic to increment or update counts
        incident.peopleAffected = Math.max(incident.peopleAffected, extractedData.peopleAffected);
        
        // Merge arrays without duplicates
        incident.vulnerablePeople = [...new Set([...incident.vulnerablePeople, ...(extractedData.vulnerablePeople || [])])];
        incident.resourcesNeeded = [...new Set([...incident.resourcesNeeded, ...(extractedData.resourcesNeeded || [])])];
        
        // Escalate urgency if necessary
        const urgencyLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        if (urgencyLevels.indexOf(extractedData.urgency) > urgencyLevels.indexOf(incident.urgency)) {
          incident.urgency = extractedData.urgency;
        }

        // Auto-escalate if more people affected
        if (incident.peopleAffected > 5 && incident.status === 'Active') {
          incident.status = 'Escalated';
        }

        incident.updates.push({
          message: `AI Update: ${message}`,
          source: 'System'
        });
        incident.sourceReports.push(report._id);
        
        await incident.save();
      }
    }

    // If no match or match failed, create new incident
    if (!incident) {
      incident = new Incident({
        incidentType: extractedData.incidentType,
        location: extractedData.location,
        landmark: extractedData.landmark,
        peopleAffected: extractedData.peopleAffected,
        vulnerablePeople: extractedData.vulnerablePeople,
        resourcesNeeded: extractedData.resourcesNeeded,
        urgency: extractedData.urgency,
        confidence: extractedData.confidence,
        verificationStatus: extractedData.verificationStatus,
        sourceReports: [report._id],
        updates: [{
          message: `Initial report: ${message}`,
          source: 'System'
        }]
      });
      await incident.save();
    }

    // Link report to incident
    report.associatedIncident = incident._id;
    await report.save();

    res.status(201).json({ report, incident, matched: matchResult?.isMatch });

  } catch (error) {
    console.error('Error processing report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ updatedAt: -1 }).populate('sourceReports');
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('sourceReports');
    if (!incident) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
};

export const updateIncidentStatus = async (req, res) => {
  try {
    const { status, verificationStatus, updateMessage } = req.body;
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) return res.status(404).json({ error: 'Not found' });

    if (status) incident.status = status;
    if (verificationStatus) incident.verificationStatus = verificationStatus;
    
    if (updateMessage) {
      incident.updates.push({
        message: updateMessage,
        source: 'Responder'
      });
    }

    await incident.save();
    res.status(200).json(incident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const mergeIncidents = async (req, res) => {
  try {
    const { sourceId, targetId } = req.body;
    const source = await Incident.findById(sourceId);
    const target = await Incident.findById(targetId);

    if (!source || !target) return res.status(404).json({ error: 'Incidents not found' });

    target.peopleAffected += source.peopleAffected;
    target.sourceReports.push(...source.sourceReports);
    target.updates.push({
      message: `Merged with incident ${source._id}`,
      source: 'Responder'
    });
    
    await target.save();
    
    source.status = 'Resolved';
    source.updates.push({
      message: `Merged into incident ${target._id}`,
      source: 'Responder'
    });
    await source.save();

    res.status(200).json({ success: true, target });
  } catch (error) {
    res.status(500).json({ error: 'Failed to merge' });
  }
};
