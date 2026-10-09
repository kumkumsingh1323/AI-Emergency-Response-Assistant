import express from 'express';
import { 
  processIncomingReport, 
  getIncidents, 
  getIncidentById, 
  updateIncidentStatus, 
  getReports,
  mergeIncidents
} from '../controllers/report.controller.js';

const router = express.Router();

router.post('/reports', processIncomingReport);
router.get('/reports', getReports);

router.get('/incidents', getIncidents);
router.get('/incidents/:id', getIncidentById);
router.put('/incidents/:id', updateIncidentStatus);
router.post('/incidents/merge', mergeIncidents);

// Alias endpoints for hackathon requirement
router.post('/incidents/:id/updates', updateIncidentStatus);
router.post('/incidents/:id/confirm', (req, res) => {
  req.body.status = 'Active';
  req.body.verificationStatus = 'Verified';
  updateIncidentStatus(req, res);
});
router.post('/incidents/:id/resolve', (req, res) => {
  req.body.status = 'Resolved';
  updateIncidentStatus(req, res);
});

export default router;
