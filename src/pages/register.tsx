import axios, { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import React, { useContext, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useAuth from '@/hooks/useAuth';
import useRegisterFlow from '@/hooks/useRegisterFlow';

import RegisterForm from '@/components/auth/RegisterForm';
import Checkout from '@/components/payments/Checkout';
import Pricing from '@/components/payments/Pricing';

import authErrors from '@/constant/authErrors';
import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

const Register = () => {
  const { registerWithEmail, registerWithGoogle } = useAuth();
  const { priceId } = useRegisterFlow();
  const [formStep, setFormStep] = useState(0);
  const alertContext = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

  // const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

  const handlePlanSelect = () => {
    nextFormStep();
  };
  const onSubmit = async (data: FieldValues) => {
    // const createCustomer = await axios.post(
    //   `${url}/api/payment/create-customer`,
    //   {
    //     email: data.email,
    //     name: data.firstname + ' ' + data.lastname,
    //   }
    // );
    setLoading(true);
    try {
      const stripeId = await registerWithEmail(
        data.email,
        data.password,
        data.firstname,
        data.lastname
      );
      if (stripeId === undefined) {
        setLoading(false);
        return;
      }

      const createSession = await axios.post(
        `${url}/api/payment/create-checkout-session`,
        {
          customerId: stripeId,
          priceId,
        }
      );
      window.location.href = createSession.data.url;
    } catch (error: unknown) {
      setLoading(false);
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.code as string, 'error', 3000);
      }
      if (error instanceof FirebaseError) {
        alertContext.addAlert(authErrors[error.code] as string, 'error', 5000);
      }
    }
  };

  const googleSubmit = async () => {
    setLoading(true);
    try {
      const stripeId = await registerWithGoogle();
      if (stripeId === undefined || null) {
        setLoading(false);
        return;
      }

      const createSession = await axios.post(
        `${url}/api/payment/create-checkout-session`,
        {
          customerId: stripeId,
          priceId,
        }
      );
      window.location.href = createSession.data.url;
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        alertContext.addAlert(error.code as string, 'error', 3000);
      }
      if (error instanceof FirebaseError) {
        alertContext.addAlert(authErrors[error.code] as string, 'error', 5000);
      }
    }
  };
  return (
    <div>
      {formStep === 0 && (
        <div>
          <Pricing handlePlanSelect={handlePlanSelect} />
        </div>
      )}

      {formStep === 1 && (
        <div>
          <RegisterForm
            onSubmit={onSubmit}
            loading={loading}
            googleSubmit={googleSubmit}
          />
        </div>
      )}
      {formStep === 2 && (
        <div>
          <Checkout />
        </div>
      )}
    </div>
  );
};

export default Register;
