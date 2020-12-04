import React, { ReactNode, useEffect, useState } from 'react';
import { DateTime, DateTimeFormatOptions } from 'luxon';

type Props = {
  readonly format?: DateTimeFormatOptions
  readonly children: (formattedTime: string) => ReactNode
}

const Clock = ({ children, format = DateTime.TIME_24_WITH_SECONDS }: Props) => {
  const [localTime, setLocalTime] = useState<DateTime>();

  useEffect(() => {
    const interval = setInterval(() => setLocalTime(DateTime.local()), 1000);
    setLocalTime(DateTime.local());
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {localTime && children(localTime.toLocaleString(format))}
    </>
  );
};

export default Clock;
