/* ************************************************************************** */
/* /src/dao/models/ProductManager_fileSystem.js */
/* ************************************************************************** */
/* Manager de productos con persistencia de datos en fileSystem */
/* ************************************************************************** */

/* Importar módulos y dependencias necesarias */
const express = require('express');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Ruta del archivo JSON para respaldar los productos
const productosFilePath = './data/productos.json';

// Verificar y crear el archivo "productos.json" si no existe o está vacío
(async () => {
  try {
    // Verificar si el archivo "productos.json" existe
    await fs.access(productosFilePath);

    const productosData = await fs.readFile(productosFilePath, 'utf8');
    if (productosData.trim() === '') {
      // Si el archivo está vacío,inicializar un array vacío
      await fs.writeFile(productosFilePath, '[]');
    }
  } catch (error) {
    // Si el archivo no existe crearlo con un array vacío
    await fs.writeFile(productosFilePath, '[]');
  }
})();

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* GET /  */
/* ************************************************************************** */
// Obtiene todos los productos (Incluye la limitación ?limit para enviar la
// cantidad de productos determinada)
/* ************************************************************************** */

router.get('/', async (req, res) => {
  try {
    // Obtener el valor del parámetro 'limit' de la consulta (si existe)
    const limit = req.query.limit;

    // Leer el archivo JSON de productos
    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Obtener productos limitados según el parámetro 'limit' o todos los productos si no se especifica el parámetro
    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : { status: 'success', payload: products };

    return res.status(200).json(limitedProducts);
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
  }
});

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* GET /:pid */
/* ************************************************************************** */
// Obtiene el producto con el id indicado
/* ************************************************************************** */

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    // Leer el archivo JSON de productos
    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Buscar el producto por su ID
    const product = products.find((p) => p.id === pid);

    if (!product) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    return res.status(200).json({ status: 'success', payload: product });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error al obtener el producto' });
  }
});

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* POST / */
/* ************************************************************************** */
// Agrega un nuevo producto (La propiedad "id" se autogenera)
/* ************************************************************************** */

router.post('/', async (req, res) => {
  try {
    const { id, title, description, code, price, stock, category, thumbnails } = req.body;

    // Verificar si se envía el campo "id"
    if (id) {
      return res.status(400).json({ status: 'error', error: 'No envíe el ID del producto. Se genera automáticamente para que sea único e irrepetible' });
    }

    // Verificar campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(500).json({ status: 'error', error: 'Faltan campos obligatorios' });
    }

    // Leer el archivo JSON de productos
    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Verificar si ya existe un producto con el mismo código
    const existingProduct = products.find((p) => p.code === code);

    if (existingProduct) {
      return res.status(400).json({ status: 'error', error: 'Ya existe un producto con el mismo código' });
    }

    // Generar un ID único de 4 dígitos con el prefijo "pid" para el nuevo producto
    const newProductId = 'pid' + uuidv4().substring(0, 4);

    // Crear el nuevo producto con los campos proporcionados
    const newProduct = {
      id: newProductId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      // Asignar el string "Sin imagen" si no se proporciona thumbnails
      thumbnails: thumbnails || 'Sin imagen',
    };

    // Agregar el nuevo producto al array de productos
    products.push(newProduct);

    // Guardar los productos actualizados en el archivo JSON
    await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(201).json({ status: 'created', message: 'Producto agregado correctamente' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error al agregar el producto' });
  }
});

////////////////////////////////////////////////////////////////////////////////
/* ************************************************************************** */
/* PUT /:pid  */
/* ************************************************************************** */
// Modifica un producto con el id indicado.
/* ************************************************************************** */

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updateFields = req.body;

    // Verificar si se intenta modificar el ID del producto
    if ('id' in updateFields) {
      return res.status(400).json({ status: 'error', error: 'No se puede modificar el ID del producto' });
    }

    // Leer el archivo JSON de productos
    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Encontrar el índice del producto a actualizar
    const productIndex = products.findIndex((p) => p.id === pid);

    // Verificar si el producto no existe
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    // Obtener el producto actual
    const product = products[productIndex];

    // Actualizar los campos proporcionados sin eliminar los campos no proporcionados
    const updatedProduct = {
      ...product,
      ...updateFields,
    };

    // Actualizar el producto en la lista de productos
    products[productIndex] = updatedProduct;

    // Guardar los productos actualizados en el archivo JSON
    await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(200).json({ status: 'success', message: 'Producto actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error al actualizar el producto' });
  }
});

/* ************************************************************************** */
/* DELETE /:pid  */
/* ************************************************************************** */
// ELimina un producto con el id indicado.
/* ************************************************************************** */

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    // Leer el archivo JSON de productos
    const productosData = await fs.readFile(productosFilePath, 'utf8');
    const products = JSON.parse(productosData);

    // Encontrar el índice del producto a eliminar
    const productIndex = products.findIndex((p) => p.id === pid);

    // Verificar si el producto no existe
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    // Eliminar el producto de la lista de productos
    products.splice(productIndex, 1);

    // Guardar los productos actualizados en el archivo JSON
    await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));

    return res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ status: 'error', error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
