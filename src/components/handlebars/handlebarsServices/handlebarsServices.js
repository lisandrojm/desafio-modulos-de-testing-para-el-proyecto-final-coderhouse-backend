/* ************************************************************************** */
/* /src/components/handlebars/handlebarsServices/handlebarsServices.js -
Servicios de handlebars */
/* ************************************************************************** */

const ProductsServices = require('../../products/productsServices/productsServices');
/* const { Cart } = require('../../../models/carts'); */
/* const { User } = require('../../../models/users'); */
const Handlebars = require('handlebars');
/* Repository */
const { cartsServices, productsServices } = require('../../../repositories/index');
const { usersServices } = require('../../../repositories/index');

Handlebars.registerHelper('ifNotNull', function (value, options) {
  if (value !== null && value !== undefined) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

class HandlebarsServices {
  getLogin = async (res) => {
    try {
      return { success: true, title: 'Login', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getLogin');
    }
  };

  getRegister = async (res) => {
    try {
      return { success: true, title: 'Register', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getRegister');
    }
  };

  getRecovery = async (res) => {
    try {
      return { success: true, title: 'Recovery', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getRecovery');
    }
  };

  getUser = async (res) => {
    try {
      return { success: true, title: 'Profile', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getUser');
    }
  };

  getAdmin = async (res) => {
    try {
      return { success: true, title: 'Dashboard', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getAdmin');
    }
  };

  getCurrent = async (res) => {
    try {
      return { success: true, title: 'Current', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getCurrent');
    }
  };

  getProducts = async (limit, page, sort, query, res, userData) => {
    try {
      const products = await ProductsServices.getProducts(limit, page, sort, query, res);
      /* Repository */
      const user = await usersServices.findUserById(userData._id, { path: 'cart' });
      /*       console.log('~~~getProducts Populate userServices.findUserByID ~~~', user); */

      let totalCartProducts = 0;
      if (user && user.cart && user.cart.products) {
        totalCartProducts = user.cart.products.reduce((total, item) => total + item.quantity, 0);
      }

      const context = {
        success: true,
        title: 'Productos',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
        user: userData,
        totalCartProducts: totalCartProducts,
      };

      return context;
    } catch (error) {
      return res.sendServerError('Error Handlebars getProducts');
    }
  };
  getRealTimeProducts = async (limit, page, sort, query, res, userData) => {
    try {
      const products = await ProductsServices.getRealTimeProducts(limit, page, sort, query, res);

      let totalCartProducts = 0;

      const context = {
        success: true,
        title: 'Real Time Products',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
        user: userData,
        totalCartProducts: totalCartProducts,
      };

      return context;
    } catch (error) {
      return res.sendServerError('Error Handlebars getProducts');
    }
  };
  getTotalProducts = async () => {
    try {
      const totalProducts = await productsServices.countDocuments({});
      return totalProducts;
    } catch (error) {
      // Maneja el error de consulta de la base de datos si es necesario
      console.error('Error al obtener el total de productos:', error);
      return 0; // Puedes devolver un valor predeterminado en caso de error
    }
  };
  getAdminProducts = async (limit, page, sort, query, res, userData) => {
    try {
      const products = await ProductsServices.getAdminProducts(limit, page, sort, query, res);

      let totalCartProducts = 0;

      const context = {
        success: true,
        title: 'Admin | Productos',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
        user: userData,
        totalCartProducts: totalCartProducts,
      };

      return context;
    } catch (error) {
      return res.sendServerError('Error Handlebars getProducts');
    }
  };
  getHomeProducts = async (limit, page, sort, query, res, userData) => {
    try {
      const products = await ProductsServices.getHomeProducts(limit, page, sort, query, res);

      let totalCartProducts = 0;

      const context = {
        success: true,
        title: 'Home',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
        user: userData,
        totalCartProducts: totalCartProducts,
      };

      return context;
    } catch (error) {
      return res.sendServerError('Error Handlebars getProducts');
    }
  };

  getCartProductById = async (cid, res, userData) => {
    try {
      /* Repository */
      const cart = await cartsServices.findCartById(cid, { path: 'products.productId', select: '-__v' });
      /*       console.log('~~~getCartProductById Populate findById ~~~', cart); */
      const formattedCart = {
        _id: cart._id,
        products: cart.products.map((item) => ({
          productId: {
            _id: item.productId._id,
            title: item.productId.title,
            description: item.productId.description,
            code: item.productId.code,
            price: item.productId.price,
            stock: item.productId.stock,
            category: item.productId.category,
          },
          quantity: item.quantity,
        })),
      };

      let totalCartProducts = 0;
      if (formattedCart.products && formattedCart.products.length > 0) {
        totalCartProducts = formattedCart.products.reduce((total, item) => total + item.quantity, 0);
      }

      const context = {
        success: true,
        title: 'Carts',
        carts: [formattedCart],
        cartId: cid,
        style: 'index.css',
        user: userData,
        totalCartProducts: totalCartProducts, // Update the totalCartProducts value
      };

      return context;
    } catch (error) {
      return res.sendServerError('Error Handlebars getCartProductById');
    }
  };

  getChat = async (res) => {
    try {
      return { success: true, title: 'Chat', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getChat');
    }
  };

  getResetPassByEmail = async (res) => {
    try {
      return { success: true, title: 'Reset', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getReset');
    }
  };
  getResetPassExpiredToken = async (res) => {
    try {
      return { success: true, title: 'Expired link', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getReset');
    }
  };
  getResetPass = async (res) => {
    try {
      return { success: true, title: 'Reset', style: 'index.css' };
    } catch (error) {
      return res.sendServerError('Error Handlebars getReset');
    }
  };
}

module.exports = new HandlebarsServices();
