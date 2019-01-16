import { fromJS } from 'immutable';
import MAP_STYLE from './style.json';

export const defaultMapStyle = fromJS(MAP_STYLE);

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const fillLayer = (source, interactive) => fromJS({
  id: source,
  source,
  type: 'fill',
  interactive
});

export const circleLayer = (source, interactive) => fromJS({
  id: source,
  source,
  type: 'circle',
  interactive
});

export const lineLayer = (source, interactive) => fromJS({
  id: source,
  source,
  type: 'line',
  interactive
});

export const setLayerStyle = (layer, properties) => layer.set('paint', fromJS(properties));

export const generateMapStyle = (style, id, data, layer) => style
  .setIn(['sources', id], fromJS({
    type: 'geojson',
    data
  }))
  .set('layers', style.get('layers').push(layer));
