# Expense Tracker

A modern, feature-rich expense tracking application built with React, TypeScript, and Tailwind CSS. Track your expenses, visualize spending patterns, and manage your finances with ease.

## Features

- **Dashboard Analytics**: Comprehensive overview of your spending with summary cards showing total expenses, average spending, and transaction counts
- **Visual Charts**: Interactive charts displaying spending by category and payment method
- **Spending Trends**: Track your spending patterns over time with detailed trend analysis
- **Advanced Filtering**: Filter expenses by category, payment method, and date range
- **Responsive Design**: Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Built-in theme toggle for comfortable viewing in any lighting condition
- **Expense Management**: Add, edit, and delete expenses with a user-friendly interface
- **Google Sheets Integration**: Connect to Google Sheets to sync and manage your expense data
- **Mock Data**: Includes 150 sample expenses for demo purposes when not connected to a sheet

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Manoo07/Expense-Tracker.git
cd expense-tracker-dev
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Date Management**: date-fns
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Notifications**: Sonner

## Project Structure

```
expense-tracker-dev/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Dashboard/       # Dashboard-specific components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and helpers
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── public/                 # Static assets
└── ...config files
```

## Key Components

- **Dashboard**: Main expense tracking interface with filtering and analytics
- **ExpenseTable**: Data table with sorting and management capabilities
- **Charts**: Category distribution, payment method breakdown, and spending trends
- **FilterPanel**: Advanced filtering options for expenses
- **SheetConnector**: Google Sheets integration component
- **ThemeToggle**: Dark/light mode switcher

## Google Sheets Integration

The app supports connecting to Google Sheets to store and sync your expense data. Use the Sheet Connector component to:
- Connect to your Google Sheet
- Automatically sync expenses
- Refresh data on demand
- Disconnect when needed

## Expense Categories

- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Travel
- Education
- Other

## Payment Methods

- Cash
- Credit Card
- Debit Card
- UPI
- Net Banking
- Other

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Manoo07**
- GitHub: [@Manoo07](https://github.com/Manoo07)

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

