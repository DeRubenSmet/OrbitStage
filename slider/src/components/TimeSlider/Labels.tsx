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

  const Month = (months: MonthType) => {
    const { month, range } = months;

    return (
      
      <div
        style={{
          
          marginRight: range,
        }}
      >
        {month}
      </div>
    );
  };
  useEffect(() => {
    if (months.length !== monthsLength) {
      for (let i = 0; i < monthsLength; i++) {
        months.push({
          month: new Date(
            new Date(dateStart).setMonth(dateStart.getMonth() + dayDifference/30.41/(monthsLength - 1) * i)
          )
            .toLocaleString("nl-BE", { month: "short" })
            .split(".")[0],
          index: i,
          range: 508/((monthsLength + 2)) - 12
        });
      }{console.log(monthsLength)}
    }
  }, [startDate, endDate]);
  // if (dayDifference < 32) {
  //   return <></>;
  // } else 
  if (dayDifference <= 3000) {
    return (
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
        {months.map((month) => (
          <Month key={Math.random()} {...month} />
        ))}
      </div>
    );
  } else {
    return <></>;
  }
};

export default Labels;
