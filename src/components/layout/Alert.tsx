import { Alert as MuiAlert, AlertColor } from '@mui/material';
import { useContext } from 'react';

import { AlertContext } from '@/context/AlertState';

export default function Alert() {
  const alertContext = useContext(AlertContext);
  return (
    <>
      {alertContext.alerts?.length > 0 &&
        alertContext.alerts.map((alert) => {
          return (
            <div key={alert.id} className='fixed right-0 top-[4.5rem]'>
              <MuiAlert severity={alert.type as AlertColor}>
                {alert.msg}
              </MuiAlert>
            </div>
          );
        })}
    </>
  );
}
