import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_DIRECTORY, INITIAL_SETTINGS, TOWNS } from './src/data/seedData.ts';
import { DirectoryItem, Inquiry, SiteSettings, AuditLog } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  settings: SiteSettings;
  directory: DirectoryItem[];
  inquiries: Inquiry[];
  auditLogs: AuditLog[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.directory && Array.isArray(parsed.directory) && parsed.directory.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
  }

  // Initial seed
  const initialData: DatabaseSchema = {
    settings: INITIAL_SETTINGS,
    directory: INITIAL_DIRECTORY,
    inquiries: [
      {
        id: 'inq-sample-1',
        name: 'Prof. Ramesh Kumar',
        email: 'ramesh.kumar@edu.sindh.gov.pk',
        phone: '+92 333 1234567',
        subject: 'Inquiry regarding TIEST Engineering Admissions',
        message: 'Could you please confirm the upcoming admissions schedule and merit criteria for student quotas from District Tharparkar?',
        category: 'Education',
        status: 'reviewed',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'inq-sample-2',
        name: 'Fatima Zahra',
        email: 'fatima.travels@gmail.com',
        phone: '+92 300 9876543',
        subject: 'Family Winter Tour to Nagarparkar & Gori Temple',
        message: 'We are planning a 3-day family trip from Karachi in December. Can you provide contact information for certified heritage guides and STDC booking?',
        category: 'Tourism',
        status: 'new',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    auditLogs: [
      {
        id: 'log-init-1',
        action: 'DATABASE_INITIALIZATION',
        performedBy: 'System',
        details: 'Initial verified database seeded with 25+ real Tharparkar institutions, healthcare centers, and destinations.',
        timestamp: new Date().toISOString()
      }
    ]
  };

  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Helper to log audit actions
  const logAudit = (action: string, performedBy: string, details: string, targetId?: string) => {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      performedBy,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(log);
    // Keep max 200 logs
    if (db.auditLogs.length > 200) {
      db.auditLogs = db.auditLogs.slice(0, 200);
    }
  };

  // Static uploads / public assets
  app.use(express.static(path.join(__dirname, 'public')));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (_req, res) => {
    res.json(db.settings);
  });

  app.post('/api/settings', (req, res) => {
    try {
      const updated = { ...db.settings, ...req.body };
      db.settings = updated;
      saveDatabase(db);
      logAudit('SETTINGS_UPDATE', 'Admin', 'Homepage hero text, buttons, or banner updated.');
      res.json({ success: true, settings: db.settings });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Towns list
  app.get('/api/towns', (_req, res) => {
    res.json(TOWNS);
  });

  // Directory Listings (with full search, category, town, verification filter)
  app.get('/api/directory', (req, res) => {
    const { category, subCategory, town, status, search } = req.query;

    let results = [...db.directory];

    if (category && typeof category === 'string' && category !== 'all') {
      results = results.filter((item) => item.category === category);
    }

    if (subCategory && typeof subCategory === 'string' && subCategory !== 'all') {
      results = results.filter((item) => item.subCategory === subCategory);
    }

    if (town && typeof town === 'string' && town !== 'all') {
      results = results.filter(
        (item) => item.town.toLowerCase() === town.toLowerCase()
      );
    }

    if (status && typeof status === 'string' && status !== 'all') {
      results = results.filter((item) => item.verificationStatus === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.town.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          (item.programsOrServices &&
            item.programsOrServices.some((p) => p.toLowerCase().includes(q)))
      );
    }

    res.json(results);
  });

  // Get single directory item
  app.get('/api/directory/:id', (req, res) => {
    const item = db.directory.find((d) => d.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Directory listing not found' });
    }
    res.json(item);
  });

  // Create directory listing (Admin or submission)
  app.post('/api/directory', (req, res) => {
    try {
      const data = req.body;
      if (!data.name || !data.category || !data.town) {
        return res.status(400).json({ error: 'Name, category, and town are required fields.' });
      }

      const newItem: DirectoryItem = {
        id: data.id || `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        category: data.category,
        subCategory: data.subCategory || 'govt_boys_school',
        town: data.town,
        address: data.address || `${data.town}, District Tharparkar`,
        latitude: Number(data.latitude) || 24.7438,
        longitude: Number(data.longitude) || 69.8000,
        phone: data.phone || '',
        email: data.email || '',
        website: data.website || '',
        description: data.description || '',
        programsOrServices: Array.isArray(data.programsOrServices) ? data.programsOrServices : [],
        ownership: data.ownership || 'Government',
        genderType: data.genderType || 'Co-education',
        photos: Array.isArray(data.photos) && data.photos.length > 0 ? data.photos : ['/hero-tharparkar.jpg'],
        verificationStatus: data.verificationStatus || 'verified',
        sourceReference: data.sourceReference || 'Admin Direct Entry',
        lastUpdated: new Date().toISOString().split('T')[0],
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        hours: data.hours || ''
      };

      db.directory.unshift(newItem);
      saveDatabase(db);
      logAudit('CREATE_RECORD', 'Admin', `Added "${newItem.name}" to ${newItem.category} directory.`, newItem.id);

      res.status(201).json({ success: true, item: newItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update directory listing
  app.put('/api/directory/:id', (req, res) => {
    try {
      const index = db.directory.findIndex((d) => d.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Record not found' });
      }

      const existing = db.directory[index];
      const updatedItem: DirectoryItem = {
        ...existing,
        ...req.body,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      db.directory[index] = updatedItem;
      saveDatabase(db);
      logAudit('UPDATE_RECORD', 'Admin', `Updated details for "${updatedItem.name}".`, updatedItem.id);

      res.json({ success: true, item: updatedItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete directory listing
  app.delete('/api/directory/:id', (req, res) => {
    try {
      const index = db.directory.findIndex((d) => d.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Record not found' });
      }

      const removed = db.directory.splice(index, 1)[0];
      saveDatabase(db);
      logAudit('DELETE_RECORD', 'Admin', `Deleted listing "${removed.name}".`, removed.id);

      res.json({ success: true, message: 'Record deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Public submission for citizen suggestions
  app.post('/api/submit', (req, res) => {
    try {
      const { name, category, town, description, contactPhone, address } = req.body;
      if (!name || !category || !town) {
        return res.status(400).json({ error: 'Name, category, and town are required.' });
      }

      const submittedItem: DirectoryItem = {
        id: `submission-${Date.now()}`,
        name,
        category,
        subCategory: 'govt_boys_school',
        town,
        address: address || `${town}, Tharparkar`,
        latitude: 24.7438,
        longitude: 69.8000,
        phone: contactPhone || '',
        description: description || 'Submitted via public portal for verification.',
        photos: ['/hero-tharparkar.jpg'],
        verificationStatus: 'pending',
        sourceReference: `Public Citizen Submission (${new Date().toLocaleDateString()})`,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      db.directory.push(submittedItem);
      saveDatabase(db);
      logAudit('CITIZEN_SUBMISSION', 'Public Citizen', `New pending submission received: "${name}" in ${town}`, submittedItem.id);

      res.status(201).json({
        success: true,
        message: 'Your submission has been received and will be reviewed by the district verification desk.',
        item: submittedItem
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Inquiries / Contact
  app.get('/api/inquiries', (_req, res) => {
    res.json(db.inquiries);
  });

  app.post('/api/inquiries', (req, res) => {
    try {
      const { name, email, phone, subject, message, category } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
      }

      const inquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message,
        category: category || 'General',
        status: 'new',
        createdAt: new Date().toISOString()
      };

      db.inquiries.unshift(inquiry);
      saveDatabase(db);
      logAudit('NEW_INQUIRY', name, `New inquiry: "${subject}" from ${email}`);

      res.status(201).json({ success: true, message: 'Inquiry submitted successfully', inquiry });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/inquiries/:id', (req, res) => {
    try {
      const inq = db.inquiries.find((i) => i.id === req.params.id);
      if (!inq) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      if (req.body.status) {
        inq.status = req.body.status;
      }
      saveDatabase(db);
      logAudit('INQUIRY_STATUS_CHANGE', 'Admin', `Inquiry ${inq.id} marked as ${inq.status}`);
      res.json({ success: true, inquiry: inq });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Dashboard Statistics
  app.get('/api/stats', (_req, res) => {
    const total = db.directory.length;
    const verified = db.directory.filter((d) => d.verificationStatus === 'verified').length;
    const pending = db.directory.filter((d) => d.verificationStatus === 'pending').length;
    const rejected = db.directory.filter((d) => d.verificationStatus === 'rejected').length;

    const byCategory: Record<string, number> = {};
    const byTown: Record<string, number> = {};

    db.directory.forEach((item) => {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
      byTown[item.town] = (byTown[item.town] || 0) + 1;
    });

    res.json({
      total,
      verified,
      pending,
      rejected,
      inquiriesTotal: db.inquiries.length,
      inquiriesNew: db.inquiries.filter((i) => i.status === 'new').length,
      byCategory,
      byTown
    });
  });

  // Audit Logs
  app.get('/api/audit-logs', (_req, res) => {
    res.json(db.auditLogs);
  });

  // Admin Auth (demo credentials with token issuance)
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Authorized credentials for administrative portal
    if (username === 'admin' && (password === 'thar2026!' || password === 'admin123' || password === 'tharparkar')) {
      const token = `token-thar-admin-${Date.now()}`;
      logAudit('ADMIN_LOGIN', 'admin', 'Administrator authenticated successfully.');
      return res.json({
        success: true,
        user: {
          id: 'admin-1',
          username: 'admin',
          name: 'District Portal Administrator',
          role: 'superadmin',
          token
        }
      });
    }

    if (username === 'editor' && password === 'editor2026!') {
      const token = `token-thar-editor-${Date.now()}`;
      logAudit('ADMIN_LOGIN', 'editor', 'Editor authenticated.');
      return res.json({
        success: true,
        user: {
          id: 'editor-1',
          username: 'editor',
          name: 'Content & Verification Editor',
          role: 'editor',
          token
        }
      });
    }

    res.status(401).json({ error: 'Invalid username or password. Use username: admin, password: thar2026!' });
  });

  // CSV Export
  app.get('/api/export/csv', (_req, res) => {
    try {
      const headers = ['id', 'name', 'category', 'subCategory', 'town', 'address', 'latitude', 'longitude', 'phone', 'email', 'website', 'verificationStatus', 'sourceReference', 'lastUpdated'];
      const rows = db.directory.map((item) => [
        `"${item.id}"`,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `"${item.subCategory}"`,
        `"${item.town}"`,
        `"${(item.address || '').replace(/"/g, '""')}"`,
        item.latitude,
        item.longitude,
        `"${item.phone || ''}"`,
        `"${item.email || ''}"`,
        `"${item.website || ''}"`,
        `"${item.verificationStatus}"`,
        `"${(item.sourceReference || '').replace(/"/g, '""')}"`,
        `"${item.lastUpdated}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="tharparkar_directory.csv"');
      res.send(csvContent);
      logAudit('CSV_EXPORT', 'Admin', 'Exported directory records to CSV format.');
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // CSV Import (JSON parsed records)
  app.post('/api/import/csv', (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty items array' });
      }

      let importedCount = 0;
      for (const item of items) {
        if (!item.name || !item.category || !item.town) continue;
        const newItem: DirectoryItem = {
          id: item.id || `import-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: item.name,
          category: item.category,
          subCategory: item.subCategory || 'govt_boys_school',
          town: item.town,
          address: item.address || `${item.town}, Tharparkar`,
          latitude: Number(item.latitude) || 24.7438,
          longitude: Number(item.longitude) || 69.8000,
          phone: item.phone || '',
          email: item.email || '',
          website: item.website || '',
          description: item.description || 'Imported via CSV batch upload',
          photos: ['/hero-tharparkar.jpg'],
          verificationStatus: item.verificationStatus === 'verified' ? 'verified' : 'pending',
          sourceReference: item.sourceReference || 'CSV Batch Import',
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        db.directory.push(newItem);
        importedCount++;
      }

      saveDatabase(db);
      logAudit('CSV_IMPORT', 'Admin', `Successfully imported ${importedCount} records via CSV upload.`);
      res.json({ success: true, count: importedCount, message: `Imported ${importedCount} records.` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite in dev mode, or static build in production
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Tharparkar Portal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
