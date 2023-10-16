/* ************************************************************************** */
/* /src/components/products/productsServices/productsServices.js -
 controlador de los productos. */
/* ************************************************************************** */

const { Product } = require('../../../models/products');

/* Repository */
const { productsServices } = require('../../../repositories/index');
/* ************************************************************************** */
/* test customError */
/* ************************************************************************** */
const CustomError = require('../../../utils/errors/services/customError');
const EErrors = require('../../../utils/errors/services/enums');
const { generateProductErrorInfo } = require('../../../utils/errors/services/info');
/* ************************************************************************** */
class ProductsServices {
  getAllProducts = async (limit, page, sort, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
      };
      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query }
        : {};
      /* Repository */
      const result = await productsServices.paginate(filter, options);
      /*       console.log('~~~getAllProducts productServices.paginate result~~~', result); */
      if (page && !/^\d+$/.test(page)) {
        return res.sendUserError('El parámetro "page" debe ser un número válido');
      } else if (page && (parseInt(page) < 1 || parseInt(page) > result.totalPages)) {
        return res.sendUserError('El número de página no existe');
      } else {
        const data = {
          status: 'success',
          payload: result.docs,
          totalPages: result.totalPages,
          prevPage: result.prevPage || null,
          nextPage: result.nextPage || null,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
          nextLink: result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        };
        return res.sendSuccess({ message: 'Todos los productos', payload: data });
      }
    } catch (error) {
      return res.sendServerError('Error al obtener los productos');
    }
  };

  addProduct = async (payload, images, res, req) => {
    try {
      const { title, description, code, price, stock, category } = payload;

      // Obtener información del usuario que crea el producto desde req.session.user o req.user
      const userData = req.session.user || req.user;
      /*       req.logger.debug('UserData', userData); */

      if (!title || !description || !code || !price || !stock || !category) {
        try {
          CustomError.createError({
            name: 'Product creation error',
            cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
            message: 'Error Trying to create Product',
            code: EErrors.INVALID_TYPES_ERROR,
          });
        } catch (error) {
          console.error('Ocurrió un error en CustomError:', error);
        }
        return res.sendServerError('Faltan campos obligatorios del Producto');
      } else {
        const existingProduct = await productsServices.findOne({ code: code });
        if (existingProduct) {
          return res.sendUserError('Ya existe un producto con el mismo código');
        } else {
          const owner = userData.role === 'premium' ? userData._id : 'admin';

          const newProduct = new Product({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: images && images.length > 0 ? images.map((image) => image.filename) : [],
            owner: owner,
          });

          // Guardar el nuevo producto en la base de datos
          await productsServices.save(newProduct);

          await productsServices.populateOwner(newProduct);

          req.app.io.emit('newProduct', newProduct);
          const totalProducts = await productsServices.countDocuments({});
          req.app.io.emit('totalProductsUpdate', totalProducts);

          const data = newProduct;
          return res.sendCreated({ message: 'Producto agregado correctamente', payload: data });
        }
      }
    } catch (error) {
      return res.sendServerError('Error al agregar el producto');
    }
  };

  getProductById = async (pid, res) => {
    try {
      /* Repository */
      const product = await productsServices.findById(pid);

      if (!product) {
        return res.sendNotFound('Producto no encontrado');
      } else {
        const data = product;
        return res.sendSuccess(data);
      }
    } catch (error) {
      return res.sendServerError('Error al obtener el producto');
    }
  };

  updateProduct = async (pid, updateFields, res, req) => {
    try {
      const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'image'];

      const invalidFields = Object.keys(updateFields).filter((field) => !allowedFields.includes(field));
      if (invalidFields.length > 0) {
        return res.sendUserError(`Los siguientes campos no se pueden modificar: ${invalidFields.join(', ')}`);
      } else {
        /* Repository */
        const product = await productsServices.findById(pid);

        if (!product) {
          return res.sendNotFound('Producto no encontrado');
        }

        // Obtener información del usuario que intenta actualizar el producto
        const userData = req.session.user || req.user;

        if (userData.role === 'premium' && product.owner !== userData._id) {
          return res.sendUserError('Este producto no fue creado por ti como user Premium. No tienes permisos para actualizar este producto');
        }

        const updatedProduct = await productsServices.findByIdAndUpdate(pid, updateFields, { new: true });

        req.app.io.emit('updateProduct', updatedProduct);
        const data = updatedProduct;
        return res.sendSuccess({ message: 'Producto actualizado correctamente', payload: data });
      }
    } catch (error) {
      return res.sendServerError('Error al actualizar el producto');
    }
  };

  deleteProduct = async (pid, res, req) => {
    try {
      /* Repository */
      const product = await productsServices.findById(pid);

      if (!product) {
        return res.sendNotFound('Producto no encontrado');
      }

      // Obtener información del usuario que intenta eliminar el producto
      const userData = req.session.user || req.user;

      if (userData.role === 'premium' && product.owner !== userData._id) {
        return res.sendUserError('Este producto no fue creado por ti como user Premium. No tienes permisos para eliminar este producto');
      }

      /* Repository */
      const deletedProduct = await productsServices.findByIdAndDelete(pid);

      if (!deletedProduct) {
        return res.sendNotFound('Producto no encontrado');
      }

      req.app.io.emit('deleteProduct', pid);
      const data = deletedProduct;
      /* Repository */
      const totalProducts = await productsServices.countDocuments({});
      req.app.io.emit('totalProductsUpdate', totalProducts);

      return res.sendSuccess({ message: 'Producto eliminado correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al eliminar el producto');
    }
  };

  getProducts = async (limit, page, sort, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      };

      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query }
        : {};

      /* Repository */
      const result = await productsServices.paginate(filter, options);
      /*       console.log('~~~getProducts productServices.paginate result~~~', result); */

      const formattedProducts = result.docs.map((product) => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          stock: product.stock,
          category: product.category,
          owner: product.owner,
        };
      });

      const totalPages = result.totalPages;
      const currentPage = result.page;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevPage = result.hasPrevPage ? result.prevPage : null;
      const nextPage = result.hasNextPage ? result.nextPage : null;
      const prevLink = result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}` : null;
      const nextLink = result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}` : null;

      return {
        products: formattedProducts,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        currentPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      return res.sendServerError('Error handlebars');
    }
  };

  getAdminProducts = async (limit, page, sort, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      };

      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query }
        : {};

      /* Repository */
      const result = await productsServices.paginate(filter, options);
      /*       console.log('~~~getProducts productServices.paginate result~~~', result); */

      const formattedProducts = result.docs.map((product) => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          stock: product.stock,
          category: product.category,
          thumbnails: product.thumbnails,
          owner: product.owner,
        };
      });

      const totalPages = result.totalPages;
      const currentPage = result.page;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevPage = result.hasPrevPage ? result.prevPage : null;
      const nextPage = result.hasNextPage ? result.nextPage : null;
      const prevLink = result.hasPrevPage ? `/admin/products?limit=${options.limit}&page=${result.prevPage}` : null;
      const nextLink = result.hasNextPage ? `/admin/products?limit=${options.limit}&page=${result.nextPage}` : null;

      return {
        products: formattedProducts,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        currentPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      return res.sendServerError('Error handlebars');
    }
  };

  getRealTimeProducts = async (limit, page, sort, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      };

      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query }
        : {};

      /* Repository */
      const result = await productsServices.paginate(filter, options);
      /*       console.log('~~~getRealTimeProducts productServices.paginate result~~~', result); */

      const formattedProducts = result.docs.map((product) => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          stock: product.stock,
          category: product.category,
        };
      });

      const totalPages = result.totalPages;
      const currentPage = result.page;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevPage = result.hasPrevPage ? result.prevPage : null;
      const nextPage = result.hasNextPage ? result.nextPage : null;
      const prevLink = result.hasPrevPage ? `/realtimeproducts?limit=${options.limit}&page=${result.prevPage}` : null;
      const nextLink = result.hasNextPage ? `/realtimeproducts?limit=${options.limit}&page=${result.nextPage}` : null;

      return {
        products: formattedProducts,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        currentPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      return res.sendServerError('Error handlebars');
    }
  };
  getHomeProducts = async (limit, page, sort, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      };

      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query } // Búsqueda por categoría exacta
        : {};

      /* Repository */
      const result = await productsServices.paginate(filter, options);
      /*       console.log('~~~getRealTimeProducts productServices.paginate result~~~', result); */

      const formattedProducts = result.docs.map((product) => {
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          stock: product.stock,
          category: product.category,
        };
      });

      const totalPages = result.totalPages;
      const currentPage = result.page;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevPage = result.hasPrevPage ? result.prevPage : null;
      const nextPage = result.hasNextPage ? result.nextPage : null;
      const prevLink = result.hasPrevPage ? `/home?limit=${options.limit}&page=${result.prevPage}` : null;
      const nextLink = result.hasNextPage ? `/home?limit=${options.limit}&page=${result.nextPage}` : null;

      return {
        products: formattedProducts,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        currentPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      return res.sendServerError('Error handlebars');
    }
  };
}

module.exports = new ProductsServices();
