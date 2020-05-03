'use strict'

const List = use('App/Models/List');
const { isPointWithinRadius } = require('geolib');
const Database = use('Database');

class AcceptRequestController {
  async index ( { request } ) {
    const {lat, long} = request.all();
    
    const coordinate = await Database.
      select('*')
      .where('type_account','=','0')
      .from('users')
    
    var array = []
    
    for (var i in coordinate) {
      const latitude = coordinate[i]['latitude'];
      const longitude = coordinate[i]['longitude'];
      
      if (isPointWithinRadius({latitude: lat,longitude: long}, {latitude: latitude, longitude:longitude}, 200)){ 
        const list = await Database
          .select('*')
          .where('user_id', '=', coordinate[i]['id'])
          .whereNot('status','=','2')
          .from('lists')
        array.push(list)
      }
    } 
    return array 
  }

  async update ({ request, auth }) {
    const { status } = request.all();
     await List.query()
      .update({
        accept_by: auth.user.accept_by,
        accept_by_id: auth.user.accept_by_id,
        status: status
    });
  }

}

module.exports = AcceptRequestController
