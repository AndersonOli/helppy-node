'use strict'

const List = use('App/Models/List');
const { isPointWithinRadius, getDistance } = require('geolib');
const Database = use('Database');
const https = require('https');

class AcceptRequestController {
  async index ( { request } ) {
    const {lat, long} = request.all();
    
    const coordinate = await Database.
      select('*')
      .where('type_account','=','1')
      .from('users');
    
    var array = [];

    for (var i in coordinate) {
      const latitude = coordinate[i]['latitude'];
      const longitude = coordinate[i]['longitude'];
      
      if (isPointWithinRadius({latitude: lat,longitude: long}, {latitude: latitude, longitude:longitude}, 5000)){ 
        const list = await Database
          .select('*')
          .where('user_id', '=', coordinate[i]['id'])
          .whereNot('status','=','2')
          .from('lists');
          array.push(list);
      }
    } 
    
    var viewlist = [];
    for (var i in array) {
      for(var j in array[i]) {
        viewlist.push(array[i][j]);
      }
    }
    
    return viewlist;
  }
  
  async getDistance( { request } ) {
    const {lat, long} = request.all();
    
    const coordinate = await Database.
      select('*')
      .where('type_account','=','1')
      .from('users');
    
    var viewDistance = [];

    for (var i in coordinate) {
      const latitude = coordinate[i]['latitude'];
      const longitude = coordinate[i]['longitude'];
      
      if (isPointWithinRadius({latitude: lat,longitude: long}, {latitude: latitude, longitude:longitude}, 5000)){ 
        
        viewDistance.push({id: coordinate[i]['id'],distance: getDistance({latitude: lat,longitude: long}, {latitude: latitude, longitude:longitude})});
      }
    } 
    return viewDistance;
  }
  
  async update ({ request, auth, params }) {
    const { acceptName, acceptId, status } = request.all();
     await List.query()
      .where('user_id', '=' , params.user_id)
      .where('id', '=' , params.id)
      .update({
        accept_by: acceptName,
        accept_by_id: acceptId,
        status: status
    });

    var getTokenNotification = await Database.select('token_notification').where('id', '=', params.user_id).from('users');

    var userTokenNotification = getTokenNotification[0]['token_notification'];

    var options = {
      hostname: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: { 'Authorization': "key=AAAA2pGGVAY:APA91bGyyYd-_HQphI7aOcQED1ZGpTZ8J_pRzKEjSd-ZUWFUk3rGSc4FH-D5wsm-_ToxAm6IbpASFzuBgTw8otUH_w75XRIx0XEK2kh9nxDBJhZ1pIEjt9lagmamX-e7GEcrd2sMkC2s" },
      json: {
        "notification": {
          "title": "Seu pedido foi aceito!", 
          "body": "Seu pedido foi aceito por tente entrar em contato com ele.",
        },
        "to": userTokenNotification
      }
    };

    const req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)
    
      res.on('data', d => {
        process.stdout.write(d)
      })
    });
    
    req.on('error', error => {
      console.error(error)
    });

    return auth.id;
  }

}

module.exports = AcceptRequestController
