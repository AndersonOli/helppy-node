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
      'type_account']);
      
    const user = await User.create(data);
    
    return user;
  }
  
  async authenticate( { request, auth } ) { 
    const { email, password } = request.all();
    
    const data = await Database.select('id').select('type_account').select('full_name').from('users').whereIn("email", [email]);
    
    
    const token_user = await auth.attempt(email, password);
    
    const user_id = data[0].id;
    const token = token_user.token;
    const type_account = data[0].type_account;
    const full_name = data[0].full_name
    
    return {token, user_id, type_account, full_name}
  }
}
module.exports = AuthController
