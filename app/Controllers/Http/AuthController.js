'use strict'
const User = use('App/Models/User');

class AuthController {
  async register( { request } ) {
    const data = request.only(['nome_completo', 'email', 'senha', 'telefone', 'cep', 'endereco', 'numero', 'referencia', 'tipo_conta']);
    
    const user = await User.create(data);
    
    return user;
  }
  
  async authenticate( { request, auth } ) {
    const { email, password } = request.all();
    const token = await auth.attempt(email, password);
  
    return token;
  }
  async revokeUserToken ({ auth }) {
    const user = auth.current.user
    const token = auth.getAuthHeader()

    await user
      .tokens()
      .where('token', token)
      .update({ is_revoked: true })
  }
}

module.exports = AuthController
