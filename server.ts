import express from 'express';
import { createServer as createViteServer } from 'vite';
import { inventoryService } from './src/services/db';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/inventory', (req, res) => {
    try {
      const items = inventoryService.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  app.post('/api/inventory', (req, res) => {
    try {
      const result = inventoryService.addItem(req.body);
      res.json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add item' });
    }
  });

  app.put('/api/inventory/:id', (req, res) => {
    try {
      inventoryService.updateItem(Number(req.params.id), req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update item' });
    }
  });

  app.delete('/api/inventory/:id', (req, res) => {
    try {
      inventoryService.deleteItem(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  app.post('/api/inventory/consume', (req, res) => {
    try {
      const { name, quantity } = req.body;
      inventoryService.consumeItem(name, quantity);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to consume item' });
    }
  });

  app.post('/api/inventory/deduct', (req, res) => {
    try {
      const { ingredients } = req.body;
      const results = inventoryService.deductIngredients(ingredients);
      res.json({ success: true, results });
    } catch (error) {
      res.status(500).json({ error: 'Failed to deduct ingredients' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
