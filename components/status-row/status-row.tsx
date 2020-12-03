import React, { useEffect, useState } from 'react';
import { Grid, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { CancelOutlined, CheckCircleOutlined, TimerOutlined } from '@material-ui/icons';
import { green, red, common } from '@material-ui/core/colors';
import { LockdownStatus } from '@common/lockdown';
import Timer from '@components/time-ticker/timer';
import ErrorBoundary from '@components/error-boundary/error-boundary';

type Props = {
  readonly title: string
  readonly status: LockdownStatus
}

const StatusRow = ({ title, status }: Props) => {
  const [lockdown, setLockdown] = useState(status.lockdown);
  const [timerColor, setTimerColor] = useState<string>(common.white);

  useEffect(() => {
    setTimerColor(lockdown ? red[500] : green[500]);
  }, [lockdown]);

  return (
    <ListItem divider>
      <ErrorBoundary>
        <ListItemIcon>
          {!lockdown && <CheckCircleOutlined htmlColor={green[500]} />}
          {lockdown && <CancelOutlined htmlColor={red[500]} />}
        </ListItemIcon>
        <ListItemText>{title}</ListItemText>
        <ListItemSecondaryAction>
          <Timer duration={status.duration} onTimerEnd={() => setLockdown(ld => !ld)}>
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
