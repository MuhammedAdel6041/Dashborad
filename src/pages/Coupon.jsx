import { useState } from 'react';
import { Button, message, Popconfirm, Modal, Input, Card, Spin } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import AddCouponModal from '../components/AddCouponModal';

const { Meta } = Card;

// Fetch coupons from the API
const fetchCoupons = async (token) => {
  const response = await axios.get(
    'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/coupons',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

const Coupon = () => {
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for the AddCouponModal
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedExpire, setUpdatedExpire] = useState('');
  const [updatedDiscount, setUpdatedDiscount] = useState('');
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => fetchCoupons(auth.token),
    onError: (err) => {
      console.error(err);
      message.error('Failed to fetch coupons. Please try again.');
    },
  });

  const handleDeleteCoupon = async (couponId) => {
    try {
      queryClient.setQueryData(['coupons'], (oldData) =>
        oldData.filter((coupon) => coupon._id !== couponId)
      );

      await axios.delete(
        `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/coupons/${couponId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      message.success('Coupon deleted successfully!');
      queryClient.invalidateQueries(['coupons']);
    } catch (error) {
      console.error('Delete error:', error.response || error);
      message.error('Failed to delete coupon. Please try again.');
      queryClient.invalidateQueries(['coupons']);
    }
  };

  const handleUpdateCoupon = async () => {
    if (!updatedName.trim() || !updatedExpire.trim() || !updatedDiscount) {
      message.error('All fields are required.');
      return;
    }

    try {
      const payload = {
        name: updatedName,
        expire: moment(updatedExpire).format('MM/DD/YYYY'), // Format date as MM/DD/YYYY
        discount: Number(updatedDiscount),
      };

      await axios.put(
        `https://e-commerce-api-v1-cdk5.onrender.com/api/v1/coupons/${selectedCoupon._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      message.success('Coupon updated successfully!');
      queryClient.invalidateQueries(['coupons']);
      setIsUpdateModalVisible(false);
      setSelectedCoupon(null);
      setUpdatedName('');
      setUpdatedExpire('');
      setUpdatedDiscount('');
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      message.error(
        error.response?.data?.message || 'Failed to update coupon. Please try again.'
      );
    }
  };

  const handleAddSuccess = () => {
    queryClient.invalidateQueries(['coupons']); // Refresh coupons after adding a new one
  };

  return (
    <div className="p-4">
     <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Coupons</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card
              key={coupon._id}
              className="shadow-md hover:shadow-lg transition-shadow"
              title={coupon.name}
              bordered={false}
              extra={
                <Popconfirm
                  title="Are you sure you want to delete this coupon?"
                  onConfirm={() => handleDeleteCoupon(coupon._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              }
            >
              <Meta
                description={
                  <div>
                    <p>
                      Get{' '}
                      <span className="text-green-500 font-bold">
                        {coupon.discount}%
                      </span>{' '}
                      OFF on your next purchase!
                    </p>
                    <p>
                      Valid until:{' '}
                      <span className="font-semibold">
                        {coupon.expire
                          ? moment(coupon.expire).format('MMMM DD, YYYY')
                          : 'No Expiry'}
                      </span>
                    </p>
                    <div className="mt-4">
                      <Button
                        type="primary"
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setUpdatedName(coupon.name);
                          setUpdatedExpire(
                            coupon.expire
                              ? moment(coupon.expire).format('MM/DD/YYYY')
                              : ''
                          );
                          setUpdatedDiscount(coupon.discount);
                          setIsUpdateModalVisible(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Update Coupon"
        visible={isUpdateModalVisible}
        onOk={handleUpdateCoupon}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setSelectedCoupon(null);
          setUpdatedName('');
          setUpdatedExpire('');
          setUpdatedDiscount('');
        }}
      >
        <Input
          placeholder="Enter coupon name"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Enter expiration date (MM/DD/YYYY)"
          value={updatedExpire}
          onChange={(e) => setUpdatedExpire(e.target.value)}
          className="mb-4"
        />
        <Input
          placeholder="Enter discount percentage"
          type="number"
          value={updatedDiscount}
          onChange={(e) => setUpdatedDiscount(e.target.value)}
          className="mb-4"
        />
      </Modal>

      <AddCouponModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAddSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default Coupon;
