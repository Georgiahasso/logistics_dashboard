# Advanced Analytics Features 🚀

Your Logistics Dashboard now includes powerful predictive analytics and optimization capabilities!

---

## 🔮 1. Predict Delivery Delays

**Query:** "Predict delivery delays" or "Predict delay" or "Delivery delay"

### What It Does:

- Analyzes relationships between distance, transit time, and historical delays
- Shows delay probability by distance ranges (0-500, 501-1000, 1001-1500, 1500+ miles)
- Compares average transit times for delayed vs on-time deliveries
- Identifies high-risk shipment patterns

### Example Output:

```
Overall Delay Probability: 28.5%

Delayed shipments average 8.2 transit days vs 4.5 days for
on-time deliveries. Long-distance shipments show higher delay risk.

Chart: Delay rate % by distance range
```

### Required CSV Columns:

- `distance_miles` (or distance, miles, distance_mi, route_distance)
- `transit_days` (or transit_time, delivery_time, days_in_transit, shipping_days)
- `logistics_delay` (or delay, is_delayed, has_delay, delayed)

---

## 🚚 2. Optimize Carrier Selection

**Query:** "Optimize carrier selection" or "Compare carrier performance" or "Best carrier"

### What It Does:

- Calculates efficiency scores for each carrier based on:
  - **Cost Efficiency**: Lower costs score higher
  - **Speed**: Faster transit times score higher
  - **Reliability**: Lower delay rates score higher
- Ranks carriers by overall performance (0-100 scale)
- Shows average costs, transit times, and delay rates per carrier
- Recommends the best carrier based on your data

### Example Output:

```
Recommended Carrier: FedEx

FedEx has the best efficiency score (87.3/100) with avg cost
$1,245.50, 3.2 days transit, and 12.5% delay rate.

Chart: Efficiency scores by carrier (bar chart)
```

### Required CSV Columns:

- `carrier` (or shipping_carrier, transporter, shipping_company, courier)
- `cost` (or shipping_cost, price, amount, expense, charge)
- `transit_days` (or transit_time, delivery_time, days_in_transit)

---

## 🔍 3. Detect Cost Anomalies

**Query:** "Detect cost anomalies" or "Unusual costs" or "Cost anomalies"

### What It Does:

- Uses statistical analysis (Interquartile Range method) to find unusual costs
- Calculates cost per mile per kilogram for normalization
- Identifies potentially overcharged or undercharged shipments
- Flags billing discrepancies for review
- Uses IQR (Q3 - Q1) × 1.5 to determine outliers

### Example Output:

```
Anomalies Detected: 15

Found 15 shipments with unusual costs out of 100 total.
8 potentially overcharged, 7 potentially undercharged.

Chart: Distribution (Overcharged, Undercharged, Normal)
```

### Required CSV Columns:

- `cost` (or shipping_cost, price, amount, expense, charge)
- `weight_kg` (or weight, weight_kilograms, kg, shipment_weight)
- `distance_miles` (or distance, miles, distance_mi, route_distance)

---

## 💰 4. Forecast Shipping Expenses by Route

**Query:** "Forecast shipping expenses" or "Forecast expenses by route" or "Cost by route"

### What It Does:

- Groups shipments by origin-destination pairs
- Calculates total and average costs per route
- Identifies your most expensive routes
- Shows shipment volume per route
- Helps with budget planning and route optimization
- Displays top 8 most expensive routes

### Example Output:

```
Total Route Expenses: $125,450.00

Top routes analyzed. Highest expense route: WH-North → Los Angeles
at $18,234 (12 shipments, avg $1,519.50 each).

Chart: Total costs by route (bar chart)
```

### Required CSV Columns:

- `origin_warehouse` (or origin, warehouse, source, from_warehouse, origin_location)
- `destination` (or dest, destination_location, to, delivery_location)
- `cost` (or shipping_cost, price, amount, expense, charge)

---

## 📊 Classic Analytics (Still Available!)

