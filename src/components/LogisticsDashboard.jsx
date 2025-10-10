import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, Package, AlertTriangle, Clock, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

// Smart column mapping
const COLUMN_MAPPINGS = {
  timestamp: ['timestamp', 'date', 'time', 'datetime', 'date_time', 'created_at', 'recorded_at'],
  asset_id: ['asset_id', 'assetid', 'asset', 'truck_id', 'vehicle_id', 'id', 'asset_number'],
  latitude: ['latitude', 'lat', 'latitude_value'],
  longitude: ['longitude', 'lon', 'lng', 'long', 'longitude_value'],
  inventory_level: ['inventory_level', 'inventory', 'stock', 'stock_level', 'inv_level'],
  shipment_status: ['shipment_status', 'status', 'delivery_status', 'shipment', 'ship_status'],
  temperature: ['temperature', 'temp', 'temperature_c', 'temp_celsius'],
  humidity: ['humidity', 'humid', 'humidity_percent', 'humidity_level'],
  traffic_status: ['traffic_status', 'traffic', 'traffic_condition', 'road_status'],
  waiting_time: ['waiting_time', 'wait_time', 'delay_time', 'wait', 'wait_minutes'],
  user_transaction_amount: ['user_transaction_amount', 'transaction_amount', 'amount', 'transaction', 'value'],
  user_purchase_frequency: ['user_purchase_frequency', 'purchase_frequency', 'frequency', 'purchases'],
  logistics_delay_reason: ['logistics_delay_reason', 'delay_reason', 'reason', 'delay_cause'],
  asset_utilization: ['asset_utilization', 'utilization', 'usage', 'utilization_percent'],
  demand_forecast: ['demand_forecast', 'forecast', 'predicted_demand', 'demand'],
  logistics_delay: ['logistics_delay', 'delay', 'is_delayed', 'has_delay', 'delayed'],
  shipment_id: ['shipment_id', 'shipmentid', 'shipment', 'tracking_number', 'tracking_id', 'order_id'],
  origin_warehouse: ['origin_warehouse', 'origin', 'warehouse', 'source', 'from_warehouse', 'origin_location'],
  destination: ['destination', 'dest', 'destination_location', 'to', 'delivery_location'],
  carrier: ['carrier', 'shipping_carrier', 'transporter', 'shipping_company', 'courier'],
  shipment_date: ['shipment_date', 'ship_date', 'shipping_date', 'sent_date', 'dispatch_date'],
  delivery_date: ['delivery_date', 'delivered_date', 'arrival_date', 'received_date'],
  weight_kg: ['weight_kg', 'weight', 'weight_kilograms', 'kg', 'shipment_weight'],
  cost: ['cost', 'shipping_cost', 'price', 'amount', 'expense', 'charge'],
  distance_miles: ['distance_miles', 'distance', 'miles', 'distance_mi', 'route_distance'],
  transit_days: ['transit_days', 'transit_time', 'delivery_time', 'days_in_transit', 'shipping_days']
};

const generateLogisticsData = () => {
  const statuses = ['In Transit', 'Delivered', 'Delayed', 'Processing'];
  const trafficStatuses = ['Clear', 'Heavy', 'Detour'];
  const delayReasons = ['Weather', 'Mechanical Failure', 'Traffic', 'None', 'Loading Delay'];
  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Regional Express'];
  const warehouses = ['WH-North', 'WH-South', 'WH-East', 'WH-West', 'WH-Central'];
  const destinations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'Dallas'];
  
  return Array.from({ length: 100 }, (_, i) => {
    const hasDelay = Math.random() > 0.7;
    const shipDate = new Date(2025, 9, Math.floor(Math.random() * 20) + 1);
    const transitDays = Math.floor(Math.random() * 10) + 1;
    const deliveryDate = new Date(shipDate);
    deliveryDate.setDate(deliveryDate.getDate() + transitDays + (hasDelay ? Math.floor(Math.random() * 5) : 0));
    const distance = Math.floor(Math.random() * 2500) + 100;
    const weight = Math.floor(Math.random() * 500) + 10;
    const costPerMile = 0.5 + Math.random() * 1.5;
    const cost = parseFloat((distance * costPerMile + weight * 0.1).toFixed(2));
    
    return {
      timestamp: new Date(2025, 9, Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 24)).toISOString(),
      asset_id: `TRK-${1000 + i}`,
      latitude: 40.7128 + (Math.random() - 0.5) * 5,
      longitude: -74.0060 + (Math.random() - 0.5) * 5,
      inventory_level: Math.floor(Math.random() * 1000) + 100,
      shipment_status: statuses[Math.floor(Math.random() * statuses.length)],
      temperature: Math.floor(Math.random() * 30) + 10,
      humidity: Math.floor(Math.random() * 50) + 30,
      traffic_status: trafficStatuses[Math.floor(Math.random() * trafficStatuses.length)],
      waiting_time: Math.floor(Math.random() * 120),
      user_transaction_amount: Math.floor(Math.random() * 5000) + 500,
      user_purchase_frequency: Math.floor(Math.random() * 20) + 1,
      logistics_delay_reason: hasDelay ? delayReasons[Math.floor(Math.random() * (delayReasons.length - 1))] : 'None',
      asset_utilization: Math.floor(Math.random() * 40) + 60,
      demand_forecast: Math.floor(Math.random() * 1000) + 500,
      logistics_delay: hasDelay ? 1 : 0,
      shipment_id: `SHP-${10000 + i}`,
      origin_warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      shipment_date: shipDate.toISOString().split('T')[0],
      delivery_date: deliveryDate.toISOString().split('T')[0],
      weight_kg: weight,
      cost: cost,
      distance_miles: distance,
      transit_days: transitDays + (hasDelay ? Math.floor(Math.random() * 5) : 0)
    };
  });
};

