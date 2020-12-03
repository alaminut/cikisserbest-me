import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Duration } from 'luxon';
import { isServerRendered } from '@common/helpers';

type Props = {
  readonly duration: Duration | undefined
  readonly onTimerEnd?: () => void
  readonly formatString?: string
  readonly children: (timeString: string) => ReactNode
}

const Timer = ({ duration, onTimerEnd, children, formatString = 'hh:mm:ss' }: Props) => {
  const [internalDuration, setInternalDuration] = useState(duration);
  const intervalRef = useRef(0);

  useEffect(() => {
    if (!isServerRendered() && duration !== undefined) {
      setInternalDuration(duration);
      intervalRef.current = window.setInterval(() => setInternalDuration(d => d!.minus({ second: 1 })), 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [duration]);

  useEffect(() => {
    if (internalDuration !== undefined && internalDuration.valueOf() <= 0) {
      clearInterval(intervalRef.current);
      onTimerEnd && onTimerEnd();
    }
  }, [internalDuration]);

  return (
    <>{children(internalDuration === undefined ? '-' : internalDuration.toFormat(formatString))}</>
  );
};

export default Timer;
