// utils/thresholdChecker.js
import moment from 'moment';

export const INVENTORY_THRESHOLDS = {
  MILK001: { min: 10, max: 100, reorderPoint: 20 },
  BRD001: { min: 8, max: 80, reorderPoint: 15 },
  EGG001: { min: 6, max: 60, reorderPoint: 12 },
  RICE001: { min: 15, max: 120, reorderPoint: 30 },
  OIL001: { min: 5, max: 50, reorderPoint: 10 },
};

export const PRIORITY_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
};

export async function checkInventoryThresholds(store) {
  const lowStockItems = [];
  if (!store.inventory) return lowStockItems;

  for (const [sku, stockData] of store.inventory.entries()) {
    const threshold = INVENTORY_THRESHOLDS[sku];
    if (!threshold) continue;

    const currentStock = stockData.cur || 0;
    const reorderPoint = threshold.reorderPoint;

    if (currentStock <= reorderPoint) {
      lowStockItems.push({
        sku,
        currentStock,
        threshold: reorderPoint,
        maxCapacity: threshold.max,
        suggestedQuantity: calculateSuggestedQuantity(currentStock, threshold),
        priority: calculatePriority(currentStock, threshold),
        store_id: store._id,
        pincode: store.pincode,
      });
    }
  }
  return lowStockItems;
}

function calculatePriority(currentStock, threshold) {
  const reorderPoint = threshold.reorderPoint;
  if (currentStock <= reorderPoint * 0.5) return PRIORITY_LEVELS.CRITICAL;
  if (currentStock <= reorderPoint * 0.8) return PRIORITY_LEVELS.HIGH;
  return PRIORITY_LEVELS.MEDIUM;
}

function calculateSuggestedQuantity(currentStock, threshold) {
  const targetStock = Math.floor(threshold.max * 0.8);
  let suggested = targetStock - currentStock;
  if (suggested < 10) suggested = 10; // Minimum order
  if (currentStock + suggested > threshold.max) {
    suggested = threshold.max - currentStock;
  }
  return Math.max(0, suggested);
}

function generateRequestId() {
    const timestamp = moment().format('YYYYMMDD-HHmmss');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `RR-${timestamp}-${random}`;
}

export function generateRestockRequest(store, item) {
    return {
      requestId: generateRequestId(),
      store_id: store._id,
      storeName: store.name || `Store ${store._id}`,
      pincode: store.pincode,
      sku: item.sku,
      currentStock: item.currentStock,
      quantity: item.suggestedQuantity,
      priority: item.priority,
      status: 'PENDING',
      requestedAt: moment().toISOString(),
    };
}