import * as React from 'react';

function ControlPanel({ year, onChange }) {

  return (
    <div className="control-panel">
      <div key={'year'} className="input">
        <label>Year</label>      <span>
          {year}
        </span>
        <input
          type="range"
          value={year}
          min={2010}
          max={2020}
          step={1}
          onChange={evt => {
            console.log(Number(evt.target.value));
            onChange(Number(evt.target.value))
          }}
        />
      </div>
    </div>
  );
}

export default ControlPanel;