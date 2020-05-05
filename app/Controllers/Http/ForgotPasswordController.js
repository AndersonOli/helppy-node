'use strict'

const { randomBytes } = require('crypto');
const { promisify } = require('util');
const Mail = use('Mail');
const User = use('App/Models/User');

class ForgotPasswordController {
  async store({ request }) {
    const { email } = request.all();
    
    const user = await User.findByOrFail('email', email);
    
    const random = await promisify(randomBytes)(16); 
    const token = random.toString('hex');
    
    await user.tokens().create({
      user_id: user.id,
      token,
      type: 'forgotpassword'
    })
    
    await Mail.send('emails.forgotpassword', { name: user.name, token }, (mensagem) => {
        mensagem
          .to(user.email)
          .from('halyssonpimentell@gmail.com')
          .subject('Helppy - Recuperação de senha')
    });
  }
}

module.exports = ForgotPasswordController
