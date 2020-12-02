import React, { useEffect, useState } from 'react';
import { DateTime, Duration } from 'luxon';
import { isServerRendered } from '../../common/helpers';

type Props = {
  readonly title?: string
  readonly duration?: Duration
}

const initialTime = DateTime.local().startOf('minute');

const TimeTicker = ({ duration, title }: Props) => {
  const [localTime, setLocalTime] = useState(initialTime);
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    if (!isServerRendered()) {
      const interval = setInterval(() => {
        setLocalTime(DateTime.local());
        setCountdown(ct => {
          if (!ct) return ct;
          if (ct.valueOf() <= 0) return Duration.fromMillis(0);
          return ct.minus({ second: 1 });
        });
      }, 1000);

      setLocalTime(DateTime.local());
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      {title && <b>{title}&nbsp;</b>}
      {countdown ? countdown.toFormat('hh:mm:ss') : localTime.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
    </>
  );
};
export default TimeTicker;