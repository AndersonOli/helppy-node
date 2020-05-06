'use strict'

const { randomBytes } = require('crypto');
const { promisify } = require('util');
const Mail = use('Mail');
const User = use('App/Models/User');
const Database = use('Database');

class ForgotPasswordController {
  async update( { request } ){
   const { token, password } = request.all();
    const tokenTable = await Database.select('user_id').first().where('token','=', token).from('tokens');
    
    const user = await User.query().where('id','=', tokenTable).update({
      password: password
    })
    
    return user;
  }
  
  async createToken () {
    const random = await promisify(randomBytes)(16); 
    const token = random.toString('hex');
    await user.tokens().create({
      token,
      type: 'forgotpassword'
    });
  }

  async store({ request }) {
    const { email } = request.all();
    const user = await User.findByOrFail('email', email);  
    const resetPasswordUrl = `http://127.0.0.1:3333/reset`;
    await Mail.send('emails.forgotpassword', { name: user.name, resetPasswordUrl }, (mensagem) => {
        mensagem
          .to(user.email)
          .from('halyssonpimentell@gmail.com')
          .subject('Helppy - Recuperação de senha')
    });
  }
  
}

module.exports = ForgotPasswordController
