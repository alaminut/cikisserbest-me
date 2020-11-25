import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BlockIcon from '@material-ui/icons/Block';
import green from '@material-ui/core/colors/green';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { DateTime, Duration } from 'luxon';
import { GetStaticProps } from 'next';

type FormData = {
  year: number
  isWorking: boolean
}

type Props = {
  readonly dt: number
}

type Allowance = {
  isAllowed: boolean
  timeUntilFree?: Duration
  timeUntilLockdown?: Duration
}

const useStyles = makeStyles({
  container: {
    padding: '10px',
  },
  timer: {
    margin: '5px 0',
  },
  icon: {
    fontSize: '200px',
  },
  info: {
    fontSize: '48px',
  },
});

function isInFreeHours(birthYear: number, isWorking: boolean): Allowance {
  const localTime = DateTime.local();
  const age = localTime.year - birthYear;
  const isWeekday = localTime.weekday <= 5;
  const isAgeExcluded = isWeekday && age >= 20 && age < 65;

  const freeTimeStart = localTime.set({ hour: age < 20 ? 13 : 10 }).startOf('hour');
  const freeTimeEnd = localTime.set({ hour: age < 20 ? 16 : age >= 65 ? 13 : 20 }).startOf('hour');
  const timeUntilFree = freeTimeStart.diff(localTime, ['hours', 'minutes', 'seconds']);
  const timeUntilLockdown = freeTimeEnd.diff(localTime, ['hours', 'minutes', 'seconds']);

  const isFreeHours = isAgeExcluded ? true : localTime >= freeTimeStart && localTime < freeTimeEnd;

  return {
    isAllowed: isWorking || isFreeHours,
    timeUntilFree: isAgeExcluded || timeUntilFree.hours <= 0 ? undefined : timeUntilFree,
    timeUntilLockdown: isAgeExcluded || timeUntilLockdown.hours <= 0 ? undefined : timeUntilLockdown,
  };
}

export default function Home({ dt }: Props) {
  const { register, errors, handleSubmit } = useForm<FormData>();
  const [localTime, setLocalTime] = useState<DateTime>(DateTime.fromMillis(dt));
  const [allowance, setAllowance] = useState<Allowance | null>(null);
  const styles = useStyles();

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(DateTime.local());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = (data: FormData) => {
    setAllowance(isInFreeHours(data.year, data.isWorking));
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Typography component="h1" variant="h3" gutterBottom={true}>Şu anda sokağa çıkabilir misin hemen
        öğren</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField id="year"
                       name="year"
                       inputRef={register({ required: true, maxLength: 4, pattern: /[0-9]{4}/ })}
                       label="Doğum Yılı"
                       fullWidth
                       required
                       error={!!errors.year}
                       helperText={errors?.year ? 'Doğum yılınız 4 adet rakamdan oluşur.' : ''}
                       onChange={() => setAllowance(null)}
                       autoFocus />
            <FormControlLabel control={<Checkbox name="isWorking" inputRef={register} />} label="Çalışma belgem var" />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" color="primary" variant="contained" fullWidth>Öğren</Button>
          </Grid>
        </Grid>
      </form>
      <Typography component="div" className={styles.timer} align="right">Yerel
        saat: {localTime.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}</Typography>
      {!!allowance && allowance.timeUntilFree && (
        <Typography component="div" className={styles.timer} align="right">
          Sokağa çıkmanıza kalan süre: {allowance.timeUntilFree.toFormat('hh:mm')}
        </Typography>
      )}
      {!!allowance && allowance.timeUntilLockdown && (
        <Typography component="div" className={styles.timer} align="right">
          Yasağın başlamasına kalan süre: {allowance.timeUntilLockdown.toFormat('hh:mm')}
        </Typography>
      )}
      {!!allowance && (
        <Grid container spacing={1} direction="column" alignItems="center">
          <Grid item xs={12}>
            {allowance.isAllowed && <CheckCircleOutlineIcon htmlColor={green['500']} className={styles.icon} />}
            {!allowance.isAllowed && <BlockIcon color="error" className={styles.icon} />}
          </Grid>
          <Grid item xs={12}>
            {allowance.isAllowed &&
            <Typography component="p" align="center" className={styles.info}>Sokağa çıkabilirsiniz.</Typography>}
            {!allowance.isAllowed &&
            <Typography component="p" align="center" className={styles.info}>Şu anda sokağa çıkamazsınız.</Typography>}
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      dt: DateTime.local().toMillis(),
    },
  };
};
