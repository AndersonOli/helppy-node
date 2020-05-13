'use strict'

const { randomBytes } = require('crypto');
const { promisify } = require('util');
const Mail = use('Mail');
const User = use('App/Models/User');
const Database = use ('Database');
const Hash = use('Hash')

class ForgotPasswordController {
  async update( {request } ){
    const { token, password } = request.only(['token', 'password']);
    
    const id = await Database.select('user_id').first().where('token','=', token).from('tokens');
    
    const test = await User.query().where('id', '=',  id.user_id).update({
      password: await Hash.make(password)
    });
    
    await Database.where('token', '=', token).delete().from('tokens');
  }

  async store({ request }) {
    const { email } = request.all();
    const user = await User.findByOrFail('email', email);   
    const random = await promisify(randomBytes)(3); 
    const token = random.toString('hex');
    await user.tokens().create({
      token,
      type: 'forgotpassword'
    });
    await Mail
        .connection('smtp')
        .send('emails.forgotpassword', { name: user.full_name, token }, (mensagem) => {
        mensagem
          .to(user.email)
          .from('developerscursos@gmail.com')
          .subject('Helppy - Recuperação de senha')
    });
  }
  
}

module.exports = ForgotPasswordController
