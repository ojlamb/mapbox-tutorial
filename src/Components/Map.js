/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import racks from '../data/bike_racks.json'
import neighborhoods from '../data/neighborhoods.json'
import { defaultMapStyle, circleLayer, fillLayer, setLayerStyle, generateMapStyle } from '../map';

const RACK_DATA = racks;
const NEIGHBORHOOD_DATA = neighborhoods;


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

  // Step 2 Add polygons before adding points
  _onMapLoad = () => {
    this.addPolys();
  };

  addPolys = () => {
    // Create a new fill layer style named hoodPolys
    const hoodPolys = setLayerStyle(fillLayer('polyOverlay', true), this.getPolyPaintProperties());
    // Add the neighborhood data to the hoodPolys style and generate the map style
    const mapStyle = generateMapStyle(defaultMapStyle, 'polyOverlay', NEIGHBORHOOD_DATA, hoodPolys);
    this.addPoints(mapStyle);
  }

  getPolyPaintProperties = () => ({
    'fill-color': '#000',
    'fill-opacity': .4,
    'fill-outline-color': '#FFF',
  });


  // Step 1, add points to the map
  addPoints = (style) => {
    const rackPoints = setLayerStyle(circleLayer('pointsOverlay', true), this.getPointPaintProperties());
    const mapStyle = generateMapStyle(style, 'pointsOverlay', RACK_DATA, rackPoints);
    this.setState({ mapStyle});
  }

  getPointPaintProperties = () => ({
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
