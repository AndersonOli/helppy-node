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
      'house_number', 
      'reference', 
      'type_account']);
      
    const user = await User.create(data);
    
    return user;
  }
  
  async authenticate( { request, auth } ) { 
    const { email, password } = request.all();
    
    const id = await Database.select('id').from('users').whereIn("email", [email]);
    const token_user = await auth.attempt(email, password);
    
    const user_id = id[0].id;
    const token = token_user.token;
    
    return {token, user_id}
  }
}
module.exports = AuthController
