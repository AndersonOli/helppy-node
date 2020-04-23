'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const List = use('App/Models/List');
const Database = use('Database') 
/**
 * Resourceful controller for interacting with lists
 */
class ListController {
  /**
   * Show a list of all lists.
   * GET lists
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ( {response} ) {
    const list = await List.all(); 
    return response.json(list);
  }

  /**
   * Render a form to be used for creating a new list.
   * GET lists/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async store ({ request, auth }) {
    const data = request.only(['id_list', 'title', 'description', 'shoppings']);
    const list = await List.create({ user_id: auth.user.id, ...data });
    return list;
  }

  /**
   * Display a single list.
   * GET lists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    //Faz a busca de todos as listas de comprars de usuário passando na url qual usuário é
    const list = await List.query().where('user_id', '=', params.id).fetch();
    return list
  }

  /**
   * Render a form to update an existing list.
   * GET lists/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async update ({ request, params , auth }) {
    // Faz o update no usuário logado passando na url o id list
    const {title, description, shoppings} = request.all();
    const list = await List.query()
      .where('user_id', '=' , auth.user.id)
      .where('id_list', '=' , params.id)
      .update({
        title: title,
        description: description,
        shoppings: shoppings
    })
  }

  /**
   * Delete a list with id.
   * DELETE lists/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response}) {
    const list =  await List.findOrFail(params.id);
    if (list.user_id !==  auth.user.id) {
      return response.status(401)
    }
    await list.delete();
    
  }
}

module.exports = ListController
