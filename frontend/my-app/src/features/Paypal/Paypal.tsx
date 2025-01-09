import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { sendOrderAsync, clearCart } from './paypalSlice';
import { toast } from 'react-toastify';

const Paypal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const CLIENT_ID = process.env.REACT_APP_PAYPAL_ID;
  const paypalOptions = {
    clientId: CLIENT_ID!,
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
      const paypal_id = details.id;
      dispatch(sendOrderAsync({ paypal_id, total_amount: '5.00' }));

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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Character Sheet Cost: $5
      </div>
      <div>
        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Paypal;
