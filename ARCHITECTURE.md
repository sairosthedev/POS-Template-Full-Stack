# Miccs POS System

## Technical Architecture Documentation

**System Name:** Miccs POS  
**Platform:** Android POS + Web Back Office  
**Company:** Miccs Technologies  
**Author:** Macdonald Sairos  

---

# 1. System Overview

Miccs POS is a **cloud-based Point of Sale system** designed for retail businesses.
The system allows businesses to manage **sales, inventory, products, and reports** through a **mobile POS application and a web-based back-office dashboard**.

The POS application will run on:
* Android smartphones
* **Sunmi V2 Pro POS devices**

The back-office system will allow administrators to manage:
* Products
* Inventory
* Sales
* Reports
* Users
* Branches

---

# 2. System Architecture

The system follows a **three-layer architecture**.

```
Mobile POS (React Native)
        │
        │ REST API
        │
Node.js + Express Backend
        │
        │
     MongoDB
        │
React Back Office Dashboard
```

### Architecture Description

| Layer | Technology | Purpose |
| --- | --- | --- |
| Presentation Layer | React / React Native | User interfaces |
| Application Layer | Node.js / Express | Business logic |
| Data Layer | MongoDB | Data storage |

---

# 3. Technology Stack

## Backend

```
Node.js
Express.js
MongoDB
Mongoose ODM
JWT Authentication
Redis (optional caching)
```

### Purpose
* API services
* Authentication
* Inventory management
* Sales processing
* Data synchronization

---

## Back Office Web Application

```
React
Vite
TailwindCSS
Axios
Chart.js / Recharts
```

### Features
* Dashboard
* Product management
* Inventory management
* Sales analytics
* Staff management
* Branch management

---

## Mobile POS Application

```
React Native
Redux Toolkit / Zustand
SQLite (offline storage)
Axios
Sunmi Printer SDK
React Native Camera
```

### Supported Devices
* Android Phones
* Sunmi V2 Pro POS
* Android POS devices

---

# 4. Key System Features

## POS Mobile Application
Features:
* Barcode scanning
* Product search
* Cart management
* Multiple payment methods
* Receipt printing
* Offline sales
* Sync when internet returns

---

## Back Office Dashboard
Features:
* Product creation
* Inventory tracking
* Sales reports
* Employee management
* Branch management
* Data export

---

# 5. Offline Mode Architecture

Offline support is critical for POS systems.

### Mobile Database
```
SQLite
```

### Offline Flow
```
Sale created
↓
Stored in SQLite
↓
Internet restored
↓
Synced to backend API
```

---

# 6. Database Design

## Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "hashed_string",
  "role": "string",
  "branchId": "ObjectId"
}
```

## Products Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "barcode": "string",
  "category": "string",
  "price": "number",
  "cost": "number",
  "stock": "number",
  "unit": "string"
}
```

## Sales Collection
```json
{
  "_id": "ObjectId",
  "cashierId": "ObjectId",
  "branchId": "ObjectId",
  "total": "number",
  "paymentMethod": "string",
  "createdAt": "Date"
}
```

## SaleItems Collection
```json
{
  "saleId": "ObjectId",
  "productId": "ObjectId",
  "quantity": "number",
  "price": "number"
}
```

## Inventory Collection
```json
{
  "productId": "ObjectId",
  "branchId": "ObjectId",
  "quantity": "number"
}
```

---

# 7. API Design

### Authentication
```http
POST /api/auth/login
POST /api/auth/register
```

### Products
```http
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Sales
```http
POST /api/sales
GET /api/sales
GET /api/sales/:id
```

### Inventory
```http
GET /api/inventory
POST /api/inventory/update
```

---

# 8. Receipt Printing (Sunmi)

The POS will integrate with the **Sunmi Printer SDK**.

### Example Receipt
```
MICCS STORE
Harare

Bread       $1
Milk        $2

TOTAL       $3

Thank you
```

### React Native Bridge
Sunmi printer functions will be exposed through a **native module bridge**.

Functions:
```javascript
printText()
printColumnsText()
cutPaper()
```

---

# 9. Security Architecture

Security mechanisms include:
* JWT authentication
* Password hashing (bcrypt)
* HTTPS encryption
* Role-based access control

User roles:
```
Admin
Manager
Cashier
```

---

# 10. Deployment Architecture

### Backend Deployment
```
Docker
Nginx
Node.js
Ubuntu Server
```

Cloud providers:
* AWS
* DigitalOcean
* Hetzner

### Database Hosting
```
MongoDB Atlas
```
or
```
Self-hosted MongoDB
```

---

# 11. Data Synchronization

POS devices sync data with the server using background tasks.

### Sync Flow
```
POS device records sale
↓
Local SQLite storage
↓
Sync service detects internet
↓
POST /api/sales
↓
Backend updates inventory
```

---

# 12. Future Enhancements

Potential upgrades:
* EcoCash payment integration
* ZIMRA fiscal device support
* Supplier management
* Purchase orders
* AI sales forecasting
* WhatsApp receipts

---

# 13. System Diagram

```
                 React Back Office
                       │
                       │
                 REST API
                       │
               Node.js Backend
                       │
                    MongoDB
                       │
             ┌─────────┴─────────┐
             │                   │
       POS Mobile App      Admin Dashboard
        (React Native)        (React)
             │
        Sunmi Printer
```

---

# 14. Development Roadmap

### Phase 1
Core POS
* product management
* sales
* receipts
* authentication

### Phase 2
Back office
* dashboard
* inventory
* reports

### Phase 3
Advanced features
* offline sync
* analytics
* integrations

---

# Conclusion

The proposed architecture using **MERN for backend/back office and React Native for the POS application** provides:
* scalability
* cross-platform development
* modern UI capabilities
* support for Android POS hardware

This architecture is suitable for building a **commercial POS system capable of serving retail businesses across Zimbabwe and beyond**.
