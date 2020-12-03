import React, { useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Lockdown, LockdownStatus } from '@common/lockdown';
import AgeForm, { AgeFormData } from '@components/age-form/form';
import StatusDisplay from '@components/status-display/status-display';
import Clock from '@components/time-ticker/clock';
import Dashboard from '@components/dashboard/dashboard';

const useStyles = makeStyles({
  container: {
    padding: '10px',
  },
  timer: {
    margin: '5px 0',
  },
});

export default function Home() {
  const [lockdownStatus, setLockdownStatus] = useState<LockdownStatus | null>(null);
  const styles = useStyles();

  const onSubmit = (data: AgeFormData) => {
    setLockdownStatus(Lockdown.status(data.year, data.isWorking));
  };

  return (
    <Container maxWidth='sm' className={styles.container}>
      <Typography component='h1' variant='h4' gutterBottom={true}>Şu anda sokağa çıkabilir misin?</Typography>
      <AgeForm onSubmit={onSubmit} onClear={() => setLockdownStatus(null)} />
      <Typography component='p' align='right' style={{ marginTop: '10px' }}>
        <Clock>
          {(timeString) => <><b>Yerel saat:&nbsp;</b>{timeString}</>}
        </Clock>
      </Typography>
      {!!lockdownStatus && <StatusDisplay status={lockdownStatus} />}
      <Dashboard />
    </Container>
  );
}
