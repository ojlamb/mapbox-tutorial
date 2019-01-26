/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import racks from '../data/bike_racks.json'
import { defaultMapStyle, circleLayer, setLayerStyle, generateMapStyle } from '../map';

const RACK_DATA = racks;


export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 39.7392,
        longitude: -104.9903,
        zoom: 11,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      mapData: null,
      mapStyle: 'https://maps.tilehosting.com/c/bec3aee8-df86-4e99-92ec-887d03b00453/styles/basic-3a04a/style.json?key=9MrAs6YoNahMQEbekVSc',
      popupInfo: null
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this._map = React.createRef();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState(prevState => ({
      viewport: {
        ...prevState.viewport,
        width: window.innerWidth,
        height: window.innerHeight
      }
    }));
  }

  _updateViewport = (viewport) => {
    this.setState({ viewport });
  };


  _onMapLoad = () => {
    this.addPoints();
  };

  // Step 1: adding points to the map
  addPoints = () => {
    const rackPoints = setLayerStyle(circleLayer('pointsOverlay', true), this.getPaintProperties());
    const mapStyle = generateMapStyle(defaultMapStyle, 'pointsOverlay', RACK_DATA, rackPoints);
    this.setState({ mapStyle});
    console.log('updateMapStyle')
  }

  // Style using mapbox style spec https://docs.mapbox.com/mapbox-gl-js/style-spec
  getPaintProperties = () => ({
    'circle-color': '#6C2CDF',
    'circle-radius': 3,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#FFF'
  });

  render() {
    const {viewport, mapStyle} = this.state;

    return (
      <MapGL
        ref={this._map}
        mapStyle={mapStyle}
        {...viewport}
        onViewportChange={this._updateViewport}
        onLoad={this._onMapLoad}
      />
    );
  }

}

export default Map;
