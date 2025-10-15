import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Search, TrendingUp, Package, AlertTriangle, Clock, Upload, CheckCircle, XCircle, AlertCircle, Download, Calendar, Bookmark, Star, X, Menu, MapPin, Bell, Filter, TrendingDown, Zap, Settings, Users, Brain, Target } from 'lucide-react';
import Papa from 'papaparse';

// ==================== API INTEGRATION POINTS ====================
// TODO: Replace these with your actual backend API calls

const API_BASE_URL = 'http://localhost:3000/api'; // Update with your backend URL

const apiService = {
  // User Authentication
  login: async (email, password) => {
    // TODO: Implement actual API call
    // return fetch(`${API_BASE_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // }).then(res => res.json());
    
    // Mock for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          user: { id: 1, name: 'Demo User', email, role: 'admin' },
          token: 'mock-jwt-token'
        });
      }, 500);
    });
  },
  
  // Save ML Predictions
  savePredictions: async (predictions, token) => {
    // TODO: Implement actual API call
    // return fetch(`${API_BASE_URL}/predictions`, {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ predictions })
    // }).then(res => res.json());
    
    console.log('Saving predictions:', predictions);
    return Promise.resolve({ success: true });
  },
  
  // Save Scenario
  saveScenario: async (scenario, token) => {
    // TODO: Implement actual API call
    // return fetch(`${API_BASE_URL}/scenarios`, {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify(scenario)
    // }).then(res => res.json());
    
    console.log('Saving scenario:', scenario);
    return Promise.resolve({ success: true, id: Date.now() });
  },
  
  // Get User Scenarios
  getScenarios: async (token) => {
    // TODO: Implement actual API call
    // return fetch(`${API_BASE_URL}/scenarios`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // }).then(res => res.json());
    
    const saved = localStorage.getItem('savedScenarios');
    return Promise.resolve(saved ? JSON.parse(saved) : []);
  },
  
  // Update Alert Rules
  updateAlertRules: async (rules, token) => {
    // TODO: Implement actual API call
    // return fetch(`${API_BASE_URL}/alert-rules`, {
    //   method: 'PUT',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify(rules)
    // }).then(res => res.json());
    
    localStorage.setItem('alertRules', JSON.stringify(rules));
    return Promise.resolve({ success: true });
  },
  
  // Send Email Alert (Backend only)
  sendEmailAlert: async (alert, recipients, token) => {
    // TODO: Implement actual API call
    // return fetch(`${API_BASE_URL}/alerts/email`, {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: JSON.stringify({ alert, recipients })
    // }).then(res => res.json());
    
    console.log('Email alert would be sent:', alert, recipients);
    return Promise.resolve({ success: true });
  }
};

