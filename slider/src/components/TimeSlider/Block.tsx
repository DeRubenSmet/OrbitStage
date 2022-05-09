interface BlockType {
  date: Date;
  value: number;
  index: number;
  colorBlock: string;
  x: number;
  state: { x: number; y: number };
}

const Block = (block: BlockType) => {
  const { value, date, index, colorBlock } = block;

  return (
    <div
      className="blockSlider"
      //@ts-ignore
      // onMouseEnter={() => setStartDate(date.getMonth())}
      style={{

        backgroundColor: `${colorBlock}`,
        flex: 1,
        height: value,
        margin: "1px",
      }}
    ></div>
  );
};

export const getBlocks = (
  count: number,
  startDate: Date,
  endDate: Date,
  facts: { count: number; }[],
  state: { x: number; y: number; width: number; height: number }
) => {
  let amount = count;
  
  let dateStart = new Date(startDate);
  let dateEnd = new Date(endDate);
  dateStart.setMonth(dateStart.getMonth() - 1);
  dateStart.setDate(dateStart.getDate() + 1);
  dateEnd.setMonth(dateEnd.getMonth() - 1);
  dateEnd.setDate(dateEnd.getDate() + 1);
  // let dayDifference = (dateEnd.getTime() - dateStart.getTime()) / (1000*3600*24);
  let blocks: BlockType[] = [];
  let colorBlock = "#D9D9D9";
  // if (dayDifference < 32){
  //   amount = dayDifference;
  // } 
  for (let i = 0; i < amount; i++) {
    let factsCount = facts[i].count;
    let x = 250 / amount + (i * 510) / amount;
    if(factsCount < 10){
      factsCount = 7;
      colorBlock = "#F7D1C2";
    }
    else if (x > state.x && x < state.x + state.width) {
      colorBlock = "#00ACC1";
    } else {
      colorBlock = "#D9D9D9";
    }
    blocks.push({
      date: dateStart,
      value: factsCount,
      index: i,
      colorBlock: `${colorBlock}`,
      x: x,
      state: state,
    });
  }

  return blocks;
};

export default Block;