### 5. Delay Rate Analysis

**Query:** "What is the delay rate?" or "Show delays"

### 6. Shipment Status Distribution

**Query:** "Show shipment status distribution" or "Status distribution"

### 7. Delay Reasons

**Query:** "What are the main delay reasons?" or "Delay reasons"

### 8. Asset Utilization

**Query:** "What is the average asset utilization?" or "Asset utilization"

### 9. Traffic Status Breakdown

**Query:** "Show traffic status breakdown" or "Traffic status"

### 10. Waiting Time Analysis

**Query:** "What is the average waiting time?" or "Waiting time"

### 11. Inventory Analysis

**Query:** "Show inventory levels by asset" or "Inventory levels"

### 12. Temperature Analysis

**Query:** "What is the temperature range?" or "Temperature"

---

## 🎯 Quick Stats Dashboard

When no query is active, you'll see 4 key metrics:

1. **Total Shipments** - Total number of records in your dataset
2. **Avg Shipping Cost** - Average cost across all shipments (or N/A if not available)
3. **Active Delays** - Count of shipments currently delayed
4. **Avg Transit Time** - Average days in transit (or N/A if not available)

---

## 📋 Supported Data Fields (25 total)

The dashboard recognizes these fields with flexible column naming:

### **Core Logistics:**

- timestamp, asset_id, shipment_id, shipment_status, logistics_delay

### **Geographic:**

- latitude, longitude, origin_warehouse, destination

### **Operational:**

- inventory_level, waiting_time, traffic_status, asset_utilization

### **Shipping Details:**

- carrier, shipment_date, delivery_date, transit_days, distance_miles, weight_kg, cost

### **Environmental:**

- temperature, humidity

### **Business Metrics:**

- user_transaction_amount, user_purchase_frequency, demand_forecast, logistics_delay_reason

---

## 💡 Tips for Best Results

### For Delay Prediction:

- Include historical data with varied distances
- Ensure transit_days is accurate
- Mark delays consistently (1 or 0)

### For Carrier Optimization:

- Have data from multiple carriers
- Include complete cost information
- Track delay incidents per carrier

### For Cost Anomaly Detection:

- Ensure accurate weight and distance data
- Review flagged anomalies manually
- Update pricing if systematic issues found

### For Expense Forecasting:

- Include origin and destination for all shipments
- Track costs consistently
- Use for budget planning and route optimization

---

## 🔄 How It Works

1. **Upload your CSV** - Smart mapping handles various column names
2. **Review data status** - See what fields are available
3. **Ask questions** - Natural language queries or use sample questions
4. **Get insights** - Charts, KPIs, and actionable recommendations
5. **Make decisions** - Use insights to optimize your logistics operations

---

## 🎨 Sample Questions to Try

### Predictive Analytics:

- "Predict delivery delays"
- "Optimize carrier selection"
- "Detect cost anomalies"
- "Forecast shipping expenses by route"

### Descriptive Analytics:

- "What is the delay rate?"
- "Show shipment status distribution"
- "What are the main delay reasons?"
- "Compare carrier performance"

### Operational Metrics:

- "What is the average asset utilization?"
- "Show traffic status breakdown"
- "What is the average waiting time?"
- "What is the temperature range?"

---

## 🚀 Getting Started

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Open:** http://localhost:3000

3. **Upload CSV:** Click "Choose CSV File"

4. **Ask questions:** Try the advanced analytics queries!

---

## 📈 Business Value

### **Reduce Costs:**

- Identify overcharges through anomaly detection
- Optimize carrier selection for cost efficiency
- Plan budgets with expense forecasting

### **Improve Delivery Performance:**

- Predict which shipments are at risk
- Reduce delays through carrier optimization
- Monitor traffic and environmental factors

### **Data-Driven Decisions:**

- Clear visualizations of complex data
- Actionable recommendations
- Real-time insights for quick decisions

---

**Your logistics dashboard is now a powerful analytics platform! 🎉**