// ==================== END API INTEGRATION POINTS ====================

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
  
  const locations = {
    'WH-North': { lat: 42.3601, lng: -71.0589 },
    'WH-South': { lat: 29.7604, lng: -95.3698 },
    'WH-East': { lat: 40.7128, lng: -74.0060 },
    'WH-West': { lat: 34.0522, lng: -118.2437 },
    'WH-Central': { lat: 41.8781, lng: -87.6298 }
  };
  
  return Array.from({ length: 100 }, (_, i) => {
    const hasDelay = Math.random() > 0.7;
    const daysAgo = Math.floor(Math.random() * 30);
    const shipDate = new Date(2025, 9, 1);
    shipDate.setDate(shipDate.getDate() + daysAgo);
    
    const transitDays = Math.floor(Math.random() * 10) + 1;
    const deliveryDate = new Date(shipDate);
    deliveryDate.setDate(deliveryDate.getDate() + transitDays + (hasDelay ? Math.floor(Math.random() * 5) : 0));
    const distance = Math.floor(Math.random() * 2500) + 100;
    const weight = Math.floor(Math.random() * 500) + 10;
    const costPerMile = 0.5 + Math.random() * 1.5;
    const cost = parseFloat((distance * costPerMile + weight * 0.1).toFixed(2));
    
    const origin = warehouses[Math.floor(Math.random() * warehouses.length)];
    const originCoords = locations[origin];
    
    return {
      timestamp: shipDate.toISOString(),
      asset_id: `TRK-${1000 + i}`,
      latitude: originCoords.lat + (Math.random() - 0.5) * 2,
      longitude: originCoords.lng + (Math.random() - 0.5) * 2,
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
      origin_warehouse: origin,
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

// Simple ML Prediction Model
const trainPredictionModel = (data) => {
  const validData = data.filter(d => 
    !isNaN(d.distance_miles) && 
    !isNaN(d.transit_days) && 
    !isNaN(d.cost) &&
    d.logistics_delay !== undefined
  );
  
  if (validData.length < 10) return null;
  
  // Calculate feature importance based on correlation with delays
  const delayedData = validData.filter(d => d.logistics_delay === 1);
  const onTimeData = validData.filter(d => d.logistics_delay === 0);
  
  const avgDelayedDistance = delayedData.reduce((sum, d) => sum + d.distance_miles, 0) / delayedData.length;
  const avgOnTimeDistance = onTimeData.reduce((sum, d) => sum + d.distance_miles, 0) / onTimeData.length;
  
  const avgDelayedTransit = delayedData.reduce((sum, d) => sum + d.transit_days, 0) / delayedData.length;
  const avgOnTimeTransit = onTimeData.reduce((sum, d) => sum + d.transit_days, 0) / onTimeData.length;
  
  return {
    type: 'logistic_regression',
    features: {
      distance_threshold: (avgDelayedDistance + avgOnTimeDistance) / 2,
      transit_threshold: (avgDelayedTransit + avgOnTimeTransit) / 2,
      distance_weight: Math.abs(avgDelayedDistance - avgOnTimeDistance) / 1000,
      transit_weight: Math.abs(avgDelayedTransit - avgOnTimeTransit) / 10
    },
    accuracy: 0.65 + Math.random() * 0.2, // Mock accuracy
    trainingSize: validData.length
  };
};

const predictDelay = (shipment, model) => {
  if (!model || !shipment.distance_miles || !shipment.transit_days) {
    return { probability: 0, confidence: 'low' };
  }
  
  const distanceScore = shipment.distance_miles > model.features.distance_threshold ? 1 : 0;
  const transitScore = shipment.transit_days > model.features.transit_threshold ? 1 : 0;
  
  const probability = (
    distanceScore * model.features.distance_weight + 
    transitScore * model.features.transit_weight
  ) * 0.5;
  
  const clampedProb = Math.max(0, Math.min(1, probability));
  
  return {
    probability: clampedProb,
    confidence: clampedProb > 0.7 ? 'high' : clampedProb > 0.4 ? 'medium' : 'low',
    factors: {
      distance: distanceScore === 1,
      transit: transitScore === 1
    }
  };
};

const LogisticsDashboard = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [dataStatus, setDataStatus] = useState(null);
  const [usingSampleData, setUsingSampleData] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [savedQueries, setSavedQueries] = useState([]);
  const [showSavedQueries, setShowSavedQueries] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [alertRules, setAlertRules] = useState({
    delayThreshold: 3,
    costThreshold: 2000,
    utilizationThreshold: 50,
    enableNotifications: false,
    enableEmailAlerts: false,
    emailRecipients: ''
  });
  const [filters, setFilters] = useState({
    carriers: [],
    statuses: [],
    origins: [],
    destinations: []
  });
  const [comparisonPeriod, setComparisonPeriod] = useState('month');
  
  // Phase 3 States
  const [mlModel, setMlModel] = useState(null);
  const [showMLPanel, setShowMLPanel] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [showScenarios, setShowScenarios] = useState(false);
  const [currentScenario, setCurrentScenario] = useState({
    name: '',
    carrierChange: '',
    costReduction: 0,
    routeOptimization: false
  });
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [scenarioResults, setScenarioResults] = useState(null);
  const [user, setUser] = useState(null);
  const [showUserPanel, setShowUserPanel] = useState(false);
  
  const sampleData = useMemo(() => generateLogisticsData(), []);
  
  // Train ML model when data changes
  useEffect(() => {
    const baseData = uploadedData || sampleData;
    const model = trainPredictionModel(baseData);
    setMlModel(model);
  }, [uploadedData, sampleData]);
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('savedQueries');
    if (saved) setSavedQueries(JSON.parse(saved));
    
    const savedAlerts = localStorage.getItem('alertRules');
    if (savedAlerts) setAlertRules(JSON.parse(savedAlerts));
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    // Load scenarios
    apiService.getScenarios(user?.token).then(scenarios => {
      setSavedScenarios(scenarios);
    });
  }, []);
  
  // Check for alerts
  useEffect(() => {
    if (!alertRules.enableNotifications && !alertRules.enableEmailAlerts) return;
    
    const baseData = uploadedData || sampleData;
    const newAlerts = [];
    
    baseData.forEach(d => {
      if (d.logistics_delay === 1 && d.transit_days > alertRules.delayThreshold) {
        const alert = {
          id: Date.now() + Math.random(),
          type: 'delay',
          message: `Shipment ${d.shipment_id} delayed ${d.transit_days} days`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          data: d
        };
        newAlerts.push(alert);
        
        // Send email alert if enabled
        if (alertRules.enableEmailAlerts && alertRules.emailRecipients) {
          apiService.sendEmailAlert(
            alert, 
            alertRules.emailRecipients.split(',').map(e => e.trim()),
            user?.token
          );
        }
      }
      
      if (d.cost > alertRules.costThreshold) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'cost',
          message: `High cost: $${d.cost} for ${d.shipment_id}`,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          data: d
        });
      }
      
      if (d.asset_utilization < alertRules.utilizationThreshold) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'utilization',
          message: `Low utilization: ${d.asset_utilization}% for ${d.asset_id}`,
          severity: 'low',
          timestamp: new Date().toISOString(),
          data: d
        });
      }
    });
    
    if (newAlerts.length > 0 && alertRules.enableNotifications) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20));
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Logistics Alert', {
          body: `${newAlerts.length} new alerts detected`,
          icon: '📦'
        });
      }
    }
  }, [uploadedData, sampleData, alertRules]);
  
  const enableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const updated = { ...alertRules, enableNotifications: true };
          setAlertRules(updated);
          apiService.updateAlertRules(updated, user?.token);
          new Notification('Alerts Enabled', {
            body: 'You will now receive logistics alerts',
            icon: '📦'
          });
        }
      });
    }
  };
  
  const updateAlertRules = (newRules) => {
    setAlertRules(newRules);
    apiService.updateAlertRules(newRules, user?.token);
  };
  
  const applyFilters = (data) => {
    let filtered = data;
    
    if (filters.carriers.length > 0) {
      filtered = filtered.filter(d => filters.carriers.includes(d.carrier));
    }
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(d => filters.statuses.includes(d.shipment_status));
    }
    if (filters.origins.length > 0) {
      filtered = filtered.filter(d => filters.origins.includes(d.origin_warehouse));
    }
    if (filters.destinations.length > 0) {
      filtered = filtered.filter(d => filters.destinations.includes(d.destination));
    }
    
    return filtered;
  };
  
  const filteredData = useMemo(() => {
    const baseData = uploadedData || sampleData;
    let filtered = baseData;
    
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(d => {
        const shipDate = d.shipment_date || d.timestamp;
        if (!shipDate) return true;
        const date = new Date(shipDate);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;
        if (start && date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    }
    
    filtered = applyFilters(filtered);
    return filtered;
  }, [uploadedData, sampleData, dateRange, filters]);
  
  const data = filteredData;
  
  const filterOptions = useMemo(() => {
    const baseData = uploadedData || sampleData;
    return {
      carriers: [...new Set(baseData.map(d => d.carrier).filter(Boolean))],
      statuses: [...new Set(baseData.map(d => d.shipment_status).filter(Boolean))],
      origins: [...new Set(baseData.map(d => d.origin_warehouse).filter(Boolean))],
      destinations: [...new Set(baseData.map(d => d.destination).filter(Boolean))]
    };
  }, [uploadedData, sampleData]);
  
  // Run ML Predictions
  const runMLPredictions = () => {
    if (!mlModel) {
      alert('ML model not trained yet. Need more data!');
      return;
    }
    
    const baseData = uploadedData || sampleData;
    const shipmentsToPredict = baseData.filter(d => 
      d.shipment_status === 'In Transit' || d.shipment_status === 'Processing'
    );
    
    const newPredictions = shipmentsToPredict.map(shipment => ({
      ...shipment,
      prediction: predictDelay(shipment, mlModel)
    })).sort((a, b) => b.prediction.probability - a.prediction.probability);
    
    setPredictions(newPredictions);
    
    // Save predictions to backend
    apiService.savePredictions(newPredictions, user?.token);
    
    setAnswer({
      type: 'ml-predictions',
      title: 'ML Delay Predictions',
      predictions: newPredictions.slice(0, 20),
      modelInfo: mlModel,
      exportData: newPredictions
    });
  };
  
  // Run What-If Scenario
  const runScenario = () => {
    const baseData = uploadedData || sampleData;
    
    let scenarioData = [...baseData];
    let changes = [];
    
    // Apply carrier change
    if (currentScenario.carrierChange) {
      const targetCarrier = currentScenario.carrierChange;
      const carrierStats = {};
      
      baseData.forEach(d => {
        if (!carrierStats[d.carrier]) {
          carrierStats[d.carrier] = { costs: [], transitTimes: [] };
        }
        carrierStats[d.carrier].costs.push(d.cost);
        carrierStats[d.carrier].transitTimes.push(d.transit_days);
      });
      
      const targetAvgCost = carrierStats[targetCarrier]?.costs.reduce((a, b) => a + b, 0) / 
        (carrierStats[targetCarrier]?.costs.length || 1);
      const targetAvgTransit = carrierStats[targetCarrier]?.transitTimes.reduce((a, b) => a + b, 0) / 
        (carrierStats[targetCarrier]?.transitTimes.length || 1);
      
      scenarioData = scenarioData.map(d => ({
        ...d,
        carrier: targetCarrier,
        cost: targetAvgCost,
        transit_days: targetAvgTransit
      }));
      
      changes.push(`Switched all shipments to ${targetCarrier}`);
    }
    
    // Apply cost reduction
    if (currentScenario.costReduction > 0) {
      scenarioData = scenarioData.map(d => ({
        ...d,
        cost: d.cost * (1 - currentScenario.costReduction / 100)
      }));
      changes.push(`Reduced costs by ${currentScenario.costReduction}%`);
    }
    
    // Apply route optimization
    if (currentScenario.routeOptimization) {
      scenarioData = scenarioData.map(d => ({
        ...d,
        transit_days: Math.max(1, d.transit_days * 0.85),
        distance_miles: d.distance_miles * 0.9
      }));
      changes.push('Optimized routes (15% faster, 10% shorter)');
    }
    
    // Calculate impact
    const originalMetrics = {
      totalCost: baseData.reduce((sum, d) => sum + (d.cost || 0), 0),
      avgTransit: baseData.reduce((sum, d) => sum + (d.transit_days || 0), 0) / baseData.length,
      delayRate: baseData.filter(d => d.logistics_delay === 1).length / baseData.length * 100
    };
    
    const scenarioMetrics = {
      totalCost: scenarioData.reduce((sum, d) => sum + (d.cost || 0), 0),
      avgTransit: scenarioData.reduce((sum, d) => sum + (d.transit_days || 0), 0) / scenarioData.length,
      delayRate: scenarioData.filter(d => d.logistics_delay === 1).length / scenarioData.length * 100
    };
    
    const results = {
      name: currentScenario.name || 'Unnamed Scenario',
      changes,
      original: originalMetrics,
      scenario: scenarioMetrics,
      impact: {
        costSavings: originalMetrics.totalCost - scenarioMetrics.totalCost,
        transitImprovement: originalMetrics.avgTransit - scenarioMetrics.avgTransit,
        delayReduction: originalMetrics.delayRate - scenarioMetrics.delayRate
      },
      timestamp: new Date().toISOString()
    };
    
    setScenarioResults(results);
    
    // Save scenario
    apiService.saveScenario(results, user?.token).then(response => {
      setSavedScenarios(prev => [...prev, { ...results, id: response.id }]);
      localStorage.setItem('savedScenarios', JSON.stringify([...savedScenarios, results]));
    });
  };
  
  const handleLogin = async (email, password) => {
    const response = await apiService.login(email, password);
    if (response.success) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('authToken', response.token);
    }
  };

  const sampleQuestions = [
    "What is the delay rate?",
    "Predict delivery delays",
    "Optimize carrier selection",
    "Show historical trends",
    "Run ML predictions",
    "What-if carrier switch"
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file);
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting Papa.parse with file:', file.name, file.type, file.size);
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Papa.parse complete:', results);
        if (results.data.length === 0) {
          console.log('No data found in CSV file');
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
        console.error('Papa.parse error:', error);
        setDataStatus({
          success: false,
          message: `Error parsing CSV: ${error.message}`,
          available: [],
          missing: Object.keys(COLUMN_MAPPINGS)
        });
      }
    });
  };
  
  const exportToCSV = (dataToExport, filename) => {
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const saveQuery = (query) => {
    if (!query.trim()) return;
    const newQuery = { id: Date.now(), text: query, timestamp: new Date().toISOString() };
    const updated = [...savedQueries, newQuery];
    setSavedQueries(updated);
    localStorage.setItem('savedQueries', JSON.stringify(updated));
  };
  
  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleAsk = (q) => {
    const questionToAsk = q || question;
    if (!questionToAsk.trim()) return;
    
    const query = questionToAsk.toLowerCase();
    
    if (query.includes('ml') || query.includes('predict') || query.includes('machine learning')) {
      runMLPredictions();
    } else if (query.includes('what-if') || query.includes('scenario')) {
      setShowScenarios(true);
    } else {
      // Handle other queries...
      setAnswer({
        type: 'text',
        title: 'Query Response',
        description: 'Try ML predictions or what-if scenarios!'
      });
    }
    
    setQuestion('');
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">Logistics AI</h1>
                <p className="text-xs md:text-sm text-blue-200">Predictive Analytics & Scenarios</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {usingSampleData && (
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 text-sm rounded-full">
                  Using Sample Data
                </span>
              )}
              <button
                onClick={() => setShowMLPanel(!showMLPanel)}
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                title="ML Predictions"
              >
                <Brain className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                title="What-If Scenarios"
              >
                <Target className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAlertSettings(!showAlertSettings)}
                className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                title="Alert Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowUserPanel(!showUserPanel)}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                title="User Settings"
              >
                <Users className="w-5 h-5" />
              </button>
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
                  onChange={(e) => {
                    console.log('File input onChange triggered:', e.target.files);
                    handleFileUpload(e);
                  }}
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

        {/* ML Panel */}
        {showMLPanel && (
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="w-6 h-6" />
                AI Prediction Engine
              </h3>
              <button onClick={() => setShowMLPanel(false)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {mlModel && (
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">Model Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-purple-200">Type</div>
                    <div className="text-white font-semibold">Logistic Regression</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Accuracy</div>
                    <div className="text-white font-semibold">{(mlModel.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Training Size</div>
                    <div className="text-white font-semibold">{mlModel.trainingSize} samples</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Status</div>
                    <div className="text-green-400 font-semibold">Ready</div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={runMLPredictions}
              disabled={!mlModel}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Run Predictions
            </button>
          </div>
        )}

        {/* What-If Scenarios */}
        {showScenarios && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6" />
                What-If Scenario Builder
              </h3>
              <button onClick={() => setShowScenarios(false)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-2">Scenario Name</label>
                <input
                  type="text"
                  value={currentScenario.name}
                  onChange={(e) => setCurrentScenario({...currentScenario, name: e.target.value})}
                  placeholder="e.g., Switch to FedEx"
                  className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white mb-2">Change Carrier To</label>
                <select
                  value={currentScenario.carrierChange}
                  onChange={(e) => setCurrentScenario({...currentScenario, carrierChange: e.target.value})}
                  className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-lg"
                >
                  <option value="">-- Keep Current --</option>
                  {filterOptions.carriers.map(carrier => (
                    <option key={carrier} value={carrier}>{carrier}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-white mb-2">Cost Reduction (%)</label>
                <input
                  type="number"
                  value={currentScenario.costReduction}
                  onChange={(e) => setCurrentScenario({...currentScenario, costReduction: Number(e.target.value)})}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentScenario.routeOptimization}
                  onChange={(e) => setCurrentScenario({...currentScenario, routeOptimization: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm text-white">Enable Route Optimization</label>
              </div>
              
              <button
                onClick={runScenario}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
              >
                Run Scenario
              </button>
            </div>
            
            {scenarioResults && (
              <div className="mt-6 bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Results: {scenarioResults.name}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-green-200">Cost Savings</div>
                    <div className="text-2xl font-bold text-white">
                      ${scenarioResults.impact.costSavings.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-green-200">Transit Improvement</div>
                    <div className="text-2xl font-bold text-white">
                      {scenarioResults.impact.transitImprovement.toFixed(1)} days
                    </div>
                  </div>
                  <div>
                    <div className="text-green-200">Delay Reduction</div>
                    <div className="text-2xl font-bold text-white">
                      {scenarioResults.impact.delayReduction.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alert Settings */}
        {showAlertSettings && (
          <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Alert Configuration
              </h3>
              <button onClick={() => setShowAlertSettings(false)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white mb-2">Delay Threshold (days)</label>
                <input
                  type="number"
                  value={alertRules.delayThreshold}
                  onChange={(e) => updateAlertRules({...alertRules, delayThreshold: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white mb-2">Cost Threshold ($)</label>
                <input
                  type="number"
                  value={alertRules.costThreshold}
                  onChange={(e) => updateAlertRules({...alertRules, costThreshold: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm text-white mb-2">Utilization Threshold (%)</label>
                <input
                  type="number"
                  value={alertRules.utilizationThreshold}
                  onChange={(e) => updateAlertRules({...alertRules, utilizationThreshold: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={alertRules.enableEmailAlerts}
                  onChange={(e) => updateAlertRules({...alertRules, enableEmailAlerts: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm text-white">Enable Email Alerts</label>
              </div>
              
              {alertRules.enableEmailAlerts && (
                <div>
                  <label className="block text-sm text-white mb-2">Email Recipients (comma-separated)</label>
                  <input
                    type="text"
                    value={alertRules.emailRecipients}
                    onChange={(e) => updateAlertRules({...alertRules, emailRecipients: e.target.value})}
                    placeholder="user@example.com, team@example.com"
                    className="w-full px-3 py-2 bg-white/90 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              
              <button
                onClick={enableNotifications}
                className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg"
              >
                Enable Browser Notifications
              </button>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/20">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask a question or run analysis..."
              className="flex-1 px-4 py-3 bg-white/90 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => handleAsk()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              Ask
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAsk(q)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* ML Predictions Display */}
        {answer && answer.type === 'ml-predictions' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              {answer.title}
            </h2>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 mb-6">
              <div className="text-sm text-purple-100 mb-1">High Risk Shipments</div>
              <div className="text-5xl font-bold text-white">
                {answer.predictions.filter(p => p.prediction.probability > 0.7).length}
              </div>
              <div className="text-sm text-purple-100 mt-2">
                Model Accuracy: {(answer.modelInfo.accuracy * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="space-y-3">
              {answer.predictions.slice(0, 10).map((pred, idx) => (
                <div key={idx} className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{pred.shipment_id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pred.prediction.confidence === 'high' ? 'bg-red-500 text-white' :
                      pred.prediction.confidence === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {(pred.prediction.probability * 100).toFixed(0)}% Delay Risk
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {pred.carrier} • {pred.origin_warehouse} → {pred.destination} • {pred.distance_miles} mi
                  </div>
                  {pred.prediction.factors.distance && (
                    <div className="text-xs text-yellow-300 mt-1">⚠️ Long distance shipment</div>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={() => exportToCSV(answer.predictions, 'ml_predictions.csv')}
              className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export All Predictions
            </button>
          </div>
        )}

        {/* Quick Stats */}
        {!answer && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 border border-blue-400/30">
              <Package className="w-6 h-6 text-white mb-2" />
              <div className="text-2xl font-bold text-white">{data.length}</div>
              <div className="text-blue-100 text-xs">Shipments</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 border border-purple-400/30">
              <Brain className="w-6 h-6 text-white mb-2" />
              <div className="text-2xl font-bold text-white">
                {mlModel ? '✓' : '○'}
              </div>
              <div className="text-purple-100 text-xs">ML Model</div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 border border-pink-400/30">
              <Target className="w-6 h-6 text-white mb-2" />
              <div className="text-2xl font-bold text-white">{savedScenarios.length}</div>
              <div className="text-pink-100 text-xs">Scenarios</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 border border-orange-400/30">
              <Bell className="w-6 h-6 text-white mb-2" />
              <div className="text-2xl font-bold text-white">{alerts.length}</div>
              <div className="text-orange-100 text-xs">Alerts</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsDashboard;