/* ************************************************************************** */
/* /src/dao/models/CarttManager_fileSystem.js */
/* ************************************************************************** */
/* Manager de carritos con persistencia de datos en fileSystem */
/* ************************************************************************** */

/* Importar módulos y dependencias necesarias */
const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

/* Crear un nuevo router de Express */
const router = express.Router();

/* Ruta del archivo JSON para respaldar los carritos */
const cartsFilePath = './data/carrito.json';

/* Ruta del archivo JSON para respaldar los productos */
const productsFilePath = './data/productos.json';

/* Función para generar un ID único para los carritos con el prefijo "cid" */
function generateCartId(carts) {
  let id;
  const existingIds = carts.map((cart) => cart.id);

  do {
    id = 'cid' + uuidv4().substring(0, 4);
  } while (existingIds.includes(id));

  return id;
}

/* Verificar y crear el archivo "carrito.json" si no existe o está vacío */
(async () => {
  try {
    await fs.access(cartsFilePath);

    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    if (cartsData.trim() === '') {
      await fs.writeFile(cartsFilePath, '[]');
    }
  } catch (error) {
    await fs.writeFile(cartsFilePath, '[]');
  }
})();

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* POST / */
/* ************************************************************************** */
// Crea un nuevo carrito con un ID único
/* ************************************************************************** */

router.post('/', async (req, res) => {
  try {
    /* Leer el archivo JSON de carritos */
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    /* Generar un nuevo ID único para el carrito */
    const newCartId = generateCartId(carts);

    /* Crear el nuevo carrito con el ID generado y un array vacío de productos */
    const newCart = {
      id: newCartId,
      products: [],
    };

    /* Agregar el nuevo carrito al array de carritos */
    carts.push(newCart);

    /* Guardar los carritos actualizados en el archivo JSON */
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    /* Responder con el estado 201 (Creado) y enviar el nuevo carrito en la respuesta */
    return res.status(201).json({ status: 'created', message: 'Nuevo carrito creado', cart: newCart });
  } catch (error) {
    /* Responder con el estado 500 (Error del servidor) en caso de error */
    return res.status(500).json({ status: 'error', error: 'Error al crear el carrito' });
  }
});

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* GET /:cid */
/* ************************************************************************** */
// Obtiene el carrito con el id indicado
/* ************************************************************************** */

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por su ID
    const cart = carts.find((c) => c.id === cid);

    if (!cart) {
      // Si no se encuentra el carrito, responder con el estado 404 (No encontrado) y un mensaje de error
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    // Responder con el estado 200 (Éxito) y enviar los productos del carrito en la respuesta
    return res.status(200).json({ status: 'success', payload: cart.products });
  } catch (error) {
    // En caso de error, responder con el estado 500 (Error del servidor) y un mensaje de error
    return res.status(500).json({ status: 'error', error: 'Error al obtener los productos del carrito' });
  }
});

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* POST / :cid/product/:pid */
/* ************************************************************************** */
// Agrega un producto al array "products" del carrito del id indicado".
/* ************************************************************************** */

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    // Desestructurar los parámetros de la solicitud
    const { cid, pid } = req.params;
    // Desestructurar el cuerpo de la solicitud
    const { quantity } = req.body;

    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por su ID
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) {
      // Si no se encuentra el carrito, responder con el estado 404 (No encontrado) y un mensaje de error
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    // Obtener el carrito actual
    const cart = carts[cartIndex];

    // Leer el archivo JSON de productos
    const productsData = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);

    // Buscar el producto por su ID
    const product = products.find((p) => p.id === pid);

    if (!product) {
      // Si no se encuentra el producto, responder con el estado 404 (No encontrado) y un mensaje de error
      return res.status(404).json({ status: 'error', error: 'ID de Producto no encontrado. Debe ingresar el ID de un producto existente en el archivo productos.json' });
    }

    // Buscar el producto en el carrito
    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex === -1) {
      // El producto no existe en el carrito, agregarlo como un nuevo objeto
      const newProduct = {
        product: pid,
        quantity: quantity || 1, // Si no se proporciona la cantidad, se establece en 1
      };

      cart.products.push(newProduct);
    } else {
      // El producto ya existe en el carrito, incrementar la cantidad
      cart.products[productIndex].quantity += quantity || 1;
    }

    // Actualizar el carrito en la lista de carritos
    carts[cartIndex] = cart;

    // Guardar los carritos actualizados en el archivo JSON
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    // Responder con el estado 200 (Éxito) y un mensaje de éxito
    return res.status(200).json({ status: 'success', message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    // En caso de error, responder con el estado 500 (Error del servidor) y un mensaje de error
    return res.status(500).json({ status: 'error', error: 'Error al agregar el producto al carrito' });
  }
});

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* DELETE / :cid/product/:pid */
/* ************************************************************************** */
// Elimina un producto del carrito del id indicado".
/* ************************************************************************** */

router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por su ID
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    // Obtener el carrito actual
    const cart = carts[cartIndex];

    // Buscar el producto en el carrito
    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });
    }

    // Eliminar el producto del carrito
    cart.products.splice(productIndex, 1);

    // Actualizar el carrito en la lista de carritos
    carts[cartIndex] = cart;

    // Guardar los carritos actualizados en el archivo JSON
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito correctamente' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error al eliminar el producto del carrito' });
  }
});

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* DELETE / :cid */
/* ************************************************************************** */
// Elimina el carrito del id indicado".
/* ************************************************************************** */

router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Leer el archivo JSON de carritos
    const cartsData = await fs.readFile(cartsFilePath, 'utf8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por su ID
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    // Eliminar el carrito de la lista de carritos
    carts.splice(cartIndex, 1);

    // Guardar los carritos actualizados en el archivo JSON
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));

    return res.status(200).json({ status: 'success', message: 'Carrito eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error al eliminar el carrito' });
  }
});

module.exports = router;
