'use strict'

const List = use('App/Models/List');
const { isPointWithinRadius, getDistance } = require('geolib');
const Database = use('Database');
const axios = require('axios');

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

    var getToken = await Database
    .select('token_notification')
    .where('id', '=', params.user_id)
    .from('users');

    var userToken = getToken[0]['token_notification'];

    const fcmURL = 'https://fcm.googleapis.com/fcm/send'
    const fcmKey = 'AAAA2pGGVAY:APA91bGyyYd-_HQphI7aOcQED1ZGpTZ8J_pRzKEjSd-ZUWFUk3rGSc4FH-D5wsm-_ToxAm6IbpASFzuBgTw8otUH_w75XRIx0XEK2kh9nxDBJhZ1pIEjt9lagmamX-e7GEcrd2sMkC2s'
    
    function buildRequest (notification) {
      return {
        url: fcmURL,
        method: 'post',
        headers: {
          "Content-Type":"application/json",
          "Authorization":`key=${fcmKey}`
        },
        data: notification
      }
    }

    function buildNotification(title, text, userToken) {
      return {
        "notification": {
          "title": title,
          "text": text
        },
        "to": userToken,
        "priority": "high"
      }
    }

    function sendNotification(notification) {
      const request = buildRequest(notification)
      axios(request);
    }

    if(status == '1'){
      sendNotification(buildNotification("Seu pedido foi aceito por " + acceptName, "Tente entrar em contato com o voluntário pelo contato, e siga as recomendações de segurança ao receber as compras.", userToken));
    } else if(status == '2') {
      sendNotification(buildNotification("Seu pedido foi finalizado por " + acceptName, "Se isto é um engano, entre em contato com o suporte!", userToken));
    }

    return auth.id;
  }

}

module.exports = AcceptRequestController
