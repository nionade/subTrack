import { useState, useEffect } from "react";
import "./App.css";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
); 

function App() {
 const [subscriptions, setSubscriptions] =
  useState(() => {
    const savedSubscriptions =
      localStorage.getItem("subscriptions");

    return savedSubscriptions
      ? JSON.parse(savedSubscriptions)
      : [];
  });

  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [renewalDate, setRenewalDate] = useState("");
  const [category, setCategory] =
  useState("");
  const [editingId, setEditingId] =
  useState(null);

  useEffect(() => {
  localStorage.setItem(
    "subscriptions",
    JSON.stringify(subscriptions)
  );
}, [subscriptions]);
  
function saveSubscription() {
  if (editingId) {

  const updatedSubscriptions =
    subscriptions.map((sub) =>
      sub.id === editingId
        ? {
            ...sub,
            name,
            cost,
            renewalDate,
            category
          }
        : sub
    );

  setSubscriptions(
    updatedSubscriptions
  );

  setEditingId(null);
  setName("");
  setCost("");
  setRenewalDate("");
  setCategory("");

} else {

  if (!name || !cost || !renewalDate || !category) {
  alert("Please fill all fields");
  return;
}
if (Number(cost) <= 0) {
  alert("Cost must be greater than 0");
  return;
}
  const newSubscription = {
    id: Date.now(),
    name: name,
    cost: cost,
  renewalDate: renewalDate,
    category: category
  };

  const updatedSubscriptions = [
    ...subscriptions,
    newSubscription
  ];

  setSubscriptions(updatedSubscriptions);

  /*localStorage.setItem(
    "subscriptions",
    JSON.stringify(updatedSubscriptions)
  );*/

  setName("");
  setCost("");
  setRenewalDate("");
  setCategory("");
}
}

function editSubscription(sub) {
  setName(sub.name);
  setCost(sub.cost);
  setRenewalDate(sub.renewalDate);
  setCategory(sub.category);

  setEditingId(sub.id);
}

  function deleteSubscription(id) {
  const updatedSubscriptions =
    subscriptions.filter(
      (sub) => sub.id !== id
    );

  setSubscriptions(updatedSubscriptions);
}
const totalMonthlyCost = subscriptions.reduce(
  (total, sub) =>
    total + Number(sub.cost),
  0
);
const totalSubscriptions =
  subscriptions.length;

const totalAnnualCost =
  totalMonthlyCost * 12;

  const today = new Date();

const upcomingRenewals =
  subscriptions.filter((sub) => {
    const renewalDate =
      new Date(sub.renewalDate);

    const difference =
      renewalDate - today;

    const daysLeft =
      difference /
      (1000 * 60 * 60 * 24);

    return daysLeft >= 0 &&
           daysLeft <= 30;
  });

  const categoryTotals = {};

subscriptions.forEach((sub) => {
  const category =
    sub.category || "Other";

  if (!categoryTotals[category]) {
    categoryTotals[category] = 0;
  }

  categoryTotals[category] +=
    Number(sub.cost);
});

const pieChartData = {
  labels: Object.keys(categoryTotals),

  datasets: [
    {
      label: "Category Spending",

      data: Object.values(
        categoryTotals
      ),
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40"
      ]
    },
  ],
};

  return(
    <div className="app">
  
  <h1>SubTrack</h1>
      

  <div className="dashboard">

  <div className="card">
    <h3>Total Subscriptions</h3>
    <p>{totalSubscriptions}</p>
  </div>

  <div className="card">
    <h3>Monthly Cost</h3>
    <p>₹{totalMonthlyCost}</p>
  </div>

  <div className="card">
    <h3>Annual Cost</h3>
    <p>₹{totalAnnualCost}</p>
  </div>

  <div className="card">
  <h3>Upcoming Renewals</h3>
  <p>
    {upcomingRenewals.length}
  </p>
</div>

</div>

<h2 className="section-title">
  Spending Breakdown
</h2>
<div className="chart-container">
  <Pie data={pieChartData} />
</div>
<div className="category-summary">
{Object.entries(categoryTotals).map(
  ([category, total]) => (
    <div key={category}>
      <strong>{category}</strong>
      : ₹{total}
    </div>
  )
)}
</div>
<div className="form-section">

  <input
    type="text"
    placeholder="Subscription Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    type="number"
    placeholder="Monthly Cost"
    value={cost}
    onChange={(e) => setCost(e.target.value)}
  />

  <input
    type="date"
    value={renewalDate}
    onChange={(e) =>
      setRenewalDate(e.target.value)
    }
  />

  <select
    value={category}
    onChange={(e) =>
      setCategory(e.target.value)
    }
  >
    <option value="">
      Select Category
    </option>

    <option value="Entertainment">
      Entertainment
    </option>

    <option value="Productivity">
      Productivity
    </option>

    <option value="Education">
      Education
    </option>

    <option value="Gaming">
      Gaming
    </option>

    <option value="Other">
      Other
    </option>
  </select>

  <button
    onClick={saveSubscription}
  >
    {editingId
      ? "Update Subscription"
      : "Add Subscription"}
  </button>

</div>

      <button
  onClick={saveSubscription}
>
  {editingId
    ? "Update Subscription"
    : "Add Subscription"}
</button>

      <hr />
    <h2 className="section-title">
  Your Subscriptions
</h2>
      {subscriptions.map((sub) => (
  <div
    key={sub.id}
    className="subscription"
  >
    <div className="subscription-header">

      <h3>{sub.name}</h3>

      <div className="subscription-buttons">

        <button
          onClick={() =>
            editSubscription(sub)
          }
        >
          Edit
        </button>

        <button
  className="delete-btn"
  onClick={() =>
    deleteSubscription(sub.id)
  }
>
  Delete
</button>

      </div>

    </div>

    <p>₹{sub.cost}/month</p>

    <p>
      Renews: {sub.renewalDate}
    </p>

    <p>
      Category: {sub.category}
    </p>

  </div>
))}
    </div>
  );
}

export default App;