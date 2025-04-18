import React, { useState, useEffect } from 'react';
import './App.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';




function App() {
  const [graphData, setGraphData] = useState(null);

  const [formData, setForm] = useState({
    monthly_sales: '',
    avg_tickets: '',
  });

  const [processingRate, setProcessingRate] = useState(0.03);

  const [chargePerTransaction, setChargePerTransaction] = useState(0.10);
  const [alternateChargePerTransaction, setAlternateChargePerTransaction] = useState(0.15);




  const handleRateChange = (e) => {
    setProcessingRate(e.target.value);
  };

  const handleChargeChange = (e) => {
    setChargePerTransaction(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const processVelaRate = (monthly_sales) => {
    let processing_rate = 0.035;

    return (processing_rate * monthly_sales);
  }

  const processAlternateRate = (monthly_sales) => {
    let processing_rate = 0.045;
    
    return (processing_rate * monthly_sales);
  }

  const handleAddData = (e) => {
    e.preventDefault();
    if (!formData.monthly_sales || !formData.avg_tickets) return;

    let month_sales = parseFloat(formData.monthly_sales);
    let tickets = parseFloat(formData.avg_tickets);


    let avg_sale_per_ticket = month_sales / tickets;
    let vela_processing_cost_no_surcharge = processVelaRate(month_sales);
    let alternate_processing_cost_no_surcharge = processAlternateRate(month_sales);


    setGraphData(generateLinearDataFromSingleSource(vela_processing_cost_no_surcharge, alternate_processing_cost_no_surcharge, tickets));

    setForm({ monthly_sales: '', avg_tickets: '',});
  };

  const generateLinearDataFromSingleSource = (vela_processing_cost_no_surcharge, alternate_processing_cost_no_surcharge, tickets) => {

    const empty_array = Array(12).fill(0);

    const linear_rate = 0.02;

    const year_data_set = [...empty_array].map((value, iteration) => {
      const rate = vela_processing_cost_no_surcharge * (1 + linear_rate * iteration);

      const alternate_rate = alternate_processing_cost_no_surcharge * (1 + linear_rate * iteration);

      const rate_surcharge_cost = chargePerTransaction * tickets;
      const alternate_rate_surcharge_cost = alternateChargePerTransaction * tickets;
    
      return {
        month_iteration: iteration + 1,
        vela_processing_rate_without_surcharge: (parseFloat(rate) + parseFloat(rate_surcharge_cost)).toFixed(2),
        alternate_processing_rate_without_surcharge: (parseFloat(alternate_rate) + parseFloat(alternate_rate_surcharge_cost)).toFixed(2),
      };
    });
    console.log(year_data_set);
    
    return year_data_set;
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
            value={processingRate}
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
            <YAxis domain={['dataMin - 300', 'dataMax + 100']}/>
            <Tooltip />
            <Line type="monotone" dataKey="alternate_processing_rate_without_surcharge" stroke="#ff6f00" name="Your Current Rate" />
            <Line type="monotone" dataKey="vela_processing_rate_without_surcharge" stroke="#a900ff" name="VelaOne's Rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}

export default App;