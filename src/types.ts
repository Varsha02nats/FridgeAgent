export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  added_date: string;
  expiry_date: string;
  last_updated: string;
  notes: string;
}

export type ExpiryStatus = 'fresh' | 'expiring' | 'expired';

export interface Alert {
  id: string;
  category: 'expiring' | 'expired' | 'low_stock' | 'inactivity';
  message: string;
  itemId?: number;
  itemName?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
