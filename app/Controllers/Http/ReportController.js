'use strict'

const Database = use('Database');

class ReportController {
  async update( { params } ) { 
    const dataStatusAccount = await Database.select('status_account')
      .where('id', '=', params.id).from('users');
      
    await Database.select('status-line').where('id', '=', params.id).update({
      status_account: dataStatusAccount[0].status_account + 1
    }).from('users');
  }
   
}

module.exports = ReportController
