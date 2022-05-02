
const getTime = (range: number, months: number, startDate: Date) => {
  const start = new Date(startDate);
    start.setMonth(start.getMonth() - 1);
    start.setDate(start.getDate() + 1);
    let dateStart = start.getTime();
    start.setMonth(start.getMonth() + months);
    let dateEnd = start.getTime();
    let date = dateStart + ((dateEnd - dateStart) / 500) * range;   
    return new Date(date);

  };

  export default getTime;