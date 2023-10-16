/* ************************************************************************** */
/* /src/public/js/resetPassExpiredTokenl/index.js - .js de /src/views/reset.handlebars */
/* ************************************************************************** */

function mostrarSweetAlertSuccess() {
  swal('¡Email enviado!', 'Revisa tu casilla de correo electrónico para reestablecer la contraseña.', 'success').then(function () {
    // Redirigir al usuario a la página de productos
    window.location.href = '/';
  });
}
function mostrarSweetAlertError() {
  swal('¡Email no registrado!', 'Complete el formulario de registro y una vez registrado ingrese por Login', 'error').then(function () {
    // Redirigir al usuario a la página de productos
    window.location.href = '/register';
  });
}

function submitForm(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;

  fetch(`/api/session/useradmin/resetPassByEmail?email=${email}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        mostrarSweetAlertSuccess();
      } else {
        mostrarSweetAlertError();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
