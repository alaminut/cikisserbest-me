import { DateTime, Duration } from 'luxon';

export type LockdownStatus = {
  lockdown: boolean
  duration?: Duration
}

const isAgeExcludedFromLockdown = (age: number, time = DateTime.local()): boolean => false;

const getLockdownStart = (age: number, time = DateTime.local()): DateTime => time.set({ hour: age < 20 ? 16 : age >= 65 ? 13 : 21 }).startOf('hour');

const getLockdownEnd = (age: number, time = DateTime.local()): DateTime => time.set({ hour: age < 20 ? 13 : age >= 65 ? 10 : 5 }).startOf('hour');

const getLockdownStatus = (ageGroupExcluded: boolean, lockdownStart: DateTime, lockdownEnd: DateTime, time = DateTime.local()): LockdownStatus => {
  const lockdown = ageGroupExcluded ? false : time >= lockdownStart || time < lockdownEnd;
  let duration = undefined;
  if (!ageGroupExcluded) {
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
    const localTime = DateTime.local();
    const age = localTime.year - birthYear;
    const status = getLockdownStatus(isAgeExcludedFromLockdown(age, localTime), getLockdownStart(age, localTime), getLockdownEnd(age, localTime), localTime);

    return Object.freeze({ ...status, lockdown: !hasWorkPermit && status.lockdown });
  },
  logistics: (type: 'basic' | 'entertainment'): Readonly<LockdownStatus> => {
    const localTime = DateTime.local();
    const isWeekend = localTime.weekday > 5;
    const lockdownStart = localTime.set({ hour: isWeekend ? 17 : 21 }).startOf('hour');
    const lockdownEnd = localTime.set({ hour: isWeekend ? 10 : 5 }).startOf('hour');

    switch (type) {
      case 'basic':
        return getLockdownStatus(false, lockdownStart, lockdownEnd, localTime);
      case 'entertainment':
        return {
          lockdown: true,
        };
    }
  },
};
