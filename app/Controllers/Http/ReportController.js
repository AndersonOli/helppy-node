'use strict'

const Database = use('Database')
const Report = use('App/Models/Report');

class ReportController {
  async report( { params } ) { 
    const dataStatusAccount = await Database.select('status_account')
      .where('id', '=', params.id).from('users');
      
    await Database.select('status_account').where('id', '=', params.id).update({
      status_account: dataStatusAccount[0].status_account + 1
    }).from('users');
  }
  

  async analyze ({ request, auth }) {
    const { title, comment, reported_id, status_report, id_list } = request.all();
    
    const user_id = auth.user.id
    
    const report  = await Report.create({
    title: title, 
    comment: comment,
    reported_id: reported_id,
    status_report: status_report,
    user_id: user_id
    });
    
    const list = await Database.where('id', '=', id_list)
    .update({
    status: '2'
    }).from('lists');
  }
}

module.exports = ReportController
