/* ************************************************************************** */
/* /src/components/mocking/mockingController/mockingController.js */
/* ************************************************************************** */

const MockingServices = require('../mockingServices/mockingServices');

class MockingController {
  addMocking = async (req, res) => {
    return await MockingServices.addMocking(res);
  };
}

module.exports = new MockingController();
