import { isVisible } from "@testing-library/user-event/dist/utils";
import getTime from "./utils/time";

const SliderDates = ({
  x,
  width,
  startDate,
  endDate,
}: {
  x: number;
  width: number;
  startDate: Date;
  endDate: Date;
}) => {
  return (
    <div style={{ marginLeft: 10 }}>
      <p>
        <strong>Start: </strong>

        {getTime(x, startDate, endDate).toUTCString()}
      </p>
      <p>
        <strong>End: </strong>
        {getTime(x + width, startDate, endDate).toUTCString()}
      </p>
    </div>
  );
};

export default SliderDates;
