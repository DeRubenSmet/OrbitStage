
const getTime = (range: number, startDate: Date, endDate: Date, width: number): Date => {
  const start = new Date(startDate);
  const end = new Date(endDate);
    start.setMonth(start.getMonth() - 1);
    start.setDate(start.getDate() + 1);
    end.setMonth(end.getMonth() - 1);
    end.setDate(end.getDate() + 1);
    let dateStart = start.getTime();
    let dateEnd = end.getTime();
    let date = dateStart + ((dateEnd - dateStart) / width/510*510) * range;   
    return new Date(date);

  };

  export default getTime;