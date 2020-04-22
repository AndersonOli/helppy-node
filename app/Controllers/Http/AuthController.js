'use strict'
const User = use('App/Models/User');

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
    const token = await auth.attempt(email, password);
    return token;
  }
}

module.exports = AuthController
