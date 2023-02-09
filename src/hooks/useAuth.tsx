import axios, { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth, db } from '@/lib/firebaseClient';

import authErrors from '@/constant/authErrors';
import { url } from '@/constant/url';
import { AlertContext } from '@/context/AlertState';

const provider = new GoogleAuthProvider();

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
  registerWithGoogle: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  error: string | null;
  loading: boolean;
  initialLoading: boolean;
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
  registerWithGoogle: async () => {
    //sign in with google popup
  },
  signInWithGoogle: async () => {
    //sign in with google popup
  },
  error: null,
  loading: false,
  initialLoading: true,
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
  const [error] = useState(null);
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
          // router.push('/login');
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
          subscription: {
            status: 'free user',
            planId: 'free',
            upgradedToTier2: false,
            upgradedToTier3: false,
            tokens: 5000,
          },
        });
        try {
          await axios.post(
            `${url}/api/crm/add-person`,
            {
              uid: result.user.uid,
              name: firstName + ' ' + lastName,
              personData: {
                Email: email,
                FirstName: firstName,
                LastName: lastName,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          await sendEmailVerification(result.user as User);
        } catch (error) {
          if (error instanceof AxiosError) {
            return;
          }
          return;
        }

        setUser(result.user);
        const idToken = await result.user.getIdToken();
        axios.defaults.headers.common['Authorization'] = idToken;
      })
      .catch((error: FirebaseError) => {
        addAlert(authErrors[error.code] as string, 'error', 5000);
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
        addAlert(authErrors[error.code] as string, 'error', 5000);
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
      .catch((error) =>
        addAlert(authErrors[error.code] as string, 'error', 5000)
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const registerWithGoogle = async (
    fromLogin?: boolean,
    result?: UserCredential
  ) => {
    setLoading(true);
    if (fromLogin && fromLogin === true && result) {
      const createCustomer = await axios.post(
        `${url}/api/payment/create-customer`,
        {
          email: result.user.email,
          name: result.user.displayName,
        }
      );
      const docRef = doc(db, `users/${result.user.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.data() != undefined) {
        return;
      }
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        stripeId: createCustomer.data.customer.id,
        subscription: {
          status: 'free user',
          planId: 'free',
          upgradedToTier2: false,
          upgradedToTier3: false,
          tokens: 5000,
        },
      });
      try {
        await axios.post(
          `${url}/api/crm/add-person`,
          {
            uid: result.user.uid,
            personData: {
              Email: result.user.email,
              Name: result.user.displayName,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        if (error instanceof AxiosError) {
          return;
        }
        return;
      }
    }
    let stripeId: null | string = null;
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        const docRef = doc(db, `users/${result.user.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.data() != undefined) {
          router.push('/');
          return;
        }
        if (
          result.user.metadata.creationTime !=
          result.user.metadata.lastSignInTime
        ) {
          addAlert('Account already registered', 'error', 3000);
          router.push('/');
          return;
        }
        if (
          result.user.metadata.creationTime ===
          result.user.metadata.lastSignInTime
        ) {
          const createCustomer = await axios.post(
            `${url}/api/payment/create-customer`,
            {
              email: result.user.email,
              name: result.user.displayName,
            }
          );
          stripeId = createCustomer.data.customer.id;
          await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            stripeId: createCustomer.data.customer.id,
          });
          try {
            await axios.post(
              `${url}/api/crm/add-person`,
              {
                uid: result.user.uid,
                personData: {
                  Email: result.user.email,
                  Name: result.user.displayName,
                },
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
          } catch (error) {
            if (error instanceof AxiosError) {
              return;
            }
            return;
          }
        }
        setUser(result.user);
        const idToken = await result.user.getIdToken();
        axios.defaults.headers.common['Authorization'] = idToken;
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          addAlert(authErrors[error.code] as string, 'error', 5000);
        }
        return;
      })
      .finally(() => setLoading(false));
    if (stripeId != null) {
      return stripeId;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        if (
          result.user.metadata.creationTime ===
          result.user.metadata.lastSignInTime
        ) {
          await registerWithGoogle(true, result);
          router.push('/');
          return;
        }
        setUser(result.user);
        const idToken = await result.user.getIdToken();
        axios.defaults.headers.common['Authorization'] = idToken;
        router.push('/');
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          setLoading(false);
          addAlert(authErrors[error.code] as string, 'error', 5000);
        }
      })
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user,
      logout,
      registerWithEmail,
      signInWithEmail,
      registerWithGoogle,
      signInWithGoogle,
      error,
      loading,
      initialLoading,
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
