'use strict'
const User = use('App/Models/User');
const Database = use('Database')

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
      'token_notification'
      ]);
    const user = await User.create(data);
    return user;
  }
  
  async authenticate( { request, auth } ) { 
    const { email, password, token_notification } = request.all();
    
    const data = await Database.select('id')
      .select('type_account')
      .select('full_name')
      .select('status_account')
      .from('users').
      whereIn("email", [email]);

      console.log(data);
    
    
    const token_user = await auth.attempt(email, password);

    console.log(token_user);

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
