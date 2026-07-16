import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateRecord } from './validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'records.json');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// Helper function to read records from database file
async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file, returning empty array:", error);
    return [];
  }
}

// Helper function to write records to database file
async function writeDB(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing to database file:", error);
    throw error;
  }
}

// 1. GET /api/records - Get all records with search, filter, and sort
app.get('/api/records', async (req, res) => {
  try {
    const records = await readDB();
    const { status, search } = req.query;
    
    let filteredRecords = [...records];

    // Filter by status
    if (status && status !== 'ALL') {
      filteredRecords = filteredRecords.filter(r => r.status === status);
    }

    // Search by plant name, operator name, or shift type
    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      filteredRecords = filteredRecords.filter(r => 
        r.plantName.toLowerCase().includes(query) ||
        r.operatorName.toLowerCase().includes(query) ||
        r.shiftType.toLowerCase().includes(query)
      );
    }

    // Sort by shiftDate descending, then by id descending (newest first)
    filteredRecords.sort((a, b) => {
      const dateDiff = new Date(b.shiftDate) - new Date(a.shiftDate);
      if (dateDiff !== 0) return dateDiff;
      return b.id - a.id;
    });

    res.json(filteredRecords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// 2. GET /api/records/stats - Get aggregated metrics for dashboard
app.get('/api/records/stats', async (req, res) => {
  try {
    const records = await readDB();
    const stats = {
      total: records.length,
      passed: records.filter(r => r.status === 'PASSED').length,
      flagged: records.filter(r => r.status === 'FLAGGED').length,
      approved: records.filter(r => r.status === 'APPROVED').length,
      rejected: records.filter(r => r.status === 'REJECTED').length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// 3. POST /api/records - Create a new record with auto-validation
app.post('/api/records', async (req, res) => {
  try {
    const records = await readDB();
    const validationResult = validateRecord(req.body);

    if (validationResult.status === 'INVALID') {
      return res.status(400).json({ errors: validationResult.errors });
    }

    const nextId = records.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;

    const newRecord = {
      id: nextId,
      plantName: req.body.plantName.trim(),
      shiftDate: req.body.shiftDate,
      shiftType: req.body.shiftType,
      operatorName: req.body.operatorName.trim(),
      productionVolume: Number(req.body.productionVolume),
      efficiencyRate: Number(req.body.efficiencyRate),
      downtimeHours: Number(req.body.downtimeHours),
      safetyIncidents: Number(req.body.safetyIncidents),
      status: validationResult.status,
      flagReasons: validationResult.flagReasons,
      managerAction: null,
      managerReason: null,
      actionDate: null
    };

    records.push(newRecord);
    await writeDB(records);

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to create plant shift record" });
  }
});

// 4. POST /api/records/:id/action - Manager exception decision (approve/reject)
app.post('/api/records/:id/action', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { action, reason } = req.body;

    if (!action || !['APPROVED', 'REJECTED'].includes(action)) {
      return res.status(400).json({ error: "Action must be either APPROVED or REJECTED." });
    }

    if (!reason || typeof reason !== 'string' || reason.trim() === '') {
      return res.status(400).json({ error: "A valid explanation reason is required." });
    }

    const records = await readDB();
    const recordIndex = records.findIndex(r => r.id === id);

    if (recordIndex === -1) {
      return res.status(404).json({ error: "Shift record not found." });
    }

    const record = records[recordIndex];

    if (record.status !== 'FLAGGED') {
      return res.status(400).json({ error: "Only currently FLAGGED exception records can be resolved." });
    }

    // Apply the manager's resolution
    record.status = action;
    record.managerAction = action;
    record.managerReason = reason.trim();
    record.actionDate = new Date().toISOString();

    records[recordIndex] = record;
    await writeDB(records);

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to update exception record status" });
  }
});

app.listen(PORT, () => {
  console.log(`Exception Dashboard API Server listening on port ${PORT}`);
});
