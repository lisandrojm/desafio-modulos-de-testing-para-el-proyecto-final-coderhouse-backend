/* ************************************************************************** */
/* /src/components/carts/cartsServices/cartsServices.js - servicio de los carritos. */
/* ************************************************************************** */

/* Repository */
const { cartsServices } = require('../../../repositories/index');
const { productsServices } = require('../../../repositories/index');
const { ticketsServices } = require('../../../repositories/index');
const { Ticket } = require('../../../models/tickets');
const jwtUtils = require('../../../utils/jwt/jwt');
const { v4: uuidv4 } = require('uuid');
const MailManager = require('../../../utils/mailManager/mailManager');
const path = require('path');

class CartsServices {
  constructor() {
    this.initializeCartCollection();
  }

  initializeCartCollection = async () => {
    try {
      /* Repository */
      const cartCount = await cartsServices.countDocuments();
      /*       console.log('~~~CartCount~~~', cartCount); */
      if (cartCount === 0) {
        /* Repository */
        await cartsServices.create({ products: [] });
        /*         console.log('Colección "carts" inicializada correctamente'); */
      }
    } catch (error) {
      console.error('Error al inicializar la colección de carritos en la base de datos', error);
    }
  };

  getCarts = async (res) => {
    try {
      /* Repository */
      const carts = await cartsServices.findAll();
      const data = carts;
      return res.sendSuccess({
        payload: {
          message: 'Carritos enviados correctamente',
          data,
        },
      });
    } catch (error) {
      return res.sendServerError('Error al obtener los carritos');
    }
  };

  addCart = async (res) => {
    try {
      /* Repository */
      const newCart = await cartsServices.create({ products: [] });
      const data = newCart;
      return res.sendCreated({
        payload: {
          message: 'Nuevo carrito creado',
          data,
        },
      });
    } catch (error) {
      return res.sendServerError('Error al crear el carrito');
    }
  };

