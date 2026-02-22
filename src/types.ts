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
  aiMessage?: string;
  suggestions?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface IngredientUsage {
  name: string;
  amount_used: number;
  unit: string;
  pantry_remaining_after?: number;
}

export interface Recipe {
  id?: string;
  name: string;
  cook_time_minutes: number;
  ingredients: IngredientUsage[];
  instructions?: string[];
  isSmartChoice?: boolean;
}
