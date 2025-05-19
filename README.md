# 🚗 Vehicle Parking Management System - Frontend

## 📝 Overview
A modern, responsive web application for managing vehicle parking operations. Built with React, TypeScript, and TailwindCSS, this frontend provides an intuitive and user-friendly interface for both regular users and administrators.

## 🛠 Tech Stack
- **Framework:** React.js
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Query
- **Form Handling:** React Hook Form
- **UI Components:** Shadcn/ui
- **Build Tool:** Vite
- **Testing:** Vitest

## 🏗 Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── auth/      # Authentication components
│   │   ├── layout/    # Layout components
│   │   ├── vehicles/  # Vehicle management
│   │   ├── parking/   # Parking slot management
│   │   └── ui/        # UI components
│   ├── features/      # Feature-specific components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── types/         # TypeScript types
└── public/            # Static assets
```

## 🚀 Features

### 👥 User Interface
- Modern, responsive design
- Dark/Light mode support
- Accessible components
- Loading states and error handling

### 🔐 Authentication
- Login/Register forms
- Protected routes
- JWT token management
- Role-based access control

### 🚘 Vehicle Management
- Vehicle registration form
- Vehicle listing with search
- Vehicle details view
- Edit/Delete functionality

### 🅿️ Parking Management
- Interactive parking slot map
- Slot availability display
- Slot request interface
- Request status tracking

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancements
- Cross-browser compatibility

### 🔍 Search & Filter
- Real-time search
- Advanced filtering
- Sort functionality
- Pagination controls

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation
1. Clone the repository
```bash
git clone [repository-url]
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Configure your environment variables
```

4. Start the development server
```bash
npm run dev
```

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run linting
npm run lint
```

## 🎨 UI Components

### Layout Components
- `Header` - Navigation and user menu
- `Sidebar` - Navigation menu
- `Footer` - Site information
- `Layout` - Page wrapper

### Feature Components
- `VehicleForm` - Vehicle registration
- `ParkingMap` - Interactive slot map
- `RequestForm` - Slot request creation
- `StatusBadge` - Request status display

### UI Components
- `Button` - Custom button component
- `Input` - Form input fields
- `Modal` - Dialog windows
- `Table` - Data tables
- `Pagination` - Page navigation
- `SearchInput` - Search functionality

## 🧪 Testing
```bash
# Run unit tests
npm run test

# Run component tests
npm run test:components

# Run e2e tests
npm run test:e2e
```

## 📱 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎯 Performance Optimization
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

## 🔒 Security
- XSS protection
- CSRF protection
- Secure HTTP headers
- Input sanitization

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
