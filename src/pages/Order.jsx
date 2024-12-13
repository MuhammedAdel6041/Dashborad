import { Alert, Card, Descriptions, List, Modal, Pagination, Spin } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Order() {
    const { auth } = useAuth(); // Access the auth context to get the token
    const [orders, setOrders] = useState([]); // State to hold the array of orders
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
    const [selectedOrder, setSelectedOrder] = useState(null); // State to hold the selected order for modal
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [pageSize] = useState(6); // Number of items per page
  
    // Fetch orders data from API
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await fetch('https://e-commerce-api-v1-cdk5.onrender.com/api/v1/orders', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${auth.token}`,
            },
          });
  
          // Check if response is ok
          if (!response.ok) {
            throw new Error('Failed to fetch order data');
          }
  
          const result = await response.json();
          console.log('Fetched Orders Data:', result); // Log the full response for debugging
  
          setOrders(result.data); // Set the state to the 'data' array from the response
          setLoading(false);
        } catch (error) {
          setError(error.message || 'Failed to fetch order data');
          setLoading(false);
        }
      };
  
      if (auth.token) {
        fetchOrders();
      } else {
        setError('Authentication token is missing');
        setLoading(false);
      }
    }, [auth.token]);
  
    // Handle page change
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    if (loading) return <Spin size="large" className="w-full h-full flex justify-center items-center" />;
    if (error) return <Alert message={error} type="error" className="mb-4" />;
  
    // Function to handle opening the modal with order details
    const showModal = (order) => {
      setSelectedOrder(order); // Set the selected order
      setIsModalVisible(true); // Show the modal
    };
  
    // Function to handle closing the modal
    const handleCancel = () => {
      setIsModalVisible(false); // Hide the modal
      setSelectedOrder(null); // Clear the selected order
    };
  
    // Function to render basic order details on the card
    const renderBasicOrderDetails = (order) => {
      const userName = order?.user?.name || 'Unknown User';
      const orderId = order?._id || 'No order ID';
      const orderStatus = order?.isDelivered ? 'Delivered' : 'Not Delivered';
  
      return (
        <div className="container mx-auto p-4" key={order._id}>
          <Card
            title={`Order ID: ${orderId}`}
            extra={
              <span
                className={`text-sm font-semibold p-2 rounded-full 
                  ${orderStatus === 'Delivered' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}
              >
                {orderStatus}
              </span>
            }
            className="mb-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            style={{ backgroundColor: '#f9fafb', cursor: 'pointer' }}
            onClick={() => showModal(order)} // Open the modal when the card is clicked
          >
            <p className="text-gray-700 font-semibold">{userName}</p>
          </Card>
        </div>
      );
    };
  
    // Function to render full order details inside the modal
    const renderFullOrderDetails = () => {
      if (!selectedOrder) return null; // If no order is selected, return null
  
      const order = selectedOrder;
      const userName = order?.user?.name || 'Unknown User';
      const userEmail = order?.user?.email || 'No email provided';
      const shippingDetails = order?.shippingAddress?.details || 'No shipping details available';
      const shippingCity = order?.shippingAddress?.city || 'Unknown city';
      const shippingPostalCode = order?.shippingAddress?.postalCode || 'Unknown postal code';
      const orderId = order?._id || 'No order ID';
  
      return (
        <Modal
          title={`Order ID: ${orderId}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '20px', // Add padding for better spacing
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow to make it pop
          }}
        >
          {/* Order Info */}
          <Card
            title="Order Information"
            className="mb-6 rounded-lg shadow-md bg-gradient-to-r from-blue-50 to-blue-100"
            style={{ backgroundColor: '#f1f5f9', borderRadius: '8px' }}
          >
            <Descriptions bordered>
              <Descriptions.Item label="Order ID">{orderId}</Descriptions.Item>
              <Descriptions.Item label="Customer">{userName}</Descriptions.Item>
              <Descriptions.Item label="Email">{userEmail}</Descriptions.Item>
              <Descriptions.Item label="Shipping Address">
                {shippingDetails}, {shippingCity}, {shippingPostalCode}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {order?.shippingAddress?.phone || 'No phone number'}
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">${order?.totalOrderPrice || 0}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {order?.paymentMethodType || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label="Order Status">
                {order?.isDelivered ? 'Delivered' : 'Not Delivered'}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                {order?.isPaid ? 'Paid' : 'Not Paid'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
  
          {/* Cart Items */}
          <Card
            title="Cart Items"
            className="mb-6 rounded-lg shadow-md bg-gradient-to-r from-green-50 to-green-100"
            style={{ backgroundColor: '#f1f5f9', borderRadius: '8px' }}
          >
            <List
              bordered
              dataSource={order?.cartItems || []} // Safe fallback to empty array if cartItems is undefined
              renderItem={(item) => (
                <List.Item>
                  <div className="flex justify-between w-full">
                    <div>{item.product ? item.product.name : 'Product Unavailable'}</div>
                    <div>
                      {item.quantity} x ${item.price}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
  
          {/* Order Timeline */}
          <Card
            title="Order Timeline"
            className="mb-6 rounded-lg shadow-md bg-gradient-to-r from-purple-50 to-purple-100"
            style={{ backgroundColor: '#f1f5f9', borderRadius: '8px' }}
          >
            <Descriptions bordered>
              <Descriptions.Item label="Created At">
                {order?.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown'}
              </Descriptions.Item>
              {order?.paidAt && (
                <Descriptions.Item label="Paid At">
                  {new Date(order.paidAt).toLocaleString()}
                </Descriptions.Item>
              )}
              {order?.deliveredAt && (
                <Descriptions.Item label="Delivered At">
                  {new Date(order.deliveredAt).toLocaleString()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Modal>
      );
    };
  
    return (
      <>
        <div className="container mx-auto p-4">
          {/* Displaying orders */}
          {orders
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map(renderBasicOrderDetails)}
  
          {/* Pagination Component */}
          <Pagination
            current={currentPage}
            total={orders.length}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
  
        {/* Order details in modal */}
        {renderFullOrderDetails()}
      </>
    );
  }
  