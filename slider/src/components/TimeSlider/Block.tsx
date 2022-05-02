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
        maxWidth: "30px",
        backgroundColor: `${colorBlock}`,
        flex: 1,
        height: value,
        margin: "4px",
      }}
    ></div>
  );
};

export const getBlocks = (
  count: number,
  date: Date,
  state: { x: number; y: number; width: number; height: number }
) => {
  let blocks: BlockType[] = [];
  let colorBlock = "#D9D9D9";
  for (let i = 0; i < count; i++) {
    let x = 250 / count + (i * 510) / count;
    if (x > state.x && x < state.x + state.width) {
      colorBlock = "#00ACC1";
    } else {
      colorBlock = "#D9D9D9";
    }
    blocks.push({
      date: date,
      value: 70,
      index: i,
      colorBlock: `${colorBlock}`,
      x: x,
      state: state,
    });
  }

  return blocks;
};

export default Block;
