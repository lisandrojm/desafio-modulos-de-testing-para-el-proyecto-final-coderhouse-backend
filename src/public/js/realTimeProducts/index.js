/* ************************************************************************** */
/* /src/public/js/realTimeProducts/index.js - .js de /src/views/realTimeProducts.handlebars 
/* ************************************************************************** */

const socket = io();

const addOrUpdateProductRow = (product) => {
  const productRow = `
    <tr id="${product._id}">
      <td>${product._id}</td>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.code}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Eliminar</button>
      </td>
    </tr>
  `;

  const productTable = document.getElementById('product-table');
  const existingRow = document.getElementById(product._id);

  if (existingRow) {
    existingRow.innerHTML = productRow;
  } else {
    productTable.insertAdjacentHTML('beforeend', productRow);
  }
};

const deleteProductRow = (productId) => {
  const productRow = document.getElementById(productId);
  if (productRow) {
    productRow.remove();
  }
};

socket.on('newProduct', addOrUpdateProductRow);
socket.on('updateProduct', addOrUpdateProductRow);
socket.on('deleteProduct', deleteProductRow);

document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('productForm');
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      productForm.reset();
    } else {
      const error = await response.json();
      console.error('Error al agregar el producto:', error);
    }
  });
});

const deleteProduct = (id) => {
  fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        socket.emit('deleteProduct', id);
      } else {
        console.error('Error al eliminar el producto');
      }
    })
    .catch((error) => {
      console.error('Error al eliminar el producto:', error);
    });
};
