import { useEffect, useState } from 'react';
import { Layout, Card, Row, Col, Spin, Alert, Empty, Statistic } from 'antd';
import { useAuth } from '../context/AuthContext';
import EcommerceChart from '../components/EcommerceChart';
import { motion } from 'framer-motion';

const { Content } = Layout;

const cardStyles = {
  totalRevenue: { backgroundColor: '#e6f7ff', borderColor: '#91d5ff' },
  totalOrders: { backgroundColor: '#fffbe6', borderColor: '#ffe58f' },
  totalProfit: { backgroundColor: '#f9f0ff', borderColor: '#d3adf7' },
  pendingOrders: { backgroundColor: '#fff0f6', borderColor: '#ffadd2' },
  ordersInDelivery: { backgroundColor: '#f0f5ff', borderColor: '#91d5ff' },
  paidOrders: { backgroundColor: '#e6ffed', borderColor: '#b7eb8f' },
};

export default function Dashboard() {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const endpoints = [
          'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/dashboard/',
          'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/dashboard/numorder',
          'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/dashboard/profit',
          'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/dashboard/ispending',
          'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/dashboard/isdelivery',
          'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/dashboard/status',
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            fetch(endpoint, {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            })
          )
        );

        // Check if all responses are okay
        responses.forEach(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch dashboard data.');
          }
        });

        const results = await Promise.all(responses.map(response => response.json()));
        setData(results); // Store all data results
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="Loading Dashboard..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  // Destructure data from the fetched results
  const totalRevenue = data[0]?.data.totalRevenue || 0; // From the first API
  const numOfOrders = data[1]?.data.numOfOrders || 0; // From the second API
  const totalProfit = data[2]?.data.totalProfit || 0; // From the third API
  const numPending = data[3]?.data.ispending || 0; // From the fourth API
  const numInDelivery = data[4]?.data.isdelivery || 0; // From the fifth API
  const paidOrders = data[5]?.data.paidOrders || 0; // From the sixth API

  return (
    <Layout>
      <Content style={{ padding: '20px' }}>
        <EcommerceChart />
        <Row gutter={16}>
          <Col span={12}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                title="Total Revenue"
                style={cardStyles.totalRevenue}
              >
                {totalRevenue > 0 ? (
                  <Statistic value={totalRevenue} prefix="$" />
                ) : (
                  <Empty description="No revenue data available" />
                )}
              </Card>
            </motion.div>
          </Col>
          <Col span={12}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                title="Total Orders"
                style={cardStyles.totalOrders}
              >
                {numOfOrders > 0 ? (
                  <Statistic value={numOfOrders} />
                ) : (
                  <Empty description="No orders available" />
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                title="Total Profit"
                style={cardStyles.totalProfit}
              >
                {totalProfit > 0 ? (
                  <Statistic value={totalProfit} prefix="$" />
                ) : (
                  <Empty description="No profit data available" />
                )}
              </Card>
            </motion.div>
          </Col>
          <Col span={12}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                title="Pending Orders"
                style={cardStyles.pendingOrders}
              >
                {numPending > 0 ? (
                  <Statistic value={numPending} />
                ) : (
                  <Empty description="No pending orders" />
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                title="Orders in Delivery"
                style={cardStyles.ordersInDelivery}
              >
                {numInDelivery > 0 ? (
                  <Statistic value={numInDelivery} />
                ) : (
                  <Empty description="No orders in delivery" />
                )}
              </Card>
            </motion.div>
          </Col>
          <Col span={12}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                title="Paid Orders"
                style={cardStyles.paidOrders}
              >
                {paidOrders > 0 ? (
                  <Statistic value={paidOrders} />
                ) : (
                  <Empty description="No paid orders available" />
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
