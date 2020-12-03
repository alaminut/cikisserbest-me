import React, { useEffect, useState } from 'react';
import { Grid, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { CancelOutlined, CheckCircleOutlined, TimerOutlined } from '@material-ui/icons';
import { common, green, red } from '@material-ui/core/colors';
import { LockdownStatus } from '@common/lockdown';
import ErrorBoundary from '@components/error-boundary/error-boundary';
import Timer from '@components/time-ticker/timer';

type Props = {
  readonly title: string
  readonly subtitle?: string
  readonly statusChecker: () => LockdownStatus
}

const StatusRow = ({ title, subtitle, statusChecker }: Props) => {
  const [status, setStatus] = useState(statusChecker());
  const [timerColor, setTimerColor] = useState<string>(common.white);

  useEffect(() => {
    setTimerColor(status.lockdown ? red[500] : green[500]);
  }, [status]);

  useEffect(() => {
    const interval = setInterval(() => setStatus(statusChecker()), 1000);
    return () => clearInterval(interval);
  }, [statusChecker]);

  return (
    <ListItem divider>
      <ErrorBoundary>
        <ListItemIcon>
          {!status.lockdown && <CheckCircleOutlined htmlColor={green[500]} />}
          {status.lockdown && <CancelOutlined htmlColor={red[500]} />}
        </ListItemIcon>
        <ListItemText primary={title} secondary={subtitle} />
        <ListItemSecondaryAction>
          <Timer duration={status.duration} paused>
            {(time) => (
              <Grid container direction='row' alignItems='center' spacing={2}>
                <Grid item><span style={{ color: timerColor }}>{time}</span></Grid>
                <Grid item>
                  <TimerOutlined fontSize='inherit' htmlColor={timerColor} />
                </Grid>
              </Grid>
            )}
          </Timer>
        </ListItemSecondaryAction>
      </ErrorBoundary>
    </ListItem>
  );
};

export default StatusRow;
