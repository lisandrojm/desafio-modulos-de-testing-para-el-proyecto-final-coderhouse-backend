/* ************************************************************************** */
/* /src/public/js/register/index.js - .js de /src/views/register.handlebars */
/* ************************************************************************** */
document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    var firstName = document.getElementById('first_name').value;
    var lastName = document.getElementById('last_name').value;
    var email = document.getElementById('email').value;
    var age = document.getElementById('age').value;
    var password = document.getElementById('password').value;

    // Crear un objeto con los datos del formulario
    var payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      age: age,
      password: password,
    };

    // Realizar una solicitud POST al servidor con los datos del formulario
    fetch('/api/session/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (response.ok) {
          // Redirigir al usuario a la URL deseada después de que se haya agregado el usuario correctamente
          swal('Usuario registrado', 'Loguéate con tu Email y Password', 'success').then(function () {
            window.location.href = '/';
          });
        } else {
          // Si la respuesta no es exitosa, analiza el cuerpo de la respuesta como JSON
          response.json().then(function (data) {
            // Verificar si el error específico es que ya existe un usuario con el mismo correo electrónico
            if (data.error && data.error === 'Ya existe un usuario con el mismo correo electrónico') {
              // Mostrar el SweetAlert personalizado con el mensaje de error específico
              swal('Error', 'Ya existe un usuario con el mismo correo electrónico', 'error');
            } else {
              // Si el error no es específico, muestra el SweetAlert genérico de error
              swal('Error', 'No se pudo registrar el usuario', 'error');
            }
          });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  });
});