  getCartProductById = async (cid, res) => {
    try {
      /* Repository */
      const cart = await cartsServices.findById(cid, { path: 'products.productId' });
      /*       console.log('POPULATE', cart); */
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }
      const data = cart.products;
      return res.sendSuccess({
        payload: {
          message: 'Productos del carrito obtenidos correctamente',
          data,
        },
      });
    } catch (error) {
      return res.sendServerError('Error al obtener los productos del carrito');
    }
  };

  addProductToCart = async (cid, pid, quantity, res, req) => {
    try {
      const cart = await cartsServices.findById(cid);
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }

      const product = await productsServices.findById(pid);
      if (!product) {
        return res.sendNotFound('ID de Producto no encontrado');
      }
      const userData = req.session.user || req.user;

      if (userData && userData.role === 'premium' && product.owner === userData._id) {
        return res.sendServerError('No puedes agregar tu propio producto creado como owner premium al carrito creado ');
      }

      const productIndex = cart.products.findIndex((p) => p.productId.toString() === pid);
      if (productIndex === -1) {
        const newProduct = {
          productId: pid,
          quantity: quantity || 1,
        };
        cart.products.push(newProduct);
      } else {
        cart.products[productIndex].quantity += quantity || 1;
      }

      await cartsServices.save(cart);
      const data = cart;
      return res.sendSuccess({
        message: 'Producto agregado al carrito correctamente',
        payload: data,
      });
    } catch (error) {
      return res.sendServerError('Error al agregar el producto al carrito');
    }
  };
  deleteCart = async (cid, res) => {
    try {
      /* Repository */
      const cart = await cartsServices.findById(cid);
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }
      /* Repository */
      await cartsServices.deleteOne(cart);
      const data = cart;
      return res.sendSuccess({
        message: 'Carrito eliminado correctamente',
        payload: data,
      });
    } catch (error) {
      return res.sendServerError('Error al eliminar el carrito');
    }
  };

  deleteProductFromCart = async (cid, pid, res) => {
    try {
      /* Repository */
      const cart = await cartsServices.findById(cid);
      /*       console.log('cid', cid); */
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex((p) => p.productId.toString() === pid);
      if (productIndex === -1) {
        return res.sendNotFound('Producto no encontrado en el carrito');
      }

      cart.products.splice(productIndex, 1);
      /* Repository */
      await cartsServices.save(cart);
      const data = cart;
      return res.sendSuccess({
        message: 'Producto eliminado del carrito correctamente',
        payload: data,
      });
    } catch (error) {
      return res.sendServerError('Error al eliminar el producto del carrito');
    }
  };

  updateCart = async (cid, products, res) => {
    try {
      /* Repository */
      const cart = await cartsServices.findById(cid);
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }

      cart.products = products;
      /* Repository */
      await cartsServices.save(cart);
      const data = cart;
      return res.sendSuccess({
        message: 'Carrito actualizado correctamente',
        payload: data,
      });
    } catch (error) {
      return res.sendServerError('Error al actualizar el carrito');
    }
  };

  updateProductQuantity = async (cid, pid, quantity, res) => {
    try {
      /* Repository */
      const cart = await cartsServices.findById(cid);
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex((p) => p.productId.toString() === pid);
      if (productIndex === -1) {
        return res.sendNotFound('Producto no encontrado en el carrito');
      }

      cart.products[productIndex].quantity = quantity;
      /* Repository */
      return res.sendSuccess({
        message: 'Cantidad de producto actualizada correctamente',
        payload: data,
      });
    } catch (error) {
      return res.sendServerError('Error al actualizar la cantidad de producto en el carrito');
    }
  };

  deleteAllProductsFromCart = async (cid, res) => {
    try {
      /* Repository */
      const cart = await cartsServices.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true });
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }

      const data = cart;
      return res.sendSuccess({
        message: 'Todos los productos eliminados del carrito',
        payload: data,
      });
    } catch (error) {
      return res.sendServerError('Error al eliminar todos los productos del carrito');
    }
  };
  purchaseCart = async (cid, req, res) => {
    const ticketCode = uuidv4();
    try {
      const cart = await cartsServices.findById(cid);
      /*       console.log('purchaseCart del carrito', cart); */
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }

      const productsToPurchase = cart.products; // Productos en el carrito
      const productsNotPurchased = []; // Productos que no pudieron ser comprados

      // Verificar si no hay productos en el carrito
      if (productsToPurchase.length === 0) {
        return res.sendNotFound('No se encontraron productos en el carrito');
      }

      // Iterar sobre los productos en el carrito
      for (const productData of productsToPurchase) {
        const { productId, quantity } = productData;

        // Buscar el producto en la base de datos
        const product = await productsServices.findById(productId);

        // Verificar si el producto existe y tiene suficiente stock
        if (product && product.stock >= quantity) {
          // Restar la cantidad comprada al stock del producto
          product.stock -= quantity;
          await productsServices.save(product);
        } else {
          // Si no hay suficiente stock, agregarlo a la lista de no comprados
          productsNotPurchased.push(productId);
        }
      }

      /*       console.log('purchaseCart productsToPurchase', productsToPurchase); */
      /*       console.log('purchaseCart productsNotPurchased', productsNotPurchased); */

      // Extraer el token JWT de la cookie
      const jwtToken = req.cookies.jwt; // Asegúrate de haber configurado la cookie correctamente

      // Verificar y decodificar el token JWT para obtener la información del usuario
      let username = null;
      if (jwtToken) {
        const decodedToken = await jwtUtils.verify(jwtToken); // Verifica el token
        if (decodedToken) {
          username = decodedToken.email;
        }
      }

      // Si no hay token JWT o no se pudo decodificar, verifica si hay un usuario en la sesión
      if (!username && req.session.user) {
        username = req.session.user.email;
      }

      /*       console.log('~~~user email ~~~', username); */
      // Crear un ticket con los productos comprados
      const ticket = new Ticket({
        code: ticketCode,
        purchase_datetime: Date.now(),
        amount: productsToPurchase.length - productsNotPurchased.length,
        purchaser: username, // Utiliza el nombre de usuario extraído del token o la sesión
      });

      /*       console.log('~~~Ticket~~~', ticket); */
      await ticketsServices.create(ticket);
      // Actualizar el carrito con los productos no comprados
      cart.products = productsToPurchase.filter((productData) => productsNotPurchased.includes(productData.productId));

      await cartsServices.save(cart);

      if (productsNotPurchased.length === 0) {
        return res.sendSuccess({
          message: 'Compra exitosa. Todos los productos fueron comprados.',
          payload: {
            productsPurchased: productsToPurchase,
          },
        });
      } else {
        return res.sendSuccess({
          message: 'Compra parcial. Algunos productos no pudieron ser comprados.',
          payload: {
            productsNotPurchased,
          },
        });
      }
    } catch (error) {
      return res.sendServerError('Error al procesar la compra');
    }
  };

  purchaseCartMail = async (cid, req, res) => {
    const ticketCode = uuidv4();
    try {
      const cart = await cartsServices.findById(cid);
      /*       console.log('purchaseCart del carrito', cart); */
      if (!cart) {
        return res.sendNotFound('Carrito no encontrado');
      }

      const productsToPurchase = cart.products; // Productos en el carrito
      const productsNotPurchased = []; // Productos que no pudieron ser comprados

      // Verificar si no hay productos en el carrito
      if (productsToPurchase.length === 0) {
        return res.sendNotFound('No se encontraron productos en el carrito');
      }

      // Iterar sobre los productos en el carrito
      for (const productData of productsToPurchase) {
        const { productId, quantity } = productData;

        // Buscar el producto en la base de datos
        const product = await productsServices.findById(productId);

        // Verificar si el producto existe y tiene suficiente stock
        if (product && product.stock >= quantity) {
          // Restar la cantidad comprada al stock del producto
          product.stock -= quantity;
          await productsServices.save(product);
        } else {
          // Si no hay suficiente stock, agregarlo a la lista de no comprados
          productsNotPurchased.push(productId);
        }
      }

      /*       console.log('purchaseCart productsToPurchase', productsToPurchase); */
      /*       console.log('purchaseCart productsNotPurchased', productsNotPurchased); */

      // Extraer el token JWT de la cookie
      const jwtToken = req.cookies.jwt; // Asegúrate de haber configurado la cookie correctamente

      // Verificar y decodificar el token JWT para obtener la información del usuario
      let username = null;
      if (jwtToken) {
        const decodedToken = await jwtUtils.verify(jwtToken); // Verifica el token
        if (decodedToken) {
          username = decodedToken.email;
        }
      }

      // Si no hay token JWT o no se pudo decodificar, verifica si hay un usuario en la sesión
      if (!username && req.session.user) {
        username = req.session.user.email;
      }
      /*       console.log('~~~user email ~~~', username); */
      // Crear un ticket con los productos comprados
      const ticket = new Ticket({
        code: ticketCode,
        purchase_datetime: Date.now(),
        amount: productsToPurchase.length - productsNotPurchased.length,
        purchaser: username, // Utiliza el nombre de usuario extraído del token o la sesión
      });

      /*       console.log('~~~Ticket~~~', ticket); */
      await ticketsServices.create(ticket);
      // Actualizar el carrito con los productos no comprados
      cart.products = productsToPurchase.filter((productData) => productsNotPurchased.includes(productData.productId));

      await cartsServices.save(cart);
      // Construir el correo electrónico

      const emailContent = `
        <h1>Resultado de la compra</h1>
        <p>Ticket Code: ${ticketCode}</p>
        <p>Username: ${username}</p>
        <p>Total Products: ${productsToPurchase.length}</p>
        <p>Products Purchased: ${productsToPurchase.length - productsNotPurchased.length}</p>
        <p>Products Not Purchased: ${productsNotPurchased.length}</p>
        <!-- Agrega cualquier otra información que desees en el correo -->

        <!-- Ejemplo: Mostrar productos comprados -->
        <h2>Productos Comprados</h2>
        <ul>
          ${productsToPurchase.map((productData) => `<li>${productData.productId}: ${productData.quantity}</li>`).join('')}
        </ul>
      `;

      /* ////////////////////////////////////////////////////////////// */
      /* attachments implementado en un correo electrónico */
      /* ////////////////////////////////////////////////////////////// */

      const attachments = [
        {
          filename: 'freelo.png',
          path: path.join(__dirname, '../../../uploads/mail/freelo.png'),
        },
      ];

      // Enviar el correo electrónico
      const emailPayload = {
        from: 'lisandrojm@gmail.com',
        to: username, // El destinatario es el usuario obtenido del token o la sesión
        subject: 'FreeloECOM - Resultado de la compra',
        html: emailContent,
        attachments,
      };

      await MailManager.sendEmail(emailPayload);

      // Devolver la respuesta en JSON
      if (productsNotPurchased.length === 0) {
        return res.sendSuccess({
          message: 'Compra exitosa. Todos los productos fueron comprados.',
          payload: {
            productsPurchased: productsToPurchase,
          },
        });
      } else {
        return res.sendSuccess({
          message: 'Compra parcial. Algunos productos no pudieron ser comprados.',
          payload: {
            productsNotPurchased,
          },
        });
      }
    } catch (error) {
      return res.sendServerError('Error al procesar la compra y enviar el correo electrónico');
    }
  };
}

module.exports = new CartsServices();
