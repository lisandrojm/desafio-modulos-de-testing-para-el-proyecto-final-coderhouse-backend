/* ************************************************************************** */
/* /src/repositories/index.js */
/* ************************************************************************** */
const BaseRepository = require('../repositories/base.repository');
const CartsRepository = require('../repositories/carts.repository');
const MessagesRepository = require('../repositories/messages.repository');
const ProductsRepository = require('../repositories/products.repository');
const UsersRepository = require('../repositories/user.repository');
const TicketsRepository = require('../repositories/tickets.repository');

module.exports = {
  baseServices: new BaseRepository(),
  cartsServices: new CartsRepository(),
  messagesServices: new MessagesRepository(),
  productsServices: new ProductsRepository(),
  usersServices: new UsersRepository(),
  ticketsServices: new TicketsRepository(),
};
