'use strict'
const User = use('App/Models/User');
const Database = use('Database');
const Unirest = require('unirest');

class AuthController {
  async register( { request } ) {
  
    const data = request.only([
      'full_name', 
      'email', 
      'password', 
      'telephone', 
      'cep', 
      'address', 
      'latitude',
      'longitude',
      'house_number', 
      'reference', 
      'type_account',
      'token_notification',
      'profile_picture'
      ]);
      
      const picture = data.profile_picture; 
 
      function getLink(){
        return new Promise((resolve,reject) => {
        Unirest.post('https://api.imgur.com/3/image')
        .headers({'Authorization': 'Client-ID 55ee05a412c4bae'})
        .field('image', `${picture}`)
        .end(function (response) {
          if(response.error){return reject(error)}
            return resolve(response.body); 
          });
        })
      }
      let linkPicture;
      await getLink().then((body) => linkPicture = body.data.link);
    
      data.profile_picture = linkPicture
      
      const user = await User.create(data);
      return user;
  }
    
    
  async updateProfile( {request, auth} ) {
  
    const { 
    email, 
    telephone,
    cep, 
    address, 
    latitude,
    longitude,
    house_number, 
    reference,
    profile_picture } = request.all(); 
    
    
    function getLink(){
      return new Promise((resolve,reject) => {
      Unirest.post('https://api.imgur.com/3/image')
      .headers({'Authorization': 'Client-ID 55ee05a412c4bae'})
      .field('image', `${profile_picture}`)
      .end(function (response) {
        if(response.error){return reject(error)}
          return resolve(response.body); 
        });
      })
    }
    let linkPicture;
    await getLink().then((body) => linkPicture = body.data.link);
  
    
    await Database
      .where('id','=',auth.user.id).update({
      email: email,
      telephone: telephone,
      cep: cep,
      address: address,
      latitude: latitude,
      longitude: longitude,
      house_number: house_number,
      reference: reference,
      profile_picture: linkPicture
      })
      .from('users')
  }
  
  
  async authenticate( { request, auth } ) { 
    const { email, password, token_notification } = request.all();
    
    const data = await Database.select('id')
      .select('type_account')
      .select('full_name')
      .select('status_account')
      .from('users').
      whereIn("email", [email]);  
    const token_user = await auth.attempt(email, password);
    
    if(token_user.token.length > 0){
      var updateToken = await Database
      .table("users")
      .where('email', '=', email)
      .update('token_notification', token_notification)
      .from("users");
    }

    const user_id = data[0].id;
    const token = token_user.token;
    const type_account = data[0].type_account;
    const full_name = data[0].full_name
    const status_account = data[0].status_account
    
    return {token, user_id, type_account, full_name, status_account}
  }
}
module.exports = AuthController
