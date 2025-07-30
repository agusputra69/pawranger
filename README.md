# Pawranger - Pet Care Services Website

A modern, responsive website for Pawranger pet care services, featuring an integrated e-commerce platform for pet food and accessories, booking system, and user authentication.

## 🚀 Features

### Core Services
- **Pet Grooming Services** - Professional grooming with detailed service descriptions
- **Pet Hotel & Boarding** - Safe and comfortable accommodation for pets
- **Veterinary Care** - Health checkups and medical services
- **Pet Training** - Professional training programs

### E-commerce Platform
- **Product Catalog** - Comprehensive pet food and accessories inventory
- **Shopping Cart** - Real-time cart management with quantity controls
- **Manual Payment System** - Bank transfer integration with proof upload
- **Order Tracking** - Complete order history and status tracking
- **Product Filtering** - Advanced search and filter capabilities

### User Management
- **Authentication System** - Secure login/registration
- **User Dashboard** - Personal profile and order management
- **Session Management** - Persistent user sessions

### Responsive Design
- **Mobile-First** - Optimized for all screen sizes
- **Modern UI/UX** - Clean, intuitive interface
- **Smooth Animations** - Enhanced user experience

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pawranger-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── About.jsx              # About section
│   ├── AuthModal.jsx          # Login/Registration modal
│   ├── BookingSystem.jsx      # Service booking system
│   ├── CartModal.jsx          # Shopping cart modal
│   ├── CheckoutPage.jsx       # Payment and checkout
│   ├── Contact.jsx            # Contact information
│   ├── EcommercePage.jsx      # Main shop page
│   ├── Footer.jsx             # Site footer
│   ├── Gallery.jsx            # Image gallery
│   ├── Header.jsx             # Navigation header
│   ├── Hero.jsx               # Landing hero section
│   ├── OrderHistory.jsx       # Order tracking
│   ├── PetFoodLanding.jsx     # Product showcase
│   ├── Services.jsx           # Services overview
│   ├── Shop.jsx               # Shop preview
│   └── UserDashboard.jsx      # User profile dashboard
├── App.jsx                    # Main application component
├── main.jsx                   # Application entry point
└── index.css                  # Global styles
```

## 🎯 Key Components

### Header Navigation
- Responsive navigation with grouped menu items
- User authentication status display
- Shopping cart integration
- Mobile-friendly dropdown menus

### E-commerce Features
- Product catalog with categories and filtering
- Real-time cart management
- Manual payment processing
- Order history and tracking

### Booking System
- Service selection and scheduling
- Customer information collection
- Appointment confirmation

### User Dashboard
- Profile management
- Order history
- Account settings

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Styling

The project uses Tailwind CSS for styling with:
- Custom color palette for brand consistency
- Responsive design utilities
- Component-based styling approach
- Smooth animations and transitions

## 📱 Responsive Design

- **Mobile**: Optimized navigation and layout
- **Tablet**: Balanced grid systems
- **Desktop**: Full-featured interface
- **Large Screens**: Enhanced spacing and typography

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js` with:
- Brand color palette
- Custom font families
- Extended spacing and sizing

### Vite
Optimized build configuration in `vite.config.js` for:
- Fast development server
- Efficient production builds
- Asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and inquiries, please contact the Pawranger team through the website's contact form.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
