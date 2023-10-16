/* ************************************************************************** */
/* /src/public/js/products/index.js - .js de /src/views/products.handlebars */
/* ************************************************************************** */

let cartId;

document.addEventListener('DOMContentLoaded', function () {
  const cartIdElement = document.getElementById('cartId');
  cartId = cartIdElement.innerText;
});

async function addToCart(productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
      swal('Producto agregado al carrito', `Product ID: ${productId}\nCart ID: ${cartId}`, 'success');
      const totalProductosElement = document.getElementById('totalProductosCarrito');
      let totalProductos = parseInt(totalProductosElement.textContent); // Obtener el valor actual y convertirlo a entero
      totalProductos++;
      totalProductosElement.textContent = totalProductos;
    } else {
      swal('Error al agregar el producto al carrito', '', 'error');
    }
  } catch (error) {
    swal('Error al agregar el producto al carrito', '', 'error');
  }
}
