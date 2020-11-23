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
import { DateTime, Duration, Interval } from 'luxon';
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
}

const useStyles = makeStyles({
  container: {
    padding: '10px'
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
    const curfewStart = 20;
    const curfewEnd = 10;
    const localTime = DateTime.local();
    const age = DateTime.local().year - data.year;

    const isFreeHours = localTime.hour === curfewEnd ? localTime.minute > 0 : localTime.hour > curfewEnd && localTime.hour < curfewStart;
    const isAgeFreeHours = age < 20 || age >= 65 ? localTime.hour < 13 : isFreeHours;
    const isAllowed = data.isWorking || (isFreeHours && isAgeFreeHours);

    setAllowance({ isAllowed });
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
