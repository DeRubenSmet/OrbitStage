import { useEffect, useState } from "react";

const Labels = ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  let dateStart = new Date(startDate);
  dateStart = new Date(
    new Date(dateStart.setMonth(dateStart.getMonth() - 1)).setDate(
      dateStart.getDate() + 1
    )
  );
  let dateEnd = new Date(endDate);
  dateEnd = new Date(
    new Date(dateEnd.setMonth(dateEnd.getMonth() - 1)).setDate(
      dateEnd.getDate() + 1
    )
  );
  let dayDifference =
    (dateEnd.getTime() - dateStart.getTime()) / (1000 * 3600 * 24);
  const [months, setMonths] = useState(Array());
  const [years, setYears] = useState(Array());
  let yearsLength = dayDifference / 365;
  let monthsLength = 10;
  // if (dayDifference < 32) {
  //   monthsLength = 0;
  // } else if (dayDifference <= 731) {
  //   monthsLength = 510;
  // }
  // else if(dayDifference)
  interface MonthType {
    month: string;
    range: number;
  }

  interface YearType {
    year: string;
    range: number;
  }

  const Year = (years: YearType) => {
    const { year, range } = years;

    return (
      <div
        style={{
          width: 10,
          marginRight: range - 10,
        }}
      >
        {year}
      </div>
    );
  };

  const Month = (months: MonthType) => {
    const { month, range } = months;

    return (
      <div
        style={{
          width: 5,
          marginRight: range - 3,
          //borderLeft: '3px dotted green'
        }}
      >
        {month}
      </div>
    );
  };
  useEffect(() => {
    if (years.length < yearsLength) {
      for (let i = 0; i < yearsLength; i++) {
        years.push({
          year: new Date(
            new Date(dateStart).setFullYear(
              dateStart.getFullYear() + (dayDifference / 365 / yearsLength) * i
            )
          ).toLocaleString("nl-BE", { year: "numeric" }),
          index: i,
          range: 500 / yearsLength,
        });
      }
    }
    if (months.length < monthsLength) {
      for (let i = 0; i < monthsLength; i++) {
        months.push({
          month: new Date(
            new Date(dateStart).setMonth(
              dateStart.getMonth() +
                (dayDifference / 30.41 / (monthsLength - 1)) * i
            )
          )
            .toLocaleString("nl-BE", { month: "short" })
            .split(".")[0],
          index: i,
          range: 500 / 10,
        });
      }
    }
    console.log(yearsLength);
  }, [startDate, endDate]);
  // if (dayDifference < 32) {
  //   return <></>;
  // } else
  if (dayDifference > 732) {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-around",
            alignItems: "flex-end",
            bottom: 35,
            left: 4,
            position: "absolute",
          }}
        >
          {years.map((year) => (
            <Year key={Math.random()} {...year} />
          ))}
        </div>
      </>
    );
  } else if (dayDifference < 367) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-around",
          alignItems: "flex-end",
          bottom: 35,
          left: 8,
          position: "absolute",
        }}
      >
        {months.map((month) => (
          <Month key={Math.random()} {...month} />
        ))}
      </div>
    );
  } else {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-around",
            alignItems: "flex-end",
            bottom: 35,
            left: 8,
            position: "absolute",
          }}
        >
          {months.map((month) => (
            <Month key={Math.random()} {...month} />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-around",
            alignItems: "flex-end",
            bottom: 10,
            left: 4,
            position: "absolute",
          }}
        >
          {years.map((year) => (
            <Year key={Math.random()} {...year} />
          ))}
        </div>
      </>
    );
  }
};

export default Labels;
