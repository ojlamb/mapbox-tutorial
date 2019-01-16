/* global window */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import {defaultMapStyle, pointLayer} from '../map';

export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.785164,
        longitude: -122.4,
        zoom: 11,
        bearing: 0,
        pitch: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      defaultMapStyle: 'https://maps.tilehosting.com/styles/darkmatter/style.json?key=9MrAs6YoNahMQEbekVSc',
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
    this.setState({defaultMapStyle})
  }


  render() {

    const {viewport} = this.state;

    return (
      <MapGL
        ref={this._map}
        mapStyle={defaultMapStyle}
        {...viewport}
        onViewportChange={this._updateViewport}
        onLoad={this._onMapLoad}
      />
    );
  }

}

export default Map;
