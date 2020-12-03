import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { Block, CheckCircleOutline } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { LockdownStatus } from '@common/lockdown';
import { makeStyles } from '@material-ui/core/styles';
import Timer from '@components/time-ticker/timer';

type Props = {
  readonly status: LockdownStatus
}

const useStyles = makeStyles({
  icon: {
    fontSize: '200px',
  },
  info: {
    fontSize: '48px',
  },
});

const StatusDisplay = ({ status }: Props) => {
  const styles = useStyles();

  return (
    <Grid container spacing={1} direction='column' alignItems='center'>
      <Grid item xs={12}>
        {!status.lockdown &&
        <CheckCircleOutline htmlColor={green['500']} className={styles.icon} />}
        {status.lockdown && <Block color='error' className={styles.icon} />}
        <Typography component='p' align='center'>
          <Timer duration={status.duration}>
            {(time) => <><b>Kalan süre:&nbsp;</b>{time}</>}
          </Timer>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {!status.lockdown &&
        <Typography component='p' align='center' className={styles.info}>Sokağa çıkabilirsiniz.</Typography>}
        {status.lockdown &&
        <Typography component='p' align='center' className={styles.info}>Sokağa çıkamazsınız.</Typography>}
      </Grid>
    </Grid>
  );
};

export default StatusDisplay;
