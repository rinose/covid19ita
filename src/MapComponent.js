
import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster';

require('react-leaflet-markercluster/dist/styles.min.css'); 

const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


export default class MapComponent extends Component {

  constructor() {
    super()
    this.state = {
      lat: 43.1957631,
      lng: 9.1060115,
      zoom: 6,
      data: []
    }
  }


  render() {
    const position = [this.state.lat, this.state.lng]
    const data = this.props.data;


    return (
      <div id={this.props.id} className="leafletContainer">
      <Map center={position} zoom={this.state.zoom} className="markercluster-map" maxZoom="12">
      <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
        {data.map(rec => {
          const icon = rec.outcome === 'died' || rec.outcome === 'death' ? redIcon : greenIcon;
          return(
            <Marker
              key={rec.ID}
              icon={icon}
              position={[rec.latitude, rec.longitude]}
            >
              <Popup>
                {
                Object.keys(rec).map( key => {
                  const isUrl = validURL(rec[key]);
                  const val = isUrl ? <a target="_blank" href={rec[key]}>Link</a> : rec[key];
                  return(
                  <div key={key}>{key} = {val}</div>
                  )
                })
                }
              </Popup>
            </Marker>)
          }
        )}
        </MarkerClusterGroup>
      </Map>
      </div>
    )
  }
}