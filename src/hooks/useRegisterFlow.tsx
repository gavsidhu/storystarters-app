import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

interface IRegisterFlow {
  priceId: string | null;
  setPriceId: Dispatch<SetStateAction<string | null>>;
}

const RegisterFlowContext = createContext<IRegisterFlow>({
  priceId: null,
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
  const [priceId, setPriceId] = useState<string | null>(null);

  const memoedValue = useMemo(
    () => ({
      priceId,
      setPriceId,
    }),
    [priceId, setPriceId]
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
