import { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Alert } from '@/types';

interface IAlert {
  alerts: Alert[];
  addAlert: (msg: string, type: string, timeout: number) => void;
  showModal: boolean;
  setUpgradeModal: () => void;
  closeUpgradeModal: () => void;
}

export const AlertContext = createContext<IAlert>({
  alerts: [],
  addAlert: () => {
    //add alert
  },
  showModal: false,
  setUpgradeModal: () => {
    // show modal
  },
  closeUpgradeModal: () => {
    // close modal
  },
});

type AlertStateProps = {
  children: React.ReactNode;
};
const AlertState = ({ children }: AlertStateProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showModal, setShowModal] = useState(false);

  const addAlert = (msg: string, type: string, timeout = 3000) => {
    const id = uuidv4();
    setAlerts([...alerts, { msg, type, id }]);
    setTimeout(() => {
      const newAlerts = alerts.filter((alert) => alert.id === id);
      setAlerts(newAlerts);
    }, timeout);
  };

  const setUpgradeModal = () => {
    setShowModal(true);
  };

  const closeUpgradeModal = () => {
    setShowModal(false);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        showModal,
        setUpgradeModal,
        closeUpgradeModal,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertState;
