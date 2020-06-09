'use strict'
const User = use('App/Models/User');
const Database = use('Database');
const Unirest = require('unirest');
const axios = require('axios');

class AuthController {
  async register( { request } ) {
    // first async
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
      let linkPicture = await this.getLink(data.profile_picture);  // another async 2°   
      data.profile_picture = linkPicture;
      // antes o 3° não espera o 2° acabar e o primeiro achava que tava tudo ok e retornava error
      const user = await User.create(data); // another async
      return user;
  }

  async getLink(picture) {
    return axios({
      url: "https://api.imgur.com/3/image",
      method: "post",
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Client-ID 55ee05a412c4bae"
      },
      data: picture
      }).then(function(response) {
        return response.data.data.link;
      }).catch(function(error) {
        return error;
    });
  }
  
  async index( { auth }){
    const user = await User.query().where('id','=',auth.user.id).fetch()
    return user
  }
    
    
  async updateProfile( {request, auth} ) {
  
    let { 
    email, 
    telephone,
    cep, 
    address, 
    latitude,
    longitude,
    house_number, 
    reference,
    profile_picture } = request.all(); 

    if(!(profile_picture.match("/http/") == -1)){
      let linkPicture = await this.getLink(profile_picture);      
      profile_picture = linkPicture;  
    }
    
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
      profile_picture: profile_picture
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
