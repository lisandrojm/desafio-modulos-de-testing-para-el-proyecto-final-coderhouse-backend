/* ************************************************************************** */
/* /src/components/roles/rolesServices/rolesServices.js - servicio de roles. */
/* ************************************************************************** */

class RolesServices {
  getAdmin = async (req, res) => {
    try {
      return res.status(200).json({ success: true, message: 'Si estas viendo esto es porque eres Admin registrado' });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error en getAdmin',
        message: 'Se produjo un error al procesar la solicitud.',
      });
    }
  };

  getUser = async (req, res) => {
    try {
      return res.status(200).json({ success: true, message: 'Si estás viendo esto es porque eres un User registrado.' });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error en getUser',
        message: 'Se produjo un error al procesar la solicitud.',
      });
    }
  };
}

module.exports = new RolesServices();
