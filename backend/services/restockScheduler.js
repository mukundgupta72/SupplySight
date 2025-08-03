// services/restockScheduler.js
import cron from 'node-cron';
import moment from 'moment';
import Store from '../models/Store.js';
import { checkInventoryThresholds } from '../utils/thresholdChecker.js';

class RestockScheduler {
  constructor() {
    this.task = null;
    this.isRunning = false;
    this.lastRunTime = null;
    this.io = null; // To hold the socket.io instance
  }

  // Accept the io instance from server.js
  init(io) {
    this.io = io;
    console.log('🚀 Restock Engine Initialized');
    this.startScheduler();
  }

  startScheduler() {
    // FIX: Changed cron schedule to run every 10 minutes
    this.task = cron.schedule('* * * * *', async () => {
      console.log(`\n🔄 [${moment().format('YYYY-MM-DD HH:mm:ss')}] Starting 10-minute restock check...`);
      await this.performRestockCheck();
    });
    console.log('⏰ Cron job scheduled to run every 5 minutes.');
  }

  async performRestockCheck() {
    if (this.isRunning) {
      console.warn('⚠️ Restock check already in progress. Skipping.');
      return;
    }
    this.isRunning = true;
    this.lastRunTime = moment().toISOString();
    try {
      const stores = await Store.find().populate('owner'); 
      if (!stores.length) {
        return;
      }
      
      for (const store of stores) {
        const lowStockItems = await checkInventoryThresholds(store);

        if (lowStockItems.length > 0 && this.io) {
          for (const item of lowStockItems) {
            const notificationPayload = {
              storeName: store.name,
              sku: item.sku,
              currentStock: item.currentStock,
              threshold: item.threshold,
              priority: item.priority,
              timestamp: new Date().toISOString(),
              storeId: store._id,
              ownerId: store.owner._id
            };
            
            // Send notification only to the specific store owner
            this.io.to(`owner_${store.owner._id}`).emit('restock_notification', notificationPayload);
            console.log(`🔔 Sent notification for ${item.sku} at ${store.name} to owner ${store.owner._id}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error during restock check:', error.message);
    } finally {
      this.isRunning = false;
    }
  }
}

const scheduler = new RestockScheduler();
export default scheduler;