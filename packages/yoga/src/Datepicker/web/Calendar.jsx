import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon, Text } from '@gympass/yoga';
import { ChevronLeft, ChevronRight } from '@gympass/yoga-icons';
import { oneOf, func, instanceOf, bool } from 'prop-types';
import _ from 'lodash';

const CalendarWrapper = styled.div`
  ${({
    theme: {
      yoga: { spacing },
    },
  }) => `
    padding: ${spacing.large}px;
  `}
`;

const DaysWrapper = styled.div`
  ${({
    theme: {
      yoga: { spacing },
    },
  }) => `
    display: flex;
    margin: ${spacing.small}px ${spacing.zero}px
  `}
`;

const Day = styled(Text.SectionTitle)`
  ${({
    theme: {
      yoga: { colors },
    },
  }) => `
    width: 40px;
    color: ${colors.medium};
    text-align: center;
  `}
`;

const getDayFieldColor = (selected, disabled, colors, aux) => {
  if (selected && !disabled) {
    return colors.white;
  }
  if (disabled) {
    return colors.text.disabled;
  }
  const currentDate = new Date();
  const { val, year, month } = aux;

  if (
    // if current date
    new Date(Date.UTC(year, month, val)).getTime() ===
    new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDay(),
      ),
    ).getTime()
  ) {
    return colors.primary;
  }

  return colors.stamina;
};

const toUTCDate = date => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  ).getTime();
};

const getDayFieldRadius = (aux, radii) => {
  const { val, startDate, endDate, year, month } = aux;
  const currentDate = new Date(Date.UTC(year, month, val))?.getTime();

  if (currentDate === toUTCDate(startDate) && endDate) {
    return `${radii.circle}px ${radii.sharp}px ${radii.sharp}px ${radii.circle}px`;
  }
  if (currentDate === toUTCDate(endDate) && startDate) {
    return `${radii.sharp}px ${radii.circle}px ${radii.circle}px ${radii.sharp}px`;
  }

  return radii.circle;
};

const DayField = styled.div`
  ${({
    selected,
    inRange,
    disabled,
    aux,
    theme: {
      yoga: {
        colors,
        radii,
        spacing,
        components: { datepicker },
      },
    },
  }) => `
    p {
        color: ${getDayFieldColor(selected, disabled, colors, aux)};
        z-index: 1;
    }
    width: ${datepicker.width.dayField}px;
    height: ${datepicker.width.dayField}px;
    padding: ${spacing.zero}px 19.35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${inRange ? colors.clear : colors.white};
    position: relative;
    cursor: pointer;
    ${
      selected && inRange
        ? `border-radius: ${getDayFieldRadius(aux, radii)}`
        : ``
    }
    ${
      selected && !disabled
        ? `&:before {
            content: '';
            position: absolute;
            background: ${colors.vibin};
            width: ${datepicker.width.dayField}px;
            height: ${datepicker.width.dayField}px;
            border-radius: ${radii.circle}px;
        }`
        : ``
    }
`}
`;

const Row = styled.div`
  ${({
    theme: {
      yoga: { radii, spacing },
    },
  }) => `
    display: flex;
    div:first-child {
        border-radius: ${radii.regular}px 0 0 ${radii.regular}px;
    }
    div:last-child {
        border-radius: 0 ${radii.regular}px ${radii.regular}px 0;
    }
    padding: ${spacing.xxxsmall}px 0px;
`}
`;