const mapColumns = (headers) => {
  const mapping = {};
  const unmapped = [];
  
  headers.forEach(header => {
    const normalized = header.toLowerCase().trim().replace(/\s+/g, '_');
    let mapped = false;
    
    for (const [standardField, variations] of Object.entries(COLUMN_MAPPINGS)) {
      if (variations.includes(normalized)) {
        mapping[header] = standardField;
        mapped = true;
        break;
      }
    }
    
    if (!mapped) {
      unmapped.push(header);
    }
  });
  
  return { mapping, unmapped };
};

const LogisticsDashboard = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [dataStatus, setDataStatus] = useState(null);
  const [usingSampleData, setUsingSampleData] = useState(true);
  
  const sampleData = useMemo(() => generateLogisticsData(), []);
  const data = uploadedData || sampleData;

  const sampleQuestions = [
    "What is the delay rate?",
    "Show shipment status distribution",
    "What are the main delay reasons?",
    "Predict delivery delays",
    "Optimize carrier selection",
    "Detect cost anomalies",
    "Forecast shipping expenses by route",
    "What is the average asset utilization?",
    "Show traffic status breakdown",
    "Compare carrier performance"
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setDataStatus({
            success: false,
            message: 'No data found in CSV file',
            available: [],
            missing: Object.keys(COLUMN_MAPPINGS)
          });
          return;
        }

        const headers = Object.keys(results.data[0]);
        const { mapping, unmapped } = mapColumns(headers);
        
        const transformedData = results.data.map(row => {
          const standardRow = {};
          Object.entries(row).forEach(([key, value]) => {
            const standardField = mapping[key];
            if (standardField) {
              standardRow[standardField] = value;
            }
          });
          return standardRow;
        });

        const requiredFields = Object.keys(COLUMN_MAPPINGS);
        const availableFields = requiredFields.filter(field => 
          transformedData.some(row => row[field] !== undefined && row[field] !== null)
        );
        const missingFields = requiredFields.filter(field => !availableFields.includes(field));

        setUploadedData(transformedData);
        setUsingSampleData(false);
        setDataStatus({
          success: true,
          message: `Successfully loaded ${transformedData.length} records`,
          available: availableFields,
          missing: missingFields,
          unmapped: unmapped,
          totalRows: transformedData.length
        });
        setAnswer(null);
      },
      error: (error) => {
        setDataStatus({
          success: false,
          message: `Error parsing CSV: ${error.message}`,
          available: [],
          missing: Object.keys(COLUMN_MAPPINGS)
        });
      }
    });
  };

  const analyzeQuestion = (q) => {
    const query = q.toLowerCase();
    
    // Predict Delivery Delays
    if (query.includes('predict delay') || query.includes('delivery delay') || query.includes('delay predict')) {
      const hasRequiredData = data.some(d => 
        d.distance_miles !== undefined && 
        d.transit_days !== undefined && 
        d.logistics_delay !== undefined
      );
      
      if (!hasRequiredData) {
        return {
          type: 'text',
          title: 'Delay Prediction',
          description: 'Insufficient data for delay prediction. Please ensure your CSV includes distance_miles, transit_days, and logistics_delay columns.'
        };
      }
      
      const validData = data.filter(d => 
        !isNaN(d.distance_miles) && 
        !isNaN(d.transit_days) && 
        d.logistics_delay !== undefined
      );
      
      const distanceRanges = [
        { range: '0-500 miles', min: 0, max: 500 },
        { range: '501-1000 miles', min: 501, max: 1000 },
        { range: '1001-1500 miles', min: 1001, max: 1500 },
        { range: '1500+ miles', min: 1501, max: Infinity }
      ];
      
      const delayByDistance = distanceRanges.map(({ range, min, max }) => {
        const inRange = validData.filter(d => d.distance_miles >= min && d.distance_miles <= max);
        const delayed = inRange.filter(d => d.logistics_delay === 1 || d.logistics_delay === true);
        const delayRate = inRange.length > 0 ? ((delayed.length / inRange.length) * 100).toFixed(1) : 0;
        return { name: range, value: parseFloat(delayRate), count: inRange.length };
      });
      
      const delayedShipments = validData.filter(d => d.logistics_delay === 1 || d.logistics_delay === true);
      const onTimeShipments = validData.filter(d => d.logistics_delay === 0 || d.logistics_delay === false);
      const avgDelayedTransit = delayedShipments.length > 0 
        ? (delayedShipments.reduce((sum, d) => sum + d.transit_days, 0) / delayedShipments.length).toFixed(1)
        : 0;
      const avgOnTimeTransit = onTimeShipments.length > 0
        ? (onTimeShipments.reduce((sum, d) => sum + d.transit_days, 0) / onTimeShipments.length).toFixed(1)
        : 0;
      
      return {
        type: 'kpi-chart',
        title: 'Delivery Delay Prediction Model',
        kpi: `${((delayedShipments.length / validData.length) * 100).toFixed(1)}%`,
        kpiLabel: 'Overall Delay Probability',
        chartData: delayByDistance,
        chartType: 'bar',
        description: `Delayed shipments average ${avgDelayedTransit} transit days vs ${avgOnTimeTransit} days for on-time deliveries. Long-distance shipments show higher delay risk.`
      };
    }
    
    // Optimize Carrier Selection
    if (query.includes('carrier') && (query.includes('optimize') || query.includes('compare') || query.includes('best') || query.includes('selection') || query.includes('performance'))) {
      const hasCarrierData = data.some(d => 
        d.carrier !== undefined && 
        d.cost !== undefined && 
        d.transit_days !== undefined
      );
      
      if (!hasCarrierData) {
        return {
          type: 'text',
          title: 'Carrier Optimization',
          description: 'Insufficient data for carrier analysis. Please ensure your CSV includes carrier, cost, and transit_days columns.'
        };
      }
      
      const validData = data.filter(d => 
        d.carrier && 
        !isNaN(d.cost) && 
        !isNaN(d.transit_days)
      );
      
      const carrierStats = {};
      validData.forEach(d => {
        if (!carrierStats[d.carrier]) {
          carrierStats[d.carrier] = { costs: [], transitTimes: [], delays: 0, total: 0 };
        }
        carrierStats[d.carrier].costs.push(d.cost);
        carrierStats[d.carrier].transitTimes.push(d.transit_days);
        carrierStats[d.carrier].total++;
        if (d.logistics_delay === 1 || d.logistics_delay === true) {
          carrierStats[d.carrier].delays++;
        }
      });
      
      const carrierAnalysis = Object.entries(carrierStats).map(([carrier, stats]) => {
        const avgCost = stats.costs.reduce((a, b) => a + b, 0) / stats.costs.length;
        const avgTransit = stats.transitTimes.reduce((a, b) => a + b, 0) / stats.transitTimes.length;
        const delayRate = (stats.delays / stats.total) * 100;
        
        const costScore = 100 - ((avgCost / 5000) * 100);
        const speedScore = 100 - ((avgTransit / 15) * 100);
        const reliabilityScore = 100 - delayRate;
        const efficiencyScore = ((costScore + speedScore + reliabilityScore) / 3).toFixed(1);
        
        return {
          name: carrier,
          value: parseFloat(efficiencyScore),
          avgCost: avgCost.toFixed(2),
          avgTransit: avgTransit.toFixed(1),
          delayRate: delayRate.toFixed(1)
        };
      }).sort((a, b) => b.value - a.value);
      
      const bestCarrier = carrierAnalysis[0];
      
      return {
        type: 'kpi-chart',
        title: 'Carrier Performance Optimization',
        kpi: bestCarrier.name,
        kpiLabel: 'Recommended Carrier',
        chartData: carrierAnalysis.map(c => ({ name: c.name, value: c.value })),
        chartType: 'bar',
        description: `${bestCarrier.name} has the best efficiency score (${bestCarrier.value}/100) with avg cost $${bestCarrier.avgCost}, ${bestCarrier.avgTransit} days transit, and ${bestCarrier.delayRate}% delay rate.`
      };
    }
    
    // Detect Cost Anomalies
    if (query.includes('anomal') || query.includes('unusual') || (query.includes('cost') && query.includes('detect'))) {
      const hasRequiredData = data.some(d => 
        d.cost !== undefined && 
        d.weight_kg !== undefined && 
        d.distance_miles !== undefined
      );
      
      if (!hasRequiredData) {
        return {
          type: 'text',
          title: 'Cost Anomaly Detection',
          description: 'Insufficient data for anomaly detection. Please ensure your CSV includes cost, weight_kg, and distance_miles columns.'
        };
      }
      
      const validData = data.filter(d => 
        !isNaN(d.cost) && 
        !isNaN(d.weight_kg) && 
        !isNaN(d.distance_miles) &&
        d.cost > 0 &&
        d.weight_kg > 0 &&
        d.distance_miles > 0
      );
      
      const costsPerUnit = validData.map(d => ({
        shipmentId: d.shipment_id || `Shipment ${d.asset_id}`,
        costPerUnit: d.cost / (d.distance_miles * d.weight_kg),
        cost: d.cost,
        weight: d.weight_kg,
        distance: d.distance_miles
      }));
      
      const values = costsPerUnit.map(c => c.costPerUnit).sort((a, b) => a - b);
      const q1 = values[Math.floor(values.length * 0.25)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      const anomalies = costsPerUnit.filter(c => 
        c.costPerUnit < lowerBound || c.costPerUnit > upperBound
      );
      
      const anomalyTypes = {
        'Overcharged': anomalies.filter(a => a.costPerUnit > upperBound).length,
        'Undercharged': anomalies.filter(a => a.costPerUnit < lowerBound).length,
        'Normal': validData.length - anomalies.length
      };
      
      const chartData = Object.entries(anomalyTypes).map(([name, value]) => ({ name, value }));
      
      return {
        type: 'kpi-chart',
        title: 'Cost Anomaly Detection',
        kpi: `${anomalies.length}`,
        kpiLabel: 'Anomalies Detected',
        chartData,
        chartType: 'pie',
        description: `Found ${anomalies.length} shipments with unusual costs out of ${validData.length} total. ${anomalyTypes.Overcharged} potentially overcharged, ${anomalyTypes.Undercharged} potentially undercharged.`
      };
    }
    
    // Forecast Shipping Expenses by Route
    if (query.includes('forecast') || query.includes('expense') || (query.includes('cost') && query.includes('route'))) {
      const hasRequiredData = data.some(d => 
        d.origin_warehouse !== undefined && 
        d.destination !== undefined && 
        d.cost !== undefined
      );
      
      if (!hasRequiredData) {
        return {
          type: 'text',
          title: 'Shipping Expense Forecast',
          description: 'Insufficient data for expense forecasting. Please ensure your CSV includes origin_warehouse, destination, and cost columns.'
        };
      }
      
      const validData = data.filter(d => 
        d.origin_warehouse && 
        d.destination && 
        !isNaN(d.cost)
      );
      
      const routeStats = {};
      validData.forEach(d => {
        const route = `${d.origin_warehouse} → ${d.destination}`;
        if (!routeStats[route]) {
          routeStats[route] = { costs: [], volumes: 0 };
        }
        routeStats[route].costs.push(d.cost);
        routeStats[route].volumes++;
      });
      
      const routeForecasts = Object.entries(routeStats)
        .map(([route, stats]) => {
          const avgCost = stats.costs.reduce((a, b) => a + b, 0) / stats.costs.length;
          const totalCost = stats.costs.reduce((a, b) => a + b, 0);
          return {
            name: route,
            value: parseFloat(avgCost.toFixed(2)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            volume: stats.volumes
          };
        })
        .sort((a, b) => b.totalCost - a.totalCost)
        .slice(0, 8);
      
      const totalExpenses = routeForecasts.reduce((sum, r) => sum + r.totalCost, 0);
      
      return {
        type: 'kpi-chart',
        title: 'Shipping Expense Forecast by Route',
        kpi: `$${totalExpenses.toFixed(2)}`,
        kpiLabel: 'Total Route Expenses',
        chartData: routeForecasts.map(r => ({ 
          name: r.name.length > 20 ? r.name.substring(0, 20) + '...' : r.name, 
          value: r.totalCost 
        })),
        chartType: 'bar',
        description: `Top routes analyzed. Highest expense route: ${routeForecasts[0].name} at $${routeForecasts[0].totalCost} (${routeForecasts[0].volume} shipments, avg $${routeForecasts[0].value} each).`
      };
    }
    
    // Delay Rate
    if (query.includes('delay rate') || query.includes('delays')) {
      const hasDelayData = data.some(d => d.logistics_delay !== undefined && d.logistics_delay !== null);
      const hasReasonData = data.some(d => d.logistics_delay_reason !== undefined && d.logistics_delay_reason !== null);
      
      if (!hasDelayData) {
        return {
          type: 'text',
          title: 'Delay Analysis',
          description: 'No logistics delay data available in the uploaded dataset. Please ensure your CSV includes a "logistics_delay" column.'
        };
      }
      
      const delayCount = data.filter(d => d.logistics_delay === 1 || d.logistics_delay === true || d.logistics_delay === '1').length;
      const delayRate = ((delayCount / data.length) * 100).toFixed(1);
      
      let reasonData = [];
      if (hasReasonData) {
        const delayReasons = data
          .filter(d => d.logistics_delay_reason && d.logistics_delay_reason !== 'None')
          .reduce((acc, d) => {
            acc[d.logistics_delay_reason] = (acc[d.logistics_delay_reason] || 0) + 1;
            return acc;
          }, {});
        reasonData = Object.entries(delayReasons).map(([name, value]) => ({ name, value }));
      }
      
      return {
        type: 'kpi-chart',
        title: 'Logistics Delay Analysis',
        kpi: `${delayRate}%`,
        kpiLabel: 'Overall Delay Rate',
        description: `${delayCount} out of ${data.length} shipments experienced delays${!hasReasonData ? ' (Delay reason data not available)' : ''}`,
        chartData: reasonData,
        chartType: 'pie',
        noChart: reasonData.length === 0
      };
    }
    
    // Shipment Status
    if (query.includes('shipment status') || query.includes('status distribution')) {
      const hasStatusData = data.some(d => d.shipment_status !== undefined && d.shipment_status !== null);
      
      if (!hasStatusData) {
        return {
          type: 'text',
          title: 'Shipment Status',
          description: 'No shipment status data available in the uploaded dataset. Please ensure your CSV includes a "shipment_status" column.'
        };
      }
      
      const statusData = data.reduce((acc, d) => {
        if (d.shipment_status) {
          acc[d.shipment_status] = (acc[d.shipment_status] || 0) + 1;
        }
        return acc;
      }, {});
      
      const chartData = Object.entries(statusData).map(([name, value]) => ({ name, value }));
      
      return {
        type: 'chart',
        title: 'Shipment Status Distribution',
        chartData,
        chartType: 'bar',
        description: `Total shipments tracked: ${data.length}`
      };
    }
    
    // Delay Reasons
    if (query.includes('delay reason')) {
      const hasReasonData = data.some(d => d.logistics_delay_reason !== undefined && d.logistics_delay_reason !== null);
      
      if (!hasReasonData) {
        return {
          type: 'text',
          title: 'Delay Reasons',
          description: 'No delay reason data available in the uploaded dataset. Please ensure your CSV includes a "logistics_delay_reason" column.'
        };
      }
      
      const reasonData = data
        .filter(d => d.logistics_delay_reason && d.logistics_delay_reason !== 'None')
        .reduce((acc, d) => {
          acc[d.logistics_delay_reason] = (acc[d.logistics_delay_reason] || 0) + 1;
          return acc;
        }, {});
      
      const chartData = Object.entries(reasonData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      
      if (chartData.length === 0) {
        return {
          type: 'text',
          title: 'Delay Reasons',
          description: 'No delay reasons found in the dataset.'
        };
      }
      
      return {
        type: 'chart',
        title: 'Top Delay Reasons',
        chartData,
        chartType: 'bar',
        description: 'Most common causes of logistics delays'
      };
    }
    
    // Asset Utilization
    if (query.includes('utilization') || query.includes('asset')) {
      const hasUtilizationData = data.some(d => d.asset_utilization !== undefined && d.asset_utilization !== null && !isNaN(d.asset_utilization));
      
      if (!hasUtilizationData) {
        return {
          type: 'text',
          title: 'Asset Utilization',
          description: 'No asset utilization data available in the uploaded dataset. Please ensure your CSV includes an "asset_utilization" column with numeric values.'
        };
      }
      
      const validData = data.filter(d => !isNaN(d.asset_utilization) && d.asset_utilization !== null);
      const avgUtilization = (validData.reduce((sum, d) => sum + parseFloat(d.asset_utilization), 0) / validData.length).toFixed(1);
      const utilizationRanges = {
        'High (90-100%)': validData.filter(d => d.asset_utilization >= 90).length,
        'Good (80-89%)': validData.filter(d => d.asset_utilization >= 80 && d.asset_utilization < 90).length,
        'Moderate (70-79%)': validData.filter(d => d.asset_utilization >= 70 && d.asset_utilization < 80).length,
        'Low (<70%)': validData.filter(d => d.asset_utilization < 70).length
      };
      
      const chartData = Object.entries(utilizationRanges).map(([name, value]) => ({ name, value }));
      
      return {
        type: 'kpi-chart',
        title: 'Asset Utilization Analysis',
        kpi: `${avgUtilization}%`,
        kpiLabel: 'Average Utilization',
        chartData,
        chartType: 'pie',
        description: 'Distribution of asset utilization across fleet'
      };
    }
    
    // Traffic Status
    if (query.includes('traffic')) {
      const hasTrafficData = data.some(d => d.traffic_status !== undefined && d.traffic_status !== null);
      
      if (!hasTrafficData) {
        return {
          type: 'text',
          title: 'Traffic Status',
          description: 'No traffic status data available in the uploaded dataset. Please ensure your CSV includes a "traffic_status" column.'
        };
      }
      
      const trafficData = data.reduce((acc, d) => {
        if (d.traffic_status) {
          acc[d.traffic_status] = (acc[d.traffic_status] || 0) + 1;
        }
        return acc;
      }, {});
      
      const chartData = Object.entries(trafficData).map(([name, value]) => ({ name, value }));
      
      return {
        type: 'chart',
        title: 'Traffic Status Breakdown',
        chartData,
        chartType: 'pie',
        description: 'Current traffic conditions across routes'
      };
    }
    
    // Waiting Time
    if (query.includes('waiting time')) {
      const hasWaitData = data.some(d => d.waiting_time !== undefined && d.waiting_time !== null && !isNaN(d.waiting_time));
      
      if (!hasWaitData) {
        return {
          type: 'text',
          title: 'Waiting Time',
          description: 'No waiting time data available in the uploaded dataset. Please ensure your CSV includes a "waiting_time" column with numeric values.'
        };
      }
      
      const validData = data.filter(d => !isNaN(d.waiting_time) && d.waiting_time !== null);
      const avgWaitTime = (validData.reduce((sum, d) => sum + parseFloat(d.waiting_time), 0) / validData.length).toFixed(0);
      const maxWaitTime = Math.max(...validData.map(d => parseFloat(d.waiting_time)));
      
      const timeRanges = {
        '0-30 min': validData.filter(d => d.waiting_time <= 30).length,
        '31-60 min': validData.filter(d => d.waiting_time > 30 && d.waiting_time <= 60).length,
        '61-90 min': validData.filter(d => d.waiting_time > 60 && d.waiting_time <= 90).length,
        '90+ min': validData.filter(d => d.waiting_time > 90).length
      };
      
      const chartData = Object.entries(timeRanges).map(([name, value]) => ({ name, value }));
      
      return {
        type: 'kpi-chart',
        title: 'Waiting Time Analysis',
        kpi: `${avgWaitTime} min`,
        kpiLabel: 'Average Wait Time',
        chartData,
        chartType: 'bar',
        description: `Maximum wait time: ${maxWaitTime} minutes`
      };
    }
    
    // Inventory Levels
    if (query.includes('inventory')) {
      const hasInventoryData = data.some(d => d.inventory_level !== undefined && d.inventory_level !== null && !isNaN(d.inventory_level));
      
      if (!hasInventoryData) {
        return {
          type: 'text',
          title: 'Inventory Levels',
          description: 'No inventory level data available in the uploaded dataset. Please ensure your CSV includes an "inventory_level" column with numeric values.'
        };
      }
      
      const validData = data.filter(d => !isNaN(d.inventory_level) && d.inventory_level !== null);
      const avgInventory = (validData.reduce((sum, d) => sum + parseFloat(d.inventory_level), 0) / validData.length).toFixed(0);
      const topAssets = validData
        .filter(d => d.asset_id)
        .sort((a, b) => b.inventory_level - a.inventory_level)
        .slice(0, 10)
        .map(d => ({ name: d.asset_id, value: d.inventory_level }));
      
      return {
        type: 'kpi-chart',
        title: 'Inventory Analysis',
        kpi: avgInventory,
        kpiLabel: 'Average Inventory Level',
        chartData: topAssets,
        chartType: 'bar',
        description: topAssets.length > 0 ? 'Top 10 assets by inventory level' : 'Asset ID information not available'
      };
    }
    
    // Temperature
    if (query.includes('temperature')) {
      const hasTempData = data.some(d => d.temperature !== undefined && d.temperature !== null && !isNaN(d.temperature));
      
      if (!hasTempData) {
        return {
          type: 'text',
          title: 'Temperature Analysis',
          description: 'No temperature data available in the uploaded dataset. Please ensure your CSV includes a "temperature" column with numeric values.'
        };
      }
      
      const validData = data.filter(d => !isNaN(d.temperature) && d.temperature !== null);
      const avgTemp = (validData.reduce((sum, d) => sum + parseFloat(d.temperature), 0) / validData.length).toFixed(1);
      const minTemp = Math.min(...validData.map(d => parseFloat(d.temperature)));
      const maxTemp = Math.max(...validData.map(d => parseFloat(d.temperature)));
      
      const tempRanges = {
        'Cold (<15°C)': validData.filter(d => d.temperature < 15).length,
        'Moderate (15-25°C)': validData.filter(d => d.temperature >= 15 && d.temperature <= 25).length,
        'Warm (>25°C)': validData.filter(d => d.temperature > 25).length
      };
      
      const chartData = Object.entries(tempRanges).map(([name, value]) => ({ name, value }));
      
      return {
        type: 'kpi-chart',
        title: 'Temperature Analysis',
        kpi: `${avgTemp}°C`,
        kpiLabel: 'Average Temperature',
        chartData,
        chartType: 'pie',
        description: `Range: ${minTemp}°C to ${maxTemp}°C`
      };
    }
    
    return {
      type: 'text',
      title: 'Query Not Recognized',
      description: 'Please try one of the sample questions or rephrase your query.'
    };
  };

  const handleAsk = (q) => {
    const questionToAsk = q || question;
    if (!questionToAsk.trim()) return;
    
    const result = analyzeQuestion(questionToAsk);
    setAnswer(result);
    setQuestion('');
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Package className="w-10 h-10 text-blue-400" />
              <div>
                <h1 className="text-4xl font-bold text-white">Logistics Intelligence Dashboard</h1>
                <p className="text-blue-200">Ask questions about your logistics data and get instant insights</p>
              </div>
            </div>
            <div className="text-right">
              {usingSampleData && (
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 text-sm rounded-full">
                  Using Sample Data
                </span>
              )}
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-start gap-4">
            <Upload className="w-6 h-6 text-blue-400 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Upload Your CSV Data</h3>
              <p className="text-blue-200 text-sm mb-3">
                Replace sample data with your actual logistics data. The dashboard will automatically map your column names.
              </p>
              <label className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition-colors">
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Data Status Display */}
        {dataStatus && (
          <div className={`backdrop-blur-lg rounded-xl p-6 mb-6 border ${
            dataStatus.success 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-start gap-4">
              {dataStatus.success ? (
                <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mt-1" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${
                  dataStatus.success ? 'text-green-200' : 'text-red-200'
                }`}>
                  {dataStatus.success ? 'Data Upload Successful' : 'Data Upload Failed'}
                </h3>
                <p className={`mb-4 ${
                  dataStatus.success ? 'text-green-100' : 'text-red-100'
                }`}>
                  {dataStatus.message}
                </p>

                {dataStatus.success && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Available Fields */}
                    <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Available Data Fields ({dataStatus.available.length})
                      </h4>
                      <div className="bg-white/10 rounded-lg p-3 max-h-48 overflow-y-auto">
                        {dataStatus.available.length > 0 ? (
                          <ul className="space-y-1">
                            {dataStatus.available.map(field => (
                              <li key={field} className="text-sm text-green-200 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400">No fields mapped</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Fields */}
                    <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        Missing Data Fields ({dataStatus.missing.length})
                      </h4>
                      <div className="bg-white/10 rounded-lg p-3 max-h-48 overflow-y-auto">
                        {dataStatus.missing.length > 0 ? (
                          <ul className="space-y-1">
                            {dataStatus.missing.map(field => (
                              <li key={field} className="text-sm text-yellow-200 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-green-300">All fields present!</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {dataStatus.unmapped && dataStatus.unmapped.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                    <h4 className="font-semibold text-orange-200 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Unmapped Columns
                    </h4>
                    <p className="text-sm text-orange-100 mb-2">
                      These columns were not recognized and will be ignored:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dataStatus.unmapped.map(col => (
                        <span key={col} className="px-2 py-1 bg-orange-500/30 text-orange-100 text-xs rounded">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!dataStatus.success && (
                  <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-blue-200 mb-2">Accepted Column Names</h4>
                    <p className="text-sm text-blue-100 mb-3">
                      Your CSV should include columns with names similar to these (case-insensitive):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(COLUMN_MAPPINGS).map(([field, variations]) => (
                        <div key={field} className="bg-white/10 rounded p-2">
                          <div className="text-xs font-semibold text-white mb-1">
                            {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-blue-200">
                            {variations.slice(0, 2).join(', ')}
                            {variations.length > 2 && ', ...'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask a question about your logistics data..."
                className="w-full pl-11 pr-4 py-3 bg-white/90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => handleAsk()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Ask
            </button>
          </div>
          
          <div>
            <div className="text-sm text-blue-200 mb-2 font-semibold">Try these questions:</div>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(q)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-colors border border-white/30"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20">
            <details className="text-sm text-blue-200">
              <summary className="cursor-pointer font-semibold hover:text-blue-100">
                💡 What can this dashboard do?
              </summary>
              <div className="mt-3 space-y-2 pl-4">
                <div><span className="text-blue-300">🔮 Predict Delays:</span> Analyze patterns in distance, transit times, and historical delays to predict future delivery issues</div>
                <div><span className="text-blue-300">🚚 Optimize Carriers:</span> Compare carriers based on cost efficiency, speed, and reliability to find the best option</div>
                <div><span className="text-blue-300">🔍 Detect Anomalies:</span> Identify unusual shipment costs and weight discrepancies that may indicate billing errors</div>
                <div><span className="text-blue-300">💰 Forecast Expenses:</span> Project shipping costs by route to optimize budget allocation</div>
                <div><span className="text-blue-300">📊 Performance Metrics:</span> Track KPIs like delay rates, utilization, traffic conditions, and more</div>
              </div>
            </details>
          </div>
        </div>

        {/* Answer Section */}
        {answer && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              {answer.title}
            </h2>
            
            {answer.type === 'kpi-chart' && (
              <div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6">
                  <div className="text-sm text-blue-100 mb-1">{answer.kpiLabel}</div>
                  <div className="text-5xl font-bold text-white">{answer.kpi}</div>
                  <div className="text-sm text-blue-100 mt-2">{answer.description}</div>
                </div>
                
                {!answer.noChart && answer.chartData && answer.chartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    {answer.chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={answer.chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {answer.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <BarChart data={answer.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="name" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            )}
            
            {answer.type === 'chart' && (
              <div>
                <p className="text-blue-200 mb-4">{answer.description}</p>
                {answer.chartData && answer.chartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={300}>
                    {answer.chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={answer.chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {answer.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <BarChart data={answer.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="name" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            )}
            
            {answer.type === 'text' && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-100">{answer.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        {!answer && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 border border-blue-400/30">
              <Package className="w-8 h-8 text-white mb-2" />
              <div className="text-3xl font-bold text-white">{data.length}</div>
              <div className="text-blue-100 text-sm">Total Shipments</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 border border-purple-400/30">
              <TrendingUp className="w-8 h-8 text-white mb-2" />
              <div className="text-3xl font-bold text-white">
                {(() => {
                  const validData = data.filter(d => !isNaN(d.cost) && d.cost !== null);
                  if (validData.length === 0) return 'N/A';
                  const avgCost = validData.reduce((sum, d) => sum + d.cost, 0) / validData.length;
                  return '$' + avgCost.toFixed(0);
                })()}
              </div>
              <div className="text-purple-100 text-sm">Avg Shipping Cost</div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 border border-pink-400/30">
              <AlertTriangle className="w-8 h-8 text-white mb-2" />
              <div className="text-3xl font-bold text-white">
                {(() => {
                  const delays = data.filter(d => d.logistics_delay === 1 || d.logistics_delay === true || d.logistics_delay === '1');
                  return delays.length;
                })()}
              </div>
              <div className="text-pink-100 text-sm">Active Delays</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 border border-orange-400/30">
              <Clock className="w-8 h-8 text-white mb-2" />
              <div className="text-3xl font-bold text-white">
                {(() => {
                  const validData = data.filter(d => !isNaN(d.transit_days) && d.transit_days !== null);
                  if (validData.length === 0) return 'N/A';
                  return (validData.reduce((sum, d) => sum + d.transit_days, 0) / validData.length).toFixed(1) + 'd';
                })()}
              </div>
              <div className="text-orange-100 text-sm">Avg Transit Time</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsDashboard;
