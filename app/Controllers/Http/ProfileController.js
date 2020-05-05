'use strict'

const Helpers = use('Helpers')

class ProfileController {
  async setFile ({ request }) {
    const profilePic = request.file('profile_pic', {
      types: ['image'],
      size: '2mb'
    });
    
    await profilePic.move(Helpers.tmpPath('uploads'), {
      name: 'custom-name.jpg',
      overwrite: true
    });
    
    if (!profilePic.moved()) {
      return profilePic.error()
    }
    return 'File moved'
  }
  async getFile ({ request }) {
      return {
        avatar: 'file|file_ext:png,jpg|file_size:2mb|file_types:image'
      }
  }
}

module.exports = ProfileController
