/* ************************************************************************** */
/* /src/repositories/tickets.repository.js */
/* ************************************************************************** */

const { Ticket } = require('../models/tickets');
const BaseRepository = require('./base.repository');

class TicketsRepository extends BaseRepository {
  constructor() {
    super(Ticket);
  }
}

module.exports = TicketsRepository;
