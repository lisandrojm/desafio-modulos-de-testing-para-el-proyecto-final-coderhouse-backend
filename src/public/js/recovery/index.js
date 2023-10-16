/* ************************************************************************** */
/* /src/public/js/recovery/index.js - .js de /src/views/recovery.handlebars 
/* ************************************************************************** */

document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('recoveryForm');

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const payload = {
      email: email,
      password: password,
    };

    fetch('/api/session/useradmin/recovery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (response.ok) {
          swal('Contraseña Recuperada', 'Loguéate con tu Email y tu nuevo Password', 'success').then(function () {
            window.location.href = '/';
          });
        } else {
          response.json().then(function () {
            {
              swal('El usuario no existe', 'No se pudo recuperar la contraseña', 'error');
            }
          });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  });
});
