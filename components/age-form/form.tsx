import React from 'react';
import { Grid, TextField, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';

export type AgeFormData = {
  year: number
  isWorking: boolean
}

type Props = {
  readonly onSubmit: (data: AgeFormData) => void
  readonly onClear: () => void
}

const AgeForm = ({ onSubmit, onClear }: Props) => {
  const { register, errors, handleSubmit } = useForm<AgeFormData>();

  return (
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
                     onChange={() => onClear()}
                     autoFocus />
          <FormControlLabel control={<Checkbox name="isWorking" inputRef={register} />}
                            label="Çalışma belgem var" />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" color="primary" variant="contained" fullWidth>Öğren</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AgeForm;
