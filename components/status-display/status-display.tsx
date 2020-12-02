import React from 'react';
import Grid from '@material-ui/core/Grid';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import green from '@material-ui/core/colors/green';
import BlockIcon from '@material-ui/icons/Block';
import Typography from '@material-ui/core/Typography';
import { LockdownStatus } from '../../common/lockdown';
import { makeStyles } from '@material-ui/core/styles';
import TimeTicker from '../time-ticker/ticker';

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
    <Grid container spacing={1} direction="column" alignItems="center">
      <Grid item xs={12}>
        {!status.lockdown &&
        <CheckCircleOutlineIcon htmlColor={green['500']} className={styles.icon} />}
        {status.lockdown && <BlockIcon color="error" className={styles.icon} />}
        <Typography component="p" align="center">
          <TimeTicker title="Kalan süre" duration={status.duration} />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {!status.lockdown &&
        <Typography component="p" align="center" className={styles.info}>Sokağa çıkabilirsiniz.</Typography>}
        {status.lockdown &&
        <Typography component="p" align="center" className={styles.info}>Sokağa çıkamazsınız.</Typography>}
      </Grid>
    </Grid>
  );
};

export default StatusDisplay;