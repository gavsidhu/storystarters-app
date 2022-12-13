import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

interface IRegisterFlow {
  priceId: string;
  setPriceId: Dispatch<SetStateAction<string>>;
}

const RegisterFlowContext = createContext<IRegisterFlow>({
  priceId: '',
  setPriceId: () => {
    //Change price Id
  },
});

interface RegisterFlowProviderProps {
  children: React.ReactNode;
}

export const RegisterFlowProvider = ({
  children,
}: RegisterFlowProviderProps) => {
  const [priceId, setPriceId] = useState('');

  const memoedValue = useMemo(
    () => ({
      priceId,
      setPriceId,
    }),
    [priceId]
  );
  return (
    <RegisterFlowContext.Provider value={memoedValue}>
      {children}
    </RegisterFlowContext.Provider>
  );
};

export default function useRegisterFlow() {
  return useContext(RegisterFlowContext);
}
