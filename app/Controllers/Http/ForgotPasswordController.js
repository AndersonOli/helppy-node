'use strict'

const { randomBytes } = require('crypto');
const { promisify } = require('util');
const User = use('App/Models/User');
const Database = use ('Database');
const Hash = use('Hash')
const nodeoutlook = require('nodejs-nodemailer-outlook');

class ForgotPasswordController {
  async update( {request } ){
    const { token, password } = request.only(['token', 'password']);
    
    const id = await Database.select('user_id').first().where('token','=', token).from('tokens');
    
    const test = await User.query().where('id', '=',  id.user_id).update({
      password: await Hash.make(password)
    });
    
    await Database.where('user_id', '=', id.user_id).delete().from('tokens');
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
    await nodeoutlook.sendEmail({
      auth: {
          user: "helppy19@hotmail.com",
          pass: "wYloHW*^"
      },
      from: 'helppy19@hotmail.com',
      to: email,
      subject: 'Recuperação da senha do Helppy-19',
      html: 
`<body 
  style="@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200&display=swap');
    font-family: 'Nunito Sans', sans-serif;
    display: flex;align-items: center; 
    margin: 0;margin: auto;
    width: 50%
">
         
  <div 
    style="background-color: #555555; 
      opacity: 90%;
      margin: auto;
      width: 100%;
      margin: 10px 10px 10px 10px;
      border-radius: 8px; padding: 8px 8px 8px 8px;
      -webkit-box-shadow: 5px 5px 8px 1px rgba(161,161,161,1);
      box-shadow: 5px 5px 8px 1px rgba(161,161,161,1);
  ">
    
    <h2 
      style="color:#E5E5E5;
        text-align: center;
    "> 
      Olá ${user.full_name},
    </h2>
          
    <p 
      style="color:#E5E5E5;
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 14px;
    ">
      Parece que você solicitou uma recuperação da sua senha, use o código abaixo no seu app caso queira continuar: 
    </p>
          
    <div 
      style="background-color: #0049FF;
        border-radius: 8px;
        padding: 1% 2%;
        margin: 0;
        margin: auto;
        width: 50%;
        max-width: 20%;
        margin-bottom: 30px;
        text-align: center;
    "> 
    
    <p style="color:#E5E5E5; 
      font-weight: bold;
      font-size: large;
      letter-spacing: 3px
    ">
      ${token}
    </p> 
  </div>
          
  <strong style="color:#E5E5E5; font-size: 14px"> Caso não tenha sido você quem fez a solicitação, por favor descarte esse e-mail.</strong> <br>
  <strong style="color:#E5E5E5; font-size: 14px"> Não responda esse e-mail !!! <strong> 
</div>`,
      onError: (e) => console.log(e),
      onSuccess: (i) => console.log(i)
    })
  }
}


module.exports = ForgotPasswordController
