# Logistics Intelligence Dashboard

A modern, interactive dashboard for logistics data analysis with natural language querying capabilities.

## Features

- 📊 **Interactive Visualizations**: Bar charts, pie charts, and KPI cards
- 🔍 **Natural Language Queries**: Ask questions in plain English
- 📦 **Real-time Analytics**: Track shipments, delays, asset utilization, and more
- 🎨 **Modern UI**: Beautiful gradient design with Tailwind CSS
- ⚡ **Fast Performance**: Built with React and Vite

## Project Structure

```
logistics_dashboard/
├── src/
│   ├── components/
│   │   ├── LogisticsDashboard.jsx  # Main dashboard component
│   │   ├── SearchSection.jsx       # Search input and sample questions
│   │   ├── AnswerSection.jsx       # Display query results
│   │   ├── QuickStats.jsx          # Quick statistics cards
│   │   └── ChartRenderer.jsx       # Reusable chart component
│   ├── utils/
│   │   ├── dataGenerator.js        # Sample data generator (replace with CSV loader)
│   │   └── queryAnalyzer.js        # Natural language query processor
│   ├── constants/
│   │   ├── colors.js               # Chart color palette
│   │   └── sampleQuestions.js      # Predefined sample questions
│   ├── App.jsx                     # Root application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── package.json                    # Project dependencies
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── README.md                       # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Add Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Running the Application

Development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Adding Your CSV Data

To integrate your actual CSV data:

1. Install a CSV parser:

```bash
npm install papaparse
```

2. Replace the `generateLogisticsData()` function in `src/utils/dataGenerator.js` with a CSV loader:

```javascript
import Papa from "papaparse";

export const loadLogisticsData = async (csvFile) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};
```

3. Update the component to load your CSV file instead of generating sample data.

## Supported Queries

The dashboard supports the following types of questions:

- **Delay Analysis**: "What is the delay rate?"
- **Status Distribution**: "Show shipment status distribution"
- **Delay Reasons**: "What are the main delay reasons?"
- **Asset Utilization**: "What is the average asset utilization?"
- **Traffic Status**: "Show traffic status breakdown"
- **Waiting Times**: "What is the average waiting time?"
- **Inventory Levels**: "Show inventory levels by asset"
- **Temperature**: "What is the temperature range?"

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Customization

### Adding New Query Types

Edit `src/utils/queryAnalyzer.js` to add new query patterns and their corresponding visualizations.

### Changing Colors

Modify `src/constants/colors.js` to update the chart color palette.

### Adding New Sample Questions

Update `src/constants/sampleQuestions.js` to add more predefined questions.

## License

This project is private and proprietary.
