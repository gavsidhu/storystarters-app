import axios from 'axios';
import React, { useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useAuth from '@/hooks/useAuth';
import useRegisterFlow from '@/hooks/useRegisterFlow';

import RegisterForm from '@/components/auth/RegisterForm';
import Checkout from '@/components/payments/Checkout';
import Pricing from '@/components/payments/Pricing';

import { url } from '@/constant/url';

const Register = () => {
  const { registerWithEmail } = useAuth();
  const { priceId } = useRegisterFlow();
  const [formStep, setFormStep] = useState(0);

  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);

  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);

  const handlePlanSelect = () => {
    nextFormStep();
  };
  const onSubmit = async (data: FieldValues) => {
    const createCustomer = await axios.post(
      `${url}/api/payment/create-customer`,
      {
        email: data.email,
        name: data.firstname + ' ' + data.lastname,
      }
    );

    await registerWithEmail(
      data.email,
      data.password,
      data.firstname,
      data.lastname,
      createCustomer.data.customer.id
    );

    const createSession = await axios.post(
      `${url}/api/payment/create-checkout-session`,
      {
        customerId: createCustomer.data.customer.id,
        priceId,
      }
    );

    window.location.href = createSession.data.url;
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
          <RegisterForm onSubmit={onSubmit} />
          <button onClick={prevFormStep}>Go Back</button>
          <button onClick={nextFormStep}>Next Step</button>
        </div>
      )}
      {formStep === 2 && (
        <div>
          <Checkout />
          <button onClick={prevFormStep}>Go Back</button>
          <button onClick={nextFormStep}>Next Step</button>
        </div>
      )}
    </div>
  );
};

export default Register;
