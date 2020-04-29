'use strict'

const { findNearest, getPreciseDistance } = require('geolib');
 
class GeolocalizationController {
  getDistance( {request} ) {
    const { latitude, longitude } = request.all();
    const localization = findNearest({latitude, longitude}, [
      {  latitude: 52.516272, longitude: 13.377722  },   
      {  latitude: 51.515,    longitude: 7.453619   },   
      {  latitude: 51.503333, longitude: - 0.119722 },   
      {  latitude: 55.751667, longitude: 37.617778  },   
      {  latitude: 48.8583,   longitude: 2.2945     },   
      {  latitude: 59.3275,   longitude: 18.0675    },   
      {  latitude: 59.916911, longitude: 10.727567  },
      ]);
      
      return getPreciseDistance({latitude, longitude}, localization);
  }
}

module.exports = GeolocalizationController
