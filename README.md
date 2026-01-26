# Raj pharma - Medical Store Management System

A modern, full-stack medical store website with database integration. Built with Node.js, Express, MongoDB, and vanilla JavaScript with a premium glassmorphism UI design.

![Raj pharma](https://img.shields.io/badge/Status-Complete-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### Customer Features
- 🏠 **Modern Homepage** - Beautiful hero section with featured medicines
- 🛍️ **Medicine Catalog** - Browse medicines with category filtering and search
- 🛒 **Shopping Cart** - Add items, adjust quantities, and manage your cart
- 💳 **Checkout System** - Complete order placement with customer details
- 💰 **Payment Gateway** - Integrated Razorpay for online payments (Cards, UPI, Net Banking, Wallets)
- 📱 **Responsive Design** - Works seamlessly on all devices

### Admin Features
- 🔐 **Secure Login** - Admin authentication system
- 📊 **Dashboard** - View statistics (total medicines, orders, revenue)
- 💊 **Medicine Management** - Full CRUD operations for medicines
- 📦 **Order Management** - View and update order statuses
- 🎨 **Premium UI** - Glassmorphism design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- **MongoDB Atlas account** (free, no installation needed) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Set Up MongoDB Atlas (Cloud Database - Recommended)**

**No MongoDB installation needed!** Follow these quick steps:

a. Create free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)  
b. Create a free M0 cluster (512MB free forever)  
c. Create database user and get connection string  
d. Update `backend/.env` with your Atlas connection string

**📖 Detailed Guide**: See [MONGODB_ATLAS_SETUP.md](file:///c:/Users/Kushagra%20Saxena/Desktop/Doctor/MONGODB_ATLAS_SETUP.md) for step-by-step instructions with screenshots.

**Alternative - Local MongoDB** (if you prefer):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```
Then use: `MONGO_URI=mongodb://localhost:27017/medical_store` in `.env`

3. **Configure Environment Variables**

The `backend/.env` file has been created with a template. You need to add your MongoDB Atlas connection string:

**Get Your Atlas Connection String:**
1. Login to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace the `MONGO_URI` in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medical_store?retryWrites=true&w=majority
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Important**: Replace `username` and `password` with your actual Atlas credentials!

4. **Seed the Database** (Optional but recommended)
```bash
npm run seed
```

This will populate the database with 12 sample medicines.

5. **Start the Backend Server**
```bash
npm start
```

The server will run on `http://localhost:5000`

6. **Open the Frontend**

Simply open `index.html` in your web browser, or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000
```

Then visit `http://localhost:8000`

## 📁 Project Structure

```
Doctor/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── Medicine.js        # Medicine schema
│   │   ├── Order.js           # Order schema
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── medicines.js       # Medicine API routes
│   │   ├── orders.js          # Order API routes
│   │   └── auth.js            # Authentication routes
│   ├── middleware/
│   │   └── auth.js            # Auth middleware
│   ├── server.js              # Express server
│   ├── seed.js                # Database seeding script
│   ├── package.json
│   └── .env                   # Environment variables
├── styles/
│   └── main.css               # Design system & styles
├── js/
│   ├── api.js                 # API client
│   └── main.js                # Cart management & utilities
├── index.html                 # Homepage
├── shop.html                  # Medicine catalog
├── cart.html                  # Shopping cart & checkout
├── admin.html                 # Admin dashboard
└── README.md
```

## 🔌 API Endpoints

### Medicines
- `GET /api/medicines` - Get all medicines (with optional category/search filters)
- `GET /api/medicines/:id` - Get single medicine
- `POST /api/medicines` - Create medicine (admin only)
- `PUT /api/medicines/:id` - Update medicine (admin only)
- `DELETE /api/medicines/:id` - Delete medicine (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin only)

### Authentication
- `POST /api/auth/login` - Admin login

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Gradient Accents** - Vibrant color gradients
- **Smooth Animations** - Micro-interactions and transitions
- **Dark Theme** - Professional medical theme
- **Responsive Layout** - Mobile-first design
- **Custom Typography** - Inter font family

## 👨‍💼 Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

You can change these in the `backend/.env` file.

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with custom properties
- **Vanilla JavaScript** - Functionality
- **LocalStorage** - Cart persistence

## 📝 Usage Guide

### For Customers

1. **Browse Medicines**: Visit the homepage or shop page
2. **Search & Filter**: Use category filters or search by name
3. **Add to Cart**: Click "Add to Cart" on any medicine
4. **Checkout**: Go to cart, review items, and place order
5. **Order Confirmation**: Receive order ID upon successful placement

### For Administrators

1. **Login**: Go to Admin page and login with credentials
2. **View Dashboard**: See statistics and metrics
3. **Manage Medicines**: 
   - Add new medicines with the "+ Add Medicine" button
   - Edit existing medicines by clicking "Edit"
   - Delete medicines with the "Delete" button
4. **Manage Orders**:
   - View all customer orders
   - Update order status (Pending → Processing → Shipped → Delivered)
   - View order details

## 🔒 Security Notes

- Admin authentication uses Basic Auth (suitable for development)
- For production, implement JWT tokens or OAuth
- Add HTTPS encryption
- Implement rate limiting
- Add input validation and sanitization
- Use environment variables for sensitive data

## 🚧 Future Enhancements

- User registration and login for customers
- Order tracking for customers
- Payment gateway integration (Stripe, Razorpay)
- Email notifications
- Invoice generation
- Advanced analytics dashboard
- Product reviews and ratings
- Prescription upload for Rx medicines
- Multi-image support for products

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Support

For issues or questions, please check:
1. MongoDB is running
2. Backend server is started (`npm start` in backend folder)
3. `.env` file is properly configured
4. All dependencies are installed

## 🎉 Credits

Built with ❤️ by Kushagra using modern web technologies. (Contact: 6394109197)
