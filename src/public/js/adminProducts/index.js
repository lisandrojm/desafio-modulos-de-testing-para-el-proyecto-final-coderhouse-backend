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
      <td>${product.thumbnails}</td>
      <td>${product.owner}</td>
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
socket.on('totalProductsUpdate', (totalProducts) => {
  // Actualiza la cantidad total de productos en la página
  document.getElementById('totalProductsValue').innerText = totalProducts;
});

document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('productForm');
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);

    // Mostrar los datos antes de enviar el formulario
    for (const entry of formData.entries()) {
      const [name, value] = entry;
      console.log(`Campo: ${name}, Valor: ${value}`);
    }

    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Producto agregado con éxito');
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

// Obtener el formulario de actualización por su ID
const productUpdateForm = document.getElementById('productUpdate');

// Agregar un evento al formulario cuando se envíe
productUpdateForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que se recargue la página al enviar el formulario

  // Obtener el formulario como objeto FormData
  const formData = new FormData(productUpdateForm);

  // Obtener el ID del producto que se va a actualizar
  const productId = formData.get('_id');
  console.log('Product ID', productId);

  // Verificar si se obtuvo un ID válido
  if (!productId) {
    console.error('No se proporcionó un ID de producto válido');
    return;
  }

  // Eliminar el campo _id del objeto formData
  formData.delete('_id');

  // Crear un objeto de datos para almacenar los campos con valores
  const dataToSend = {};

  // Iterar a través de los datos del formulario
  for (const [name, value] of formData.entries()) {
    // Verificar si el valor no está vacío (cualquier tipo de valor, incluyendo números)
    if (value !== '') {
      // Verificar si el campo es 'image' y no está vacío
      if (name === 'image') {
        // Agregarlo solo si hay archivos seleccionados
        if (value instanceof FileList && value.length > 0) {
          dataToSend[name] = value;
        }
      } else {
        dataToSend[name] = value;
      }
    }
  }

  // Mostrar los datos antes de enviar el formulario
  for (const [name, value] of Object.entries(dataToSend)) {
    console.log(`Campo: ${name}, Valor: ${value}`);
  }

  // Enviar la solicitud de actualización al servidor utilizando el ID del producto
  const response = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(dataToSend), // Convierte el objeto de datos en una cadena JSON
    headers: {
      'Content-Type': 'application/json', // Establece el tipo de contenido a JSON
    },
  });

  if (response.ok) {
    console.log('Producto actualizado con éxito', dataToSend);
    productUpdateForm.reset(); // Reiniciar el formulario después de una actualización exitosa
  } else {
    const error = await response.json();
    console.error('Error al actualizar el producto:', error);
  }
});

/* Mocking Products */
// Obtén una referencia al botón
const mockingButton = document.getElementById('mockingButton');

// Agrega un manejador de eventos de clic al botón
mockingButton.addEventListener('click', async (e) => {
  e.preventDefault(); // Evita que el enlace siga la URL

  try {
    // Realiza la solicitud POST utilizando fetch o cualquier otra biblioteca de solicitud HTTP
    const response = await fetch('/mockingproducts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roles: ['ADMIN'],
      }),
    });

    if (response.ok) {
      // La solicitud POST se completó con éxito
      swal('¡Productos creados exitosamente con Faker!', 'Vuelva a ingresar a "Administrar Productos" desde el dashboard de Admin para visualizarlos', 'success').then(function () {
        // Redirigir al usuario a la página de productos
        window.location.href = '/admin';
      });
    } else {
      // La solicitud POST no se completó con éxito, puedes manejar los errores aquí
      console.error('Error al realizar la solicitud POST');
    }
  } catch (error) {
    // Maneja los errores de red u otros errores aquí
    console.error('Error en la solicitud POST:', error);
  }
});
