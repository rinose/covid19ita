import React from 'react';
var echarts = require('echarts');

class EchartComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    const xdata = this.props.options.xdata;
    const series = this.props.options.series;
    var myChart = echarts.init(document.getElementById(this.props.containerId));
    myChart.setOption({
      toolbox: {
        feature: {
          saveAsImage: {
            title: "Salva grafico come immagine"
          }
        }
      },
      title: {
          text: this.props.title
      },
      legend: this.props.options.legend ? this.props.options.legend : {},
      tooltip: {},
      xAxis: {
          data: xdata
      },
      yAxis: {},
      series: series,
    });
  }

  render() {
    return (
      <div id={this.props.containerId}>
      </div>
    );
  }
}

export default EchartComponent;