
import React, { Component } from 'react'
import Tabletop from 'tabletop';
import _ from 'lodash'
import MapComponent from './MapComponent'
import DVoronoiComponent from './DVoronoiComponent';
import EchartComponent from './EchartComponent';



function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


export default class Dashboard extends Component {

  constructor() {
    super()
    this.state = {
      data: [],
      jsonData: {},
      loadingData: false
    }
  }

  createJson(data) {
    var d = {};
    var dataObject = {};
    d["dataObject"] = dataObject;

    dataObject["groups"] = [];
    data.forEach( (val) => {
      var region = _.find(dataObject["groups"], { 'label': val.region});
      if(_.isUndefined(region)) {
        region = {
          "label": val.region,
          "groups": []
        };
        dataObject["groups"].push(region);
      }
      var province = _.find(region["groups"], { 'label': val.province});
      if(_.isUndefined(province)) {
        province = {
          "label": val.province,
          "groups": []
        };
        region["groups"].push(province);
      }
      var cityName = val.city === "" ? "Sconosciuta" : val.city;
      var city = _.find(province["groups"], { 'label': cityName});
      if(_.isUndefined(city)) {
        city = {
          "label": cityName,
          "groups": []
        };
        province["groups"].push(city);
      }
      val.label = cityName + "( ID " + val.ID + ")";
      city["groups"].push(val);
    });
    return d;
  }

  componentDidMount() {
    this.setState({
      loadingData: true
    });
    Tabletop.init({
      key: '1VBBw8glg6kDM03vm094SqENWRImr8DZfMwh1gH2TYy0',
      callback: googleData => {
        this.setState({
          loadingData: false,
          data: googleData,
          jsonData: this.createJson(googleData)
        })
      },
      simpleSheet: true
    })
  }

  jumpTo(name){
    window.location.href = "#" + name;
    /*var top = document.getElementById("others-charts-button").offsetTop;
    window.scrollTo(0, top);*/
  }
  render() {
    const { data, jsonData, loadingData } = this.state;
    var regionsData = {};
    var regionsForDayData = {};
    var sexChartOptions = {};
    if (data.length > 0) {
      const regions = _.map(jsonData.dataObject.groups, (val) => { return val.label});
      const regionCount = _.map(regions, (region) => { return  _.filter(data, function(o) { if (o.region === region) return o }).length});
      const groupByDay = _.groupBy(data, "date_confirmation");
      const days = _.sortBy(_.keys(groupByDay), (day) => { return _.toNumber(_.replace(day.split("").reverse().join(""), ".", ""))});
      const regionsForDay = _.map(regions, (region) => { return {
        name: region,
        type:"line", 
        data: _.map(days, (day) => { return _.filter(data, function(val) { if (val.region === region && val.date_confirmation === day) return val }).length})
      }});
      const groupBySex = _.groupBy(data, "sex");
      const countSex = _.map(groupBySex, (v) => {return {"value": v.length, "name": v[0].sex === "" ? "Sconociuto" : v[0].sex}});
      regionsData = {
        legend: {
          right: 20,
          top: 40
        },
        xdata: regions,
        series:  [{
          name: "Totale contagiati Covid-19 Ita",
          type: "bar",
          data: regionCount
        }]
      }
      regionsForDayData = {
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 20,
          top: 40,
          bottom: 20,
          data: regions
        },
        xdata: days,
        series: regionsForDay
      }
      sexChartOptions = {
        legend: {
          right: 20,
          top: 40
        },
        xdata: _.keys(groupBySex),
        series: [{
          name: "Totale Contagiati per Sesso",
          type: "pie",
          data: countSex
        }]
      }
    }
    return (
      <div className="dashboard">
        {loadingData &&
        <div>Caricamento dati in corso...</div>
        }
        {data.length > 0 &&
        (
          <div>
            <div id="menu">
              <button onClick={() => this.jumpTo("map")}>Mappa</button>
              <button onClick={() => this.jumpTo("piechart-container")}>Totale per regione</button>
              <button onClick={() => this.jumpTo("regiondaybyday-container")}>Gorno per giorno</button>
              <button onClick={() => this.jumpTo("sex-chart-container")}>Sesso</button>
            </div>
            <MapComponent 
              id="map"
              data={data}
            />
            <EchartComponent 
            containerId="piechart-container"
            title="Totale Contagiati per Regione"
            options={regionsData}
            />
            <EchartComponent 
            containerId="regiondaybyday-container"
            title="Contagiati per Regione giorno per giorno"
            options={regionsForDayData}
            />
            <EchartComponent 
            containerId="sex-chart-container"
            title="Contagiati per Sesso"
            options={sexChartOptions}
            />
          </div>
        )
        }
        {false &&
          <DVoronoiComponent 
              data={jsonData}
          />
        }
      </div>
    )
  }
}