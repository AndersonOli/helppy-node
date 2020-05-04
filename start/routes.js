'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/register', 'AuthController.register')
Route.post('/authenticate', 'AuthController.authenticate')
Route.post('/accept', 'AcceptRequestController.index').middleware(['auth'])
Route.post('/update/:user_id/:id', 'AcceptRequestController.update').middleware(['auth'])
Route.post('/distance', 'AcceptRequestController.getDistance').middleware(['auth'])

Route.group( () => {
  Route.resource('list', 'ListController').apiOnly();
}).middleware(['auth'])

