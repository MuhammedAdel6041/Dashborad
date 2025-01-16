/* eslint-disable react/prop-types */
import { Modal, Input, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddCouponModal = ({ visible, onClose, onAddSuccess }) => {
  const { auth } = useAuth();  // Get the token from context
  const [name, setName] = useState('');
  const [expire, setExpire] = useState('');
  const [discount, setDiscount] = useState('');

  const handleAddCoupon = async () => {
    if (!name.trim() || !expire.trim() || !discount) {
      message.error('All fields are required.');
      return;
    }

    try {
      const payload = {
        name,
        expire,
        discount: Number(discount),
      };

      await axios.post(
        'https://e-commerce-api-v1-cdk5.onrender.com/api/v1/coupons',
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      message.success('Coupon added successfully!');
      onAddSuccess();
      onClose();
      setName('');
      setExpire('');
      setDiscount('');
    } catch (error) {
      console.error('Add coupon error:', error);
      message.error('Failed to add coupon. Please try again.');
    }
  };

  return (
    <Modal
      title="Add Coupon"
      visible={visible}
      onOk={handleAddCoupon}
      onCancel={onClose}
    >
      <Input
        placeholder="Enter coupon name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Enter expiration date (MM/DD/YYYY)"
        value={expire}
        onChange={(e) => setExpire(e.target.value)}
        className="mb-4"
      />
      <Input
        placeholder="Enter discount percentage"
        type="number"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        className="mb-4"
      />
    </Modal>
  );
};

export default AddCouponModal;
