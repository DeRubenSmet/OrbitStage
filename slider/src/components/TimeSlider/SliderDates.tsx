import { isVisible } from "@testing-library/user-event/dist/utils";
import getTime from "./utils/time";

const SliderDates = ({
  x,
  width,
  startDate,
  endDate,
  widthTotal
}: {
  x: number;
  width: number;
  startDate: Date;
  endDate: Date;
  widthTotal: number
}) => {
  return (
    <div style={{ marginLeft: 10 }}>
      <p>
        <strong>Start: </strong>

        {getTime(x, startDate, endDate, widthTotal).toUTCString()}
      </p>
      <p>
        <strong>End: </strong>
        {getTime(x + width, startDate, endDate, widthTotal).toUTCString()}
      </p>
    </div>
  );
};

export default SliderDates;
