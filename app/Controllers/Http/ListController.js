'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const List = use('App/Models/List');

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
  async index () {
    const list = await List.all();
    
    return list;
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
    const list = await List.findOrFail(params.id);
    
    return params;
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

  async update ({ params, request, response }) {
    const id_element = request.input('id_element');
    const title = request.input('title');
    const description = request.input('description');
    const shoppings = request.input('shoppings');
    
    let list = await List.find(params.id);
    
    list.id_element = id_element;
    list.title = title;
    list.description = description;
    list.shoppings = shoppings;
    
    await list.save();
    
    return response.json(contact);
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
