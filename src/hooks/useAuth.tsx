import axios from 'axios';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth, db } from '@/lib/firebaseClient';

import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

interface IAuth {
  user: User | null;
  registerWithEmail: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<IAuth>({
  user: null,
  registerWithEmail: async () => {
    //Register user
  },
  signInWithEmail: async () => {
    //Sign in user
  },
  logout: async () => {
    //logout user
  },
  error: null,
  loading: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const alertContext = useContext(AlertContext);
  const { addAlert } = alertContext;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Logged in...
          setUser(user);
          setLoading(false);
        } else {
          // Not logged in...
          setUser(null);
          setLoading(true);
          // router.push("/login");
        }

        setInitialLoading(false);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth]
  );

  const registerWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setLoading(true);
    let stripeId;
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        //Comment to get rid of eslint warning
        //const decodedToken = await auth.currentUser?.getIdToken();
        await updateProfile(result.user, {
          displayName: `${firstName} ${lastName}`,
        });

        const createCustomer = await axios.post(
          `${url}/api/payment/create-customer`,
          {
            email: email,
            name: firstName + ' ' + lastName,
          }
        );
        stripeId = createCustomer.data.customer.id;
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          firstName,
          lastName,
          email,
          stripeId: createCustomer.data.customer.id,
        });
        // const response = await axios.post(
        //   `${url}/api/crm/add-person`,
        //   {
        //     uid: result.user.uid,
        //     idToken: decodedToken,
        //     name: firstName + " " + lastName,
        //     personData: {
        //       Email: email,
        //       FirstName: firstName,
        //       LastName: lastName,
        //     },
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        // console.log(response.data);
        setUser(result.user);
        const idToken = await result.user.getIdToken();
        axios.defaults.headers.common['Authorization'] = idToken;
      })
      .catch((error: FirebaseError) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            addAlert(`Email address already in use.`, 'error', 3000);
            break;
          case 'auth/invalid-email':
            addAlert(`Email address is invalid.`, 'error', 3000);
            break;
          case 'auth/operation-not-allowed':
            addAlert(`Error during sign up.`, 'error', 3000);
            break;
          case 'auth/weak-password':
            addAlert(
              'Password is not strong enough. Add additional characters including special characters and numbers.',
              'error',
              3000
            );
            break;
          default:
            break;
        }
        if (error.message === 'Firebase: Error (auth/email-already-in-use).')
          addAlert('Email already in use', 'error', 3000);
      })
      .finally(() => setLoading(false));
    return stripeId;
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        setUser(result.user);
        const idToken = await result.user.getIdToken();
        axios.defaults.headers.common['Authorization'] = idToken;
        router.push('/');
      })
      .catch((error: FirebaseError) => {
        // throw new Error(error.message);
        if (error.message === 'Firebase: Error (auth/wrong-password).')
          addAlert('Invalid email or password', 'error', 3000);
      })
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);

    signOut(auth)
      .then(async () => {
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      })
      .catch((error) => setError(error.message))
      .finally(() => {
        setLoading(false);
      });
  };
  const memoedValue = useMemo(
    () => ({
      user,
      logout,
      registerWithEmail,
      signInWithEmail,
      error,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, error, loading]
  );
  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
