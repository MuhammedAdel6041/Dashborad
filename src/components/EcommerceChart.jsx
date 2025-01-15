// src/components/EcommerceChart.js

import { Bar, Doughnut, Pie, PolarArea, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { Card } from 'antd'; // Importing Ant Design Card component
import { motion } from 'framer-motion'; // Import motion

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

const EcommerceChart = () => {
  // Static data for the e-commerce charts
  const revenueData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Total Revenue ($)',
        data: [5000, 4000, 4500, 3000, 6000, 7000, 8000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const orderData = {
    labels: ['Total Orders', 'Pending Orders', 'Delivered Orders'],
    datasets: [
      {
        label: 'Order Status',
        data: [200, 50, 150],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Direct', 'Referral', 'Social'],
    datasets: [
      {
        label: 'Traffic Sources',
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const polarAreaData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Colors',
        data: [11, 16, 7, 3, 14, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  const radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding'],
    datasets: [
      {
        label: 'Activities',
        data: [20, 10, 4, 2, 8],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'E-Commerce Dashboard - Revenue and Orders',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">E-Commerce Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <motion.div 
          className="shadow-md"
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Card>
            <h3 className="font-medium">Total Revenue</h3>
            <Bar data={revenueData} options={options} />
          </Card>
        </motion.div>

        {/* Doughnut Chart */}
        <motion.div 
          className="shadow-md"
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Card>
            <h3 className="font-medium">Order Status</h3>
            <Doughnut data={orderData} options={options} />
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          className="shadow-md"
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Card>
            <h3 className="font-medium">Traffic Sources</h3>
            <Pie data={pieData} options={options} />
          </Card>
        </motion.div>

        {/* Polar Area Chart */}
        <motion.div 
          className="shadow-md"
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Card>
            <h3 className="font-medium">Color Distribution</h3>
            <PolarArea data={polarAreaData} options={options} />
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div 
          className="shadow-md"
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Card>
            <h3 className="font-medium">Activity Distribution</h3>
            <Radar data={radarData} options={options} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EcommerceChart;
