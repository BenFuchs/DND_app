import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { sendOrderAsync, clearCart } from './paypalSlice';
import { toast } from 'react-toastify';

const Paypal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const paypalOptions = {
    clientId: 'AZ2I4WzcSOelYkwG3R2wNa_1kEYlATy7N_WD8hrxSIK8n0FBiZ5N_04ZcCZooQFli4oYLhJmN7C-kDJB', 
    currency: 'USD',
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: '5.00', 
          },
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      console.log(details)
      const paypal_id = details.id;
      console.log(paypal_id)
      dispatch(sendOrderAsync({ paypal_id, total_amount: '5.00' })); // Use `total_amount` here
      
      toast.success('Payment successful!');
      dispatch(clearCart());
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Payment processing failed!');
    }
  };

  const onError = (err: any) => {
    toast.error('Payment failed!');
    console.error(err);
  };

  return (
    <div>
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
      </PayPalScriptProvider>
    </div>
  );
};

export default Paypal;
