/* ************************************************************************** */
/* /src/public/js/resetPass/index.js - .js de /src/views/recovery.handlebars 
/* ************************************************************************** */
console.log('testing');

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

    fetch('/api/session/useradmin/resetpass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (response.ok) {
          // Contraseña recuperada con éxito, redirigir al usuario
          swal('Contraseña Recuperada', 'Loguéate con tu Email y tu nuevo Password', 'success').then(function () {
            window.location.href = '/';
          });
        } else {
          // Error en la respuesta del servidor
          response.json().then(function (data) {
            if (data.error) {
              if (data.error === 'Usuario no encontrado') {
                swal('El usuario no existe', 'No se pudo recuperar la contraseña', 'error');
              } else if (data.error === 'La nueva contraseña es la misma que la contraseña actual. No se puede colacar la misma contraseña.') {
                swal('Misma contraseña', 'La nueva contraseña ingresada es la misma que la contraseña actual.Vuelva a intentarlo con otra contraseña.', 'error');
              } else {
                swal('Error', 'No se pudo recuperar la contraseña', 'error');
              }
            } else {
              swal('Error', 'Nos se pudo recuperar la contraseña', 'error');
            }
          });
        }
      })
      .catch(function (error) {
        console.error(error);
        swal('Error', 'No se pudo recuperar la contraseña', 'error');
      });
  });
});
