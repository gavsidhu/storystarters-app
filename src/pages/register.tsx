import axios, { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import React, { useContext, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useAuth from '@/hooks/useAuth';
import useRegisterFlow from '@/hooks/useRegisterFlow';

import RegisterForm from '@/components/auth/RegisterForm';
import Pricing from '@/components/payments/Pricing';

import authErrors from '@/constant/authErrors';
import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

const Register = () => {
  // const router = useRouter();
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
    setLoading(true);
    try {
      //send gtag begin checkout conversion - Original register flow
      // initiateCheckout();

      // get stripeId from useAuth register function Original register flow
      const stripeId = await registerWithEmail(
        data.email,
        data.password,
        data.firstname,
        data.lastname
      );

      //Check if there is a stripe id - Original register flow
      if (stripeId === undefined) {
        setLoading(false);
        return;
      }

      //Create checkout session - Original register flow
      const createSession = await axios.post(
        `${url}/api/payment/create-checkout-session`,
        {
          customerId: stripeId,
          priceId,
        }
      );
      window.location.href = createSession.data.url;

      // register user with email - new register flow
      // await registerWithEmail(
      //   data.email,
      //   data.password,
      //   data.firstname,
      //   data.lastname
      // );
      // router.push('/');
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
      //Register with google and return stripe id - original register flow
      const stripeId = await registerWithGoogle();

      //check  if stripe id exists - original register flow
      if (stripeId === undefined || null) {
        setLoading(false);
        return;
      }

      //Create checkout session - Original register flow
      const createSession = await axios.post(
        `${url}/api/payment/create-checkout-session`,
        {
          customerId: stripeId,
          priceId,
        }
      );
      window.location.href = createSession.data.url;

      //Register with google new register flow
      // await registerWithGoogle();
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
    </div>
  );
};

export default Register;
