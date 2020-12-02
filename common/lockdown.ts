import { DateTime, Duration } from 'luxon';

export type LockdownStatus = {
  lockdown: boolean
  duration?: Duration
}

const isAgeExcludedFromLockdown = (age: number, time = DateTime.local()): boolean => false;

const getLockdownStart = (age: number, time = DateTime.local()): DateTime => time.set({ hour: age < 20 ? 16 : age >= 65 ? 13 : 21 }).startOf('hour');

const getLockdownEnd = (age: number, time = DateTime.local()): DateTime => time.set({ hour: age < 20 ? 13 : age >= 65 ? 10 : 5 }).startOf('hour');

const getLockdownStatus = (age: number, lockdownStart: DateTime, lockdownEnd: DateTime, time = DateTime.local()): LockdownStatus => {
  const isAgeExcluded = isAgeExcludedFromLockdown(age, time);
  const lockdown = isAgeExcluded ? false : time >= lockdownStart || time < lockdownEnd;
  let duration = undefined;
  if (!isAgeExcluded) {
    if (!lockdown) {
      duration = lockdownStart.diff(time, ['hours', 'minutes']);
    } else {
      if (time > lockdownEnd) {
        duration = lockdownEnd.plus({ day: 1 }).diff(time, ['hours', 'minutes', 'seconds']);
      } else {
        duration = lockdownEnd.diff(time, ['hours', 'minutes', 'seconds']);
      }
    }
  }

  return {
    lockdown,
    duration,
  };
};

export const Lockdown = {
  status: (birthYear: number, hasWorkPermit: boolean): Readonly<LockdownStatus> => {
    const localTime = DateTime.local()
    const age = localTime.year - birthYear;
    const status = getLockdownStatus(age, getLockdownStart(age, localTime), getLockdownEnd(age, localTime), localTime);

    return Object.freeze({ ...status, lockdown: !hasWorkPermit && status.lockdown });
  },
};