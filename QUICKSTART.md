# Quick Start Guide 🚀

Get your Logistics Dashboard up and running in 3 easy steps!

## Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (React, Recharts, Tailwind CSS, etc.)

## Step 2: Start the Development Server

```bash
npm run dev
```

The dashboard will automatically open in your browser at `http://localhost:3000`

## Step 3: Add Your Data

You have two options:

### Option A: Use the Upload Button (Easiest!) 📤

1. Click the **"Upload CSV"** button in the dashboard
2. Select your CSV file
3. Done! Your data is now loaded

### Option B: Use Sample Data (For Testing) 🧪

The dashboard comes with sample data pre-loaded. Just start asking questions!

---

## What You Can Do

### Ask Questions

Try these sample questions:

- "What is the delay rate?"
- "Show shipment status distribution"
- "What are the main delay reasons?"
- "What is the average asset utilization?"

### View Analytics

The dashboard automatically generates:

- 📊 Interactive charts
- 📈 Key performance indicators (KPIs)
- 🎯 Real-time statistics

---

## Your CSV Data Format

Your CSV should have at least these columns:

- `timestamp` - Date/time of the record
- `asset_id` - Vehicle/asset identifier (e.g., "TRK-1001")
- `shipment_status` - Status like "In Transit", "Delivered", "Delayed"
- `logistics_delay` - 1 for delayed, 0 for on-time

**See `sample_data_template.csv` for a complete example!**

---

## Need More Help?

📖 **Full Documentation:**

- `README.md` - Complete project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PROJECT_STRUCTURE.md` - Code organization guide

🐛 **Troubleshooting:**

**Problem:** Dependencies won't install

```bash
# Try clearing cache
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Server won't start

```bash
# Make sure you're in the project directory
cd logistics_dashboard
npm run dev
```

**Problem:** CSV upload fails

- Check that your CSV has the required columns
- Ensure the file is actually a `.csv` file
- Look at `sample_data_template.csv` for the correct format

---

## That's It! 🎉

You're ready to start analyzing your logistics data. Happy tracking!