const Calendar = ({
  type,
  startDate,
  endDate,
  onSelectSingle,
  onSelectRange,
  disablePastDates,
  disableFutureDates,
}) => {
  const [month, setMonth] = useState(new Date().getUTCMonth());
  const [year, setYear] = useState(new Date().getUTCFullYear());

  useEffect(() => {
    if (startDate) {
      setMonth(startDate.getUTCMonth());
      setYear(startDate.getUTCFullYear());
    }
  }, [startDate]);

  const getDayOfWeek = day => {
    return new Date(Date.UTC(year, month, day)).getUTCDay();
  };

  const getDaysInMonth = () => {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  };

  const getDaysInMonthBefore = () => {
    return new Date(Date.UTC(year, month, 0)).getUTCDate();
  };

  const toUTCDateDay = day => {
    return new Date(Date.UTC(year, month, day)).getTime();
  };

  const isEqual = day => {
    return (
      (startDate && toUTCDate(startDate) === toUTCDateDay(day)) ||
      (endDate && toUTCDate(endDate) === toUTCDateDay(day))
    );
  };

  const inRange = day => {
    return (
      startDate &&
      toUTCDate(startDate) <= toUTCDateDay(day) &&
      endDate &&
      toUTCDate(endDate) >= toUTCDateDay(day)
    );
  };

  const isDisabled = day => {
    const local = new Date(Date.UTC(year, month, day));
    const now = new Date();
    const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    const pastDatesDisabled = disablePastDates && local.getTime() < nowUTC;
    const futureDateDisabled = disableFutureDates && local.getTime() > nowUTC;

    return pastDatesDisabled || futureDateDisabled;
  };

  const onClick = day => {
    const selectedDate = new Date(Date.UTC(year, month, day));

    if (
      isDisabled(day) ||
      (startDate && selectedDate.getTime() === toUTCDate(startDate))
    )
      return;

    if (type === 'single') {
      onSelectSingle(selectedDate);
    } else if (type === 'range') {
      onSelectRange(selectedDate);
    }
  };

  const getFirstWeek = () => {
    const day = getDayOfWeek(1);
    let week = _.range(1, 7 - day + 1);
    const lastDayBefore = getDaysInMonthBefore();
    const daysBefore = [];

    for (let i = lastDayBefore - (day - 1); i <= lastDayBefore; i += 1) {
      daysBefore.push(i);
    }
    week = _.concat(daysBefore, week);
    return week.map(val => {
      return (
        <DayField
          key={val}
          disabled={val > 7 || isDisabled(val)}
          selected={isEqual(val)}
          onClick={() => val <= 7 && onClick(val)}
          inRange={type === 'range' && val <= 7 && inRange(val)}
          aux={{ val, startDate, endDate, year, month }}
        >
          <Text.Small>{val}</Text.Small>
        </DayField>
      );
    });
  };

  const getMiddleWeeks = () => {
    const day = getDayOfWeek(1);
    let firstDay = 7 - day + 1;
    const weeks = [];

    while (firstDay + 7 <= getDaysInMonth()) {
      weeks.push(_.range(firstDay, firstDay + 7));
      firstDay += 7;
    }
    return weeks.map((week, i) => {
      const days = week.map(val => {
        return (
          <DayField
            selected={isEqual(val)}
            onClick={() => onClick(val)}
            inRange={type === 'range' && inRange(val)}
            key={val}
            disabled={isDisabled(val)}
            aux={{ val, startDate, endDate, year, month }}
          >
            <Text.Small>{val}</Text.Small>
          </DayField>
        );
      });

      /* eslint-disable-next-line react/no-array-index-key */
      return <Row key={i}>{days}</Row>;
    });
  };

  const getLastWeek = () => {
    const lastDay = getDaysInMonth();
    const day = getDayOfWeek(lastDay);
    let week = _.range(lastDay - day, lastDay + 1);

    week = _.concat(week, _.range(1, 7 - day));
    return week.map(val => {
      return (
        <DayField
          key={val}
          disabled={val < 7 || isDisabled(val)}
          selected={isEqual(val)}
          onClick={() => val > 7 && onClick(val)}
          inRange={type === 'range' && val > 7 && inRange(val)}
          aux={{ val, startDate, endDate, year, month }}
        >
          <Text.Small>{val}</Text.Small>
        </DayField>
      );
    });
  };

  const getDays = () => {
    return (
      <>
        <Row>{getFirstWeek()}</Row>
        {getMiddleWeeks()}
        <Row>{getLastWeek()}</Row>
      </>
    );
  };

  const prior = () => {
    let local = month - 1;

    if (local < 0) {
      local = 11;
      setYear(year - 1);
    }
    setMonth(local);
  };

  const next = () => {
    let local = month + 1;

    if (local > 11) {
      local = 0;
      setYear(year + 1);
    }
    setMonth(local);
  };

  return (
    <CalendarWrapper>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Icon
          style={{ cursor: 'pointer' }}
          as={ChevronLeft}
          width="28"
          height="28"
          onClick={prior}
          fill="primary"
        />
        <Text style={{ alignSelf: 'center' }}>
          {new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
          }).format(new Date(year, month, 1, 0, 0, 0))}
        </Text>
        <Icon
          style={{ cursor: 'pointer' }}
          as={ChevronRight}
          width="28"
          height="28"
          onClick={next}
          fill="primary"
        />
      </div>
      <DaysWrapper>
        <Day>S</Day>
        <Day>M</Day>
        <Day>T</Day>
        <Day>W</Day>
        <Day>T</Day>
        <Day>F</Day>
        <Day>S</Day>
      </DaysWrapper>
      <div>{getDays()}</div>
    </CalendarWrapper>
  );
};

Calendar.propTypes = {
  type: oneOf(['single', 'range']).isRequired,
  startDate: instanceOf(Date),
  endDate: instanceOf(Date),
  onSelectSingle: func,
  onSelectRange: func,
  disablePastDates: bool,
  disableFutureDates: bool,
};

Calendar.defaultProps = {
  startDate: undefined,
  endDate: undefined,
  onSelectSingle: null,
  onSelectRange: null,
  disablePastDates: false,
  disableFutureDates: false,
};

export default Calendar;
