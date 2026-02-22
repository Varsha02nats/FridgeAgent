import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('fridge.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT,
    added_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
  )
`);

export interface DbItem {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
  added_date?: string;
  expiry_date: string;
  notes?: string;
}

export const inventoryService = {
  getAllItems: () => {
    return db.prepare('SELECT * FROM items ORDER BY expiry_date ASC').all();
  },

  addItem: (item: DbItem) => {
    const stmt = db.prepare(`
      INSERT INTO items (name, quantity, unit, expiry_date, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(item.name, item.quantity, item.unit, item.expiry_date, item.notes || '');
  },

  updateItem: (id: number, item: Partial<DbItem>) => {
    const fields = Object.keys(item).map(key => `${key} = ?`).join(', ');
    const values = Object.values(item);
    const stmt = db.prepare(`UPDATE items SET ${fields}, last_updated = CURRENT_TIMESTAMP WHERE id = ?`);
    return stmt.run(...values, id);
  },

  deleteItem: (id: number) => {
    return db.prepare('DELETE FROM items WHERE id = ?').run(id);
  },

  getItemByName: (name: string) => {
    return db.prepare('SELECT * FROM items WHERE name LIKE ?').get(`%${name}%`);
  },

  consumeItem: (name: string, quantity: number) => {
    const item: any = db.prepare('SELECT * FROM items WHERE name LIKE ?').get(`%${name}%`);
    if (item) {
      const newQty = Math.max(0, item.quantity - quantity);
      return db.prepare('UPDATE items SET quantity = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?').run(newQty, item.id);
    }
    return null;
  },

  deductIngredients: (ingredients: { name: string, amount_used: number, unit: string }[]) => {
    const results: { name: string, remaining: number, unit: string }[] = [];
    
    for (const ingredient of ingredients) {
      const item: any = db.prepare('SELECT * FROM items WHERE name LIKE ?').get(`%${ingredient.name}%`);
      
      if (item) {
        let amountToDeduct = ingredient.amount_used;
        
        // Simple intelligent unit conversion logic
        // Example: if pantry has 'gallons' and recipe uses 'cups'
        const pantryUnit = item.unit.toLowerCase();
        const recipeUnit = ingredient.unit.toLowerCase();
        
        if (pantryUnit === 'gallons' && recipeUnit === 'cups') {
          amountToDeduct = ingredient.amount_used / 16; // 16 cups in a gallon
        } else if (pantryUnit === 'liters' && recipeUnit === 'ml') {
          amountToDeduct = ingredient.amount_used / 1000;
        } else if (pantryUnit === 'kg' && recipeUnit === 'grams') {
          amountToDeduct = ingredient.amount_used / 1000;
        }
        
        const newQty = Math.max(0, item.quantity - amountToDeduct);
        db.prepare('UPDATE items SET quantity = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?').run(newQty, item.id);
        
        results.push({
          name: item.name,
          remaining: Number(newQty.toFixed(2)),
          unit: item.unit
        });
      }
    }
    return results;
  }
};
