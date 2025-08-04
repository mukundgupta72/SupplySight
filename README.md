# SupplySight: Fast-Commerce Inventory Heatmap

## 🚀 Project Overview

SupplySight transforms inventory management for fast-commerce by providing:

- **🗺️ Interactive Demand Heatmaps** - Real-time visualization of demand patterns across pincode zones
- **🤖 Automated Restocking** - Intelligent threshold-based inventory replenishment
- **📊 Predictive Analytics** - AI-powered forecasting for proactive inventory planning
- **📱 Multi-Role Dashboard** - Comprehensive admin and user interfaces
- **⚡ Real-time Updates** - Live inventory tracking with WebSocket integration

---

## 🎯 Key Features

### 🏪 Store & Inventory Management
- **Location-based Inventory**: Track SKU-level stock for each dark store mapped to specific pincodes
- **Real-time Stock Levels**: Live inventory updates with low-stock alerts
- **Multi-store Operations**: Centralized management across multiple store locations

### 🌡️ Demand Visualization
- **Interactive Heatmaps**: Color-coded demand intensity mapping (🔴 High, 🟠 Medium, 🟢 Low)
- **Pincode-wise Analytics**: Zone-specific demand patterns and trends
- **Time-based Filtering**: Analyze demand across different time periods

### 🔄 Smart Restocking
- **Threshold Automation**: Automatic restock triggers when inventory drops below defined levels
- **Business Rules Engine**: Customizable restocking logic per item and location
- **Scheduled Monitoring**: Hourly inventory checks using automated cron jobs

### 📈 Predictive Intelligence
- **Demand Forecasting**: AI-powered prediction of next-day stock requirements
- **Seasonal Analysis**: Account for day-of-week patterns and seasonal trends
- **Proactive Planning**: Prevent stockouts through predictive restocking

### 👥 Multi-Role Access
- **Admin Dashboard**: Complete system oversight with analytics and controls
- **Store Management**: Location-specific inventory operations
- **User Interface**: Customer-facing order and cart management

---

## 🏗️ Technical Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React.js 18.2.0 + Material-UI | Interactive user interface |
| **Backend** | Node.js + Express.js | REST API and business logic |
| **Database** | MongoDB | Store inventory, orders, and analytics data |
| **Real-time** | Socket.IO | Live updates and notifications |
| **Authentication** | JWT + bcryptjs | Secure user authentication |
| **Scheduling** | node-cron | Automated restocking jobs |
| **Charts** | Chart.js + Nivo | Data visualization |

### Project Structure

```
SupplySight/
├── backend/                    # Node.js Express API
│   ├── controllers/           # Route handlers
│   ├── models/               # MongoDB schemas
│   │   ├── Store.js         # Store model
│   │   ├── Item.js          # Inventory items
│   │   ├── Order.js         # Order tracking
│   │   ├── RestockRequest.js # Restock management
│   │   └── DemandPrediction.js # AI forecasting
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   ├── middlewares/         # Custom middleware
│   ├── utils/              # Helper functions
│   └── seeds.js            # Database seeding
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── scenes/         # Page components
│   │   ├── context/        # React context providers
│   │   └── data/          # Static data and utilities
│   └── public/            # Static assets
└── README.md              # Project documentation
```
---

## 📈 Example Use Cases

### Scenario: High Demand Detection
**Location**: Pincode 400092 (Andheri West)  
**Item**: Milk  
**Current Stock**: 7 units  
**Daily Demand**: ~35 units  
**System Action**: 🚨 **ALERT** - "Restock 40 units by 9 AM tomorrow"

### Scenario: Predictive Restocking
**Trigger**: Weekend approaching  
**Prediction**: 150% increase in snack demand  
**System Action**: Automatic restock orders placed 24 hours in advance

---

## 🎨 Dashboard Features

### Admin Dashboard
- **Real-time Heatmap**: Visual demand intensity across service areas
- **Inventory Overview**: Stock levels across all stores
- **Alert Center**: Low-stock warnings and restock notifications
- **Analytics**: Demand trends and forecasting insights

### User Interface
- **Store Locator**: Find nearest stores with item availability
- **Cart Management**: Add items and place orders
- **Order Tracking**: Real-time order status updates

---

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Initialize database with sample data

**Frontend:**
- `npm start` - Start development server (port 5000)
- `npm run build` - Create production build
- `npm test` - Run test suite

### Database Models

The application uses the following MongoDB collections:

- **Stores**: Store locations, pincodes, and inventory
- **Items**: Product catalog with SKU details
- **Orders**: Customer orders and demand tracking
- **RestockRequests**: Automated and manual restock operations
- **Users**: Authentication and user management

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📋 Future Enhancements

### Planned Features
- **🗺️ Leaflet.js Integration**: Advanced mapping capabilities
- **🤖 AI/ML Forecasting**: Prophet/ARIMA time series models
- **📱 Mobile App**: React Native companion app
- **🔄 Advanced Analytics**: Deeper business intelligence
- **🌐 Multi-language Support**: Internationalization

### Integration Opportunities
- **Weather API**: Factor weather into demand predictions
- **Holiday Calendar**: Account for seasonal demand patterns
- **Supply Chain APIs**: Automated vendor integration

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Inspiration**: Modern fast-commerce platforms (Blinkit, Zepto, Instamart)
- **Technology**: Built with industry-standard tools and frameworks
- **Community**: Thanks to all contributors and supporters

---

## 🎯 Resume Highlight

> *"Developed SupplySight, a comprehensive inventory management system for fast-commerce platforms featuring real-time demand heatmaps, automated restocking, and predictive analytics using React.js, Node.js, MongoDB, and Socket.IO, resulting in optimized inventory operations and sub-15 minute delivery capabilities."*

---

**Built with ❤️ for the future of fast-commerce**
