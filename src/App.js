import React, { useState, useEffect } from 'react';
import './App.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';



const initialData = [
  { month_iteration: 1, processing_rate_without_surcharge: 1255.76,},
  { month_iteration: 2, processing_rate_without_surcharge: 1318.10,},
  { month_iteration: 3, processing_rate_without_surcharge: 1381.44,},
  { month_iteration: 4, processing_rate_without_surcharge: 1443.76,},
  { month_iteration: 5, processing_rate_without_surcharge: 1506.10,},
  { month_iteration: 6, processing_rate_without_surcharge: 1569.44,},
  { month_iteration: 7, processing_rate_without_surcharge: 1632.76,},
  { month_iteration: 8, processing_rate_without_surcharge: 1695.10,},
  { month_iteration: 9, processing_rate_without_surcharge: 1757.44,},
  { month_iteration: 10, processing_rate_without_surcharge: 1820.76,},
  { month_iteration: 11, processing_rate_without_surcharge: 1883.10,},
  { month_iteration: 12, processing_rate_without_surcharge: 1946.44,},
];

const calculateAvgSalePerTicket = (monthly_sales, ticket_count) => {
  if (ticket_count <= 0) return 0;

  return monthly_sales/ticket_count;
};

const transactionSurchargeTotal = (surcharge_cost, ticket_count) => {
  return surcharge_cost * ticket_count;
};

const processingRateCost = (monthly_sales, processing_rate) => {
  return monthly_sales * processing_rate;
};

const totalProcessingCost = (transaction_surcharge_total, processing_rate_cost) => {
  return transaction_surcharge_total + processing_rate_cost;
};

const trueProcessingRate = (total_processing_cost, monthly_sales) => {
  if(monthly_sales <= 0) return 0;

  return total_processing_cost/monthly_sales;
};

function App() {
  const [graphData, setGraphData] = useState(initialData);

  const [formData, setForm] = useState({
    monthly_sales: '',
    avg_tickets: '',
  });

  const [rate, setRate] = useState(0.03);

  const [chargePerTransaction, setChargePerTransaction] = useState('0.10');

  const [singleDataPoint, setSingleDataPoint] = useState(0);



  useEffect(()=>{

    // setGraphData(generateLinearDataFromSingleSource(singleDataPoint));
    generateLinearDataFromSingleSource(singleDataPoint);

  }, [singleDataPoint])


  const handleRateChange = (e) => {
    setRate(e.target.value);
  };

  const handleChargeChange = (e) => {
    setChargePerTransaction(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddData = (e) => {
    e.preventDefault();
    if (!formData.monthly_sales || !formData.avg_tickets) return;

    let month_sales = parseFloat(formData.monthly_sales);
    let tickets = parseFloat(formData.avg_tickets);


    let avg_sale_per_ticket = month_sales / tickets;
    let processing_cost_no_surcharge = parseFloat(month_sales * rate);

    setSingleDataPoint(processing_cost_no_surcharge);


    setGraphData(prev => [...prev, {
      month_iteration: graphData.length,
      processing_rate_without_surcharge: processing_cost_no_surcharge,
    }]);

    setForm({ monthly_sales: '', avg_tickets: '',});
  };

  const generateLinearDataFromSingleSource = (single_month_cost) => {

    const empty_array = Array(11).fill(0);

    // const year_data_set = [single_month_cost, ...empty_array];

    const linear_rate = 0.05;

    const year_data_set = [single_month_cost, ...empty_array].map((value, iteration) => {
      return value > 0
        ? value
        : single_month_cost * (1 + linear_rate * iteration);
    });

    console.log(year_data_set);
    
  }

  return (
    <div className="outerShell">
      <div className="appContainer">
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="rate">Base Rate (%):</label>
          <br />
          <input
            type="number"
            id="rate"
            name="rate"
            value={rate}
            onChange={handleRateChange}
            placeholder="e.g. 2.5"
            style={{ padding: '8px', fontSize: '1em', width: '150px' }}
          />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="charge">Charge per Transaction ($):</label>
        <br />
        <input
          type="number"
          id="charge"
          name="charge"
          value={chargePerTransaction}
          onChange={handleChargeChange}
          placeholder="e.g. 0.10"
          step="0.01"
          min="0"
          style={{ padding: '8px', fontSize: '1em', width: '150px' }}
        />
      </div>


      <form onSubmit={handleAddData} className="formContainer">
        <input
          type="number"
          name="monthly_sales"
          placeholder="Monthly Sales"
          value={formData.monthly_sales}
          onChange={handleChange}
        />
        <input
          type="number"
          name="avg_tickets"
          placeholder="Ticket Count"
          value={formData.avg_tickets}
          onChange={handleChange}
        />
        <button type="submit">Add Data Point</button>
      </form>

      <div className="graphContainer">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month_iteration" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="processing_rate_without_surcharge" stroke="#ff0000" name="processing_rate_without_surcharge" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}

export default App;