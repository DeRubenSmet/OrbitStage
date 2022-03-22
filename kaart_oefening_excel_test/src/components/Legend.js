
export const Legend = ({ legendItems, title, style, itemStyle }) => {
    return <div style={style} id="state-legend" className="legend">
    <h4>{title}</h4>
    {legendItems.map(legendItem =>
        <div key={legendItem.bgColor}>
            <div style={{ backgroundColor: legendItem.bgColor, ...itemStyle }}></div>{legendItem.label}
        </div>
    )}
  </div>
}