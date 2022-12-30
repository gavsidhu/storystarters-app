import { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Alert } from '@/types';

interface IAlert {
  alerts: Alert[];
  addAlert: (msg: string, type: string, timeout: number) => void;
}

export const AlertContext = createContext<IAlert>({
  alerts: [],
  addAlert: () => {
    //add alert
  },
});

type AlertStateProps = {
  children: React.ReactNode;
};
const AlertState = ({ children }: AlertStateProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (msg: string, type: string, timeout = 3000) => {
    const id = uuidv4();
    setAlerts([...alerts, { msg, type, id }]);
    setTimeout(() => {
      const newAlerts = alerts.filter((alert) => alert.id === id);
      setAlerts(newAlerts);
    }, timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;
