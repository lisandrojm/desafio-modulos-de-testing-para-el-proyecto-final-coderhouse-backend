/* ************************************************************************** */
/* /src/components/roles/rolesController.js - controlador de roles. */
/* ************************************************************************** */

const rolesServices = require('../rolesServices/rolesServices');

class RolesController {
  getAdmin = async (req, res) => {
    return await rolesServices.getAdmin(req, res);
  };

  getUser = async (req, res) => {
    return await rolesServices.getUser(req, res);
  };
}

module.exports = new RolesController();
