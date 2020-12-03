import React, { ReactNode, useEffect, useState } from 'react';
import { DateTime, DateTimeFormatOptions } from 'luxon';
import { isServerRendered } from '@common/helpers';

type Props = {
  readonly format?: DateTimeFormatOptions
  readonly children: (formattedTime: string) => ReactNode
}

const initialTime = DateTime.local().startOf('minute');

const Clock = ({ children, format = DateTime.TIME_24_WITH_SECONDS }: Props) => {
  const [localTime, setLocalTime] = useState(initialTime);

  useEffect(() => {
    if (!isServerRendered()) {
      const interval = setInterval(() => setLocalTime(DateTime.local()), 1000);
      setLocalTime(DateTime.local());
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      {children(localTime.toLocaleString(format))}
    </>
  );
};

export default Clock;
