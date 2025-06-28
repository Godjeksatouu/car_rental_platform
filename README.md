# 🚗 Car Rental SaaS Platform

A comprehensive, multi-tenant car rental management platform built with modern web technologies. Empower car rental businesses with powerful tools for fleet management, reservations, client management, and automated contract generation.

![Platform Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Car+Rental+SaaS+Platform)

## ✨ Features

### 🏢 **Multi-Tenant Architecture**
- **Agency Management** - Complete business profile and settings management
- **White-Label Branding** - Custom logos, colors, and styling for each agency
- **Isolated Data** - Secure data separation between different agencies
- **Custom Domains** - Each agency gets their own branded website

### 🚙 **Fleet Management**
- **Vehicle Inventory** - Add, edit, and manage your entire fleet
- **Real-time Availability** - Track vehicle status and availability
- **Maintenance Tracking** - Schedule and monitor vehicle maintenance
- **Photo Galleries** - Multiple images per vehicle with management tools
- **Categories & Filtering** - Organize vehicles by type, brand, or custom categories

### 📅 **Advanced Reservation System**
- **Online Booking Calendar** - Interactive calendar with availability checking
- **Conflict Prevention** - Automatic detection of booking conflicts
- **Automated Confirmations** - Email notifications for bookings and updates
- **Special Requests** - Handle customer requirements and preferences
- **Flexible Pricing** - Daily, weekly, and monthly rates

### 👥 **Client Management**
- **Customer Database** - Comprehensive client profiles and history
- **Document Storage** - Store driver licenses, IDs, and other documents
- **Communication Logs** - Track all interactions with customers
- **Rental History** - Complete booking and rental history per client

### 📄 **Contract Generation**
- **Automated Contracts** - Generate professional rental agreements
- **Custom Templates** - Customizable contract templates per agency
- **Digital Signatures** - Electronic signature collection
- **Legal Compliance** - Templates designed for legal requirements
- **Multi-language Support** - Contracts in multiple languages

### 💳 **Payment Processing**
- **Multiple Payment Methods** - Credit cards, PayPal, bank transfers
- **Automated Invoicing** - Generate and send invoices automatically
- **Payment Tracking** - Monitor payment status and history
- **Financial Reporting** - Revenue analytics and financial insights

### 📊 **Analytics & Reporting**
- **Business Intelligence** - Comprehensive dashboard with key metrics
- **Revenue Analytics** - Track income, trends, and profitability
- **Performance Metrics** - Vehicle utilization, booking rates
- **Custom Reports** - Generate detailed reports for any time period
- **Data Export** - Export data in various formats (PDF, Excel, CSV)

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with excellent IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing for single-page application
- **Lucide React** - Beautiful, customizable icons

### **Backend**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe backend development
- **MySQL** - Reliable relational database with ACID compliance
- **JWT Authentication** - Secure token-based authentication
- **Bcrypt** - Password hashing for security

### **Development Tools**
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting for consistent code quality
- **Prettier** - Code formatting for consistent style
- **Git** - Version control with conventional commits

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/car-rental-saas.git
   cd car-rental-saas
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE car_rental_platform;
   
   # Import the schema
   mysql -u root -p car_rental_platform < database/schema.sql
   ```

5. **Configure environment variables**
   ```bash
   # Backend configuration
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials and settings
   ```

6. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev
   
   # Start frontend (from root directory)
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
car-rental-saas/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── CarsManagement.tsx    # Vehicle management interface
│   │   ├── AgencyProfile.tsx     # Agency profile management
│   │   ├── BrandSettings.tsx     # Branding customization
│   │   ├── ContractGenerator.tsx # Contract generation system
│   │   └── ReservationsManagement.tsx # Booking management
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx          # Landing page
│   │   ├── Features.tsx          # Features showcase
│   │   ├── Pricing.tsx           # Pricing plans
│   │   ├── Demo.tsx              # Interactive demo
│   │   ├── OnboardingFlow.tsx    # Agency registration
│   │   └── AgencyDashboard.tsx   # Main dashboard
│   ├── types/                    # TypeScript type definitions
│   └── App.tsx                   # Main application component
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API route handlers
│   │   └── types/                # Backend type definitions
│   └── package.json              # Backend dependencies
├── database/                     # Database schema and migrations
│   ├── schema.sql                # Database structure
│   └── constraints.sql           # Business rules and constraints
└── README.md                     # Project documentation
```

## 🎯 Usage

### For Platform Administrators
1. **Agency Management** - Oversee all registered agencies
2. **System Monitoring** - Monitor platform performance and usage
3. **Support** - Provide assistance to agency users

### For Car Rental Agencies
1. **Setup** - Register and configure your agency profile
2. **Fleet Management** - Add and manage your vehicle inventory
3. **Bookings** - Handle reservations and rental requests
4. **Contracts** - Generate and manage rental agreements
5. **Analytics** - Monitor business performance and revenue

### For Customers
1. **Browse** - View available vehicles and pricing
2. **Book** - Make reservations online
3. **Manage** - View booking history and manage reservations

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=car_rental_platform
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [Wiki](https://github.com/yourusername/car-rental-saas/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/car-rental-saas/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/yourusername/car-rental-saas/discussions)
- **Email**: support@yourplatform.com

## 🗺️ Roadmap

### Version 2.0 (Coming Soon)
- [ ] Mobile app for iOS and Android
- [ ] Advanced analytics with AI insights
- [ ] Integration with popular accounting software
- [ ] Multi-language support for customer interface
- [ ] Advanced pricing rules and dynamic pricing

### Version 2.1
- [ ] Fleet maintenance management
- [ ] Insurance integration
- [ ] GPS tracking integration
- [ ] Customer loyalty programs
- [ ] Advanced reporting and business intelligence

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/car-rental-saas?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/car-rental-saas?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/car-rental-saas)
![GitHub license](https://img.shields.io/github/license/yourusername/car-rental-saas)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful, responsive design
- [Lucide](https://lucide.dev/) - For the amazing icon set
- [Vite](https://vitejs.dev/) - For the fast development experience

---

**Built with ❤️ for the car rental industry**

[Live Demo](https://your-demo-url.com) • [Documentation](https://your-docs-url.com) • [Report Bug](https://github.com/yourusername/car-rental-saas/issues) • [Request Feature](https://github.com/yourusername/car-rental-saas/issues)
