'use strict'

const List = use("App/Models/List");
const { getDistance } = require('geolib');


class AcceptRequestController {
  async index ( { request } ) {
    const {lat1, long1, lat2, long2} = request.all();
    
    return getDistance({ latitude: lat1, longitude: long1 }, { latitude: lat2, longitude: long2 })
  }

  async update ({ request, params }) {
    const {accept_by, accept_by_id, status } = request.all();
     await List.query()
      .where('user_id', '=' , params.user_id)
      .where('id', '=' , params.id)
      .update({
        accept_by: accept_by,
        accept_by_id: accept_by_id,
        status: status
    });
  }

}

module.exports = AcceptRequestController
