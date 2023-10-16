/* ************************************************************************** */
/* /src/repositories/messages.repository.js */
/* ************************************************************************** */

const { Message } = require('../models/messages');
const BaseRepository = require('./base.repository');

class MessagesRepository extends BaseRepository {
  constructor() {
    super(Message);
  }
}

module.exports = MessagesRepository;
