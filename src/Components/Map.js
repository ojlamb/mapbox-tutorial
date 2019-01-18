/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import { fromJS } from 'immutable';
import * as turf from '@turf/turf';
import racks from '../data/bike_racks.json'
import neighborhoods from '../data/neighborhoods.json'
import {
  defaultMapStyle,
  circleLayer,
  fillLayer,
  lineLayer,
  setLayerStyle,
  generateMapStyle
} from '../map';

const RACK_DATA = racks;
const NEIGHBORHOOD_DATA = neighborhoods;


export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapStyle: 'https://maps.tilehosting.com/c/bec3aee8-df86-4e99-92ec-887d03b00453/styles/basic-3a04a/style.json?key=9MrAs6YoNahMQEbekVSc',
      viewport: {
        latitude: 39.7392,
        longitude: -104.9903,
        zoom: 11,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      clickedFeature: null,
      hoodRacks: null,
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
    this.addPolys();
  };

  addPolys = () => {
    const hoodPolys = setLayerStyle(fillLayer('polyOverlay', true), this.getPolyPaintProperties());
    const mapStyle = generateMapStyle(defaultMapStyle, 'polyOverlay', NEIGHBORHOOD_DATA, hoodPolys);
    this.addLines(mapStyle);
  }

  addLines = (style) => {
    const hoodOutline = setLayerStyle(lineLayer('polyLine', false), this.getLinePaintProperties());
    const mapStyle = generateMapStyle(style, 'polyLine', NEIGHBORHOOD_DATA, hoodOutline);
    this.addPoints(mapStyle);
  };

  addPoints = (style) => {
    const rackPoints = setLayerStyle(circleLayer('pointsOverlay', false), this.getPointPaintProperties());
    const mapStyle = generateMapStyle(style, 'pointsOverlay', RACK_DATA, rackPoints);
    this.setState({ mapStyle});
  };

  addHighlight = (geom) => {
    this.removeHighlight()
    let hoodHighlight = setLayerStyle(fillLayer('hoodHighlight', true), this.getHighlightPaintProperties());
    let mapStyle = generateMapStyle(this.state.mapStyle, 'hoodHighlight', geom, hoodHighlight);
    this.setState({mapStyle});
  };

  removeHighlight = () => {
    const { mapStyle } = this.state;
    if(mapStyle.hasIn(['sources','hoodHighlight'])) {
      const style = mapStyle.toJS();
      style.layers.pop();
      this.setState({mapStyle: fromJS(style)});
    }
  };

  getPolyPaintProperties = () => ({
    'fill-color': '#000',
    'fill-opacity': .4,
    'fill-outline-color': '#FFF',
  });

  getLinePaintProperties = () => ({
    'line-color': '#FFF',
    'line-width': 2,
  });


  getPointPaintProperties = () => ({
    'circle-color': '#6C2CDF',
    'circle-radius': 3,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#FFF'
  });

  getHighlightPaintProperties = () => ({
    'fill-color': '#FFFF00',
    'fill-opacity': .4,
    'fill-outline-color': '#FFF',
  });

  _onClick = event => {
    const {features, srcEvent: {offsetX, offsetY}} = event;
    const clickedFeature = features && features.find(f => f.layer.id === 'polyOverlay');
    this.setState({clickedFeature, x: offsetX, y: offsetY});
    this.queryFeatures();
  };

  queryFeatures = () => {
    const { geometry } = this.state.clickedFeature;
    const hoodRacks = turf.pointsWithinPolygon(RACK_DATA, geometry);
    this.addHighlight(geometry);
    this.setState({hoodRacks});
  }


  render() {

    const {viewport, mapStyle, hoodRacks, clickedFeature} = this.state;

    return (
      <div>
        <MapGL
          ref={this._map}
          mapStyle={mapStyle}
          {...viewport}
          onViewportChange={this._updateViewport}
          onLoad={this._onMapLoad}
          onClick={this._onClick}
        />
          <div style={{
              position:"absolute",
              zIndex: 1,
              width: 275,
              height: 150,
              left: 10,
              top: 10,
              fontSize: 13,
              fontWeight: 300,
              backgroundColor: '#FFF',
              padding: 20,
              paddingTop: 10,
              boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            }}>
              <h1>Denver Neighborhood Bike Racks</h1>
              {hoodRacks ?
                <div>
                  <p><b>{clickedFeature.properties.NBHD_NAME}</b></p>
                  <p>
                    <b>{hoodRacks.features.length}</b> bike racks
                  </p>
                </div>
                :
                <div>
                  <em>select a neighborhood</em>
                </div>
              }
            </div>
      </div>
    );
  }

}

export default Map;
