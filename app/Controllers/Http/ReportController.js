'use strict'

const Database = use('Database');
const Report = use('App/Models/Report')

class ReportController {
  async report( { params } ) { 
    const dataStatusAccount = await Database.select('status_account')
      .where('id', '=', params.id).from('users');
      
    await Database.select('status_account').where('id', '=', params.id).update({
      status_account: dataStatusAccount[0].status_account + 1
    }).from('users');
  }
  

  async analyze ({ request, auth }) {
    const data = request.only(['title','comment','reported_id','status_report']);
    
    data.user_id = auth.user.id
    
    const report  = await Report.create(data);
    
    return report;
  }
}

module.exports = ReportController
