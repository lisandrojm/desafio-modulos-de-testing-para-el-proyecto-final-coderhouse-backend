/* ************************************************************************** */
/* /src/public/js/carts/index.js - .js de /src/views/carts.handlebars */
/* ************************************************************************** */

// Función para mostrar el SweetAlert
function mostrarSweetAlert() {
  swal('¡Compra realizada!', 'Revise su casilla de correo electrónico para más detalles.', 'success').then(function () {
    // Redirigir al usuario a la página de productos
    window.location.href = '/products';
  });
}

// Agrega un evento submit al formulario de compra
document.querySelector('form[action$="/purchasecart"]').addEventListener('submit', function (event) {
  event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada

  // Realizar la solicitud POST al servidor (puede usar fetch o axios)
  fetch(this.action, {
    method: 'POST',
    body: new FormData(this),
  })
    .then((response) => {
      if (response.ok) {
        // La compra se realizó con éxito, mostrar SweetAlert y redirigir
        mostrarSweetAlert();
      } else {
        // La compra falló, mostrar un mensaje de error
        swal('Error', 'Hubo un problema al realizar la compra. Inténtelo de nuevo más tarde.', 'error');
      }
    })
    .catch((error) => {
      // Error en la solicitud, mostrar mensaje de error
      swal('Error', 'Hubo un problema al realizar la compra. Inténtelo de nuevo más tarde.', 'error');
    });
});
