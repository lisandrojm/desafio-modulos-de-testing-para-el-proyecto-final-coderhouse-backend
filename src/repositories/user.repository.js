/* ************************************************************************** */
/* /src/repositories/users.repository.js */
/* ************************************************************************** */

const { User } = require('../models/users');
const UserDTO = require('../dao/DTOs/user.dto');
const BaseRepository = require('./base.repository');
const CurrentDTO = require('../dao/DTOs/current.dto');
class UsersRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /* Custom findUserById para que haga el populate correctamente en el metodo getProducts\
  de handlebarsServices */
  findUserById = async (id, populateOptions = {}) => {
    try {
      const item = await this.model.findById(id).populate(populateOptions).exec();
      if (!item) {
        /*         console.log(`${this.model.modelName} not found in repository`); */
        return null;
      }
      /*       console.log(`${this.model.modelName}Repository findById running`); */
      return item;
    } catch (error) {
      throw error;
    }
  };

  /* Custom createUser para aplicar DTO en la cracion del usuario  de handlebarsServices */
  createUserDTO = async (user) => {
    try {
      const userDTO = new UserDTO(user); // Utiliza UserDTO para estructurar los datos del usuario
      /*       console.log('UserDTO created:', userDTO); */
      const newUser = new User(userDTO);

      const savedUser = await newUser.save();
      /*       console.log('DTO createUserDTO running', savedUser); */
      return savedUser;
    } catch (error) {
      throw error;
    }
  };

  getUserWithCurrentDTO = async (user) => {
    try {
      const currentDTO = new CurrentDTO(user);
      return currentDTO;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UsersRepository;
