/* ************************************************************************** */
/* /src/public/js/chat/index.js - .js de /src/views/chat.handlebars */
/* ************************************************************************** */

const socket = io();

let user = null;

function promptEmail() {
  return swal({
    text: 'Escribe tu Email',
    content: {
      element: 'input',
      attributes: {
        placeholder: 'nombre@correo.com',
        type: 'email',
      },
    },
    button: {
      text: 'Iniciar Chat',
      closeModal: true,
    },
  });
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function startChat() {
  promptEmail().then((name) => {
    if (!name || !validateEmail(name)) {
      swal('Correo electrónico inválido', 'Por favor, ingresa un correo electrónico válido', 'error').then(() => {
        startChat();
      });
    } else {
      user = name;
      const nameElement = document.getElementById('user-name');
      nameElement.innerHTML = `<b>Usuario conectado:</b> ${user}`;
    }
  });
}

startChat();

let message = document.getElementById('mensaje');
let btnEnviar = document.getElementById('enviar');
let chat_contenedor = document.getElementById('chat');

btnEnviar.addEventListener('click', sendMessage);

message.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  if (!user) {
    swal('Error', 'Debes ingresar tu correo electrónico primero', 'error');
    return;
  }
  if (!message.value.trim()) {
    swal('Error', 'El mensaje no puede estar vacío', 'error');
    return;
  }
  const payload = {
    user: user,
    message: message.value,
  };

  socket.emit('mensaje', payload);

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Mensaje enviado a la base de datos MongoDB:', data);
      /* Limpiar el campo de mensaje después de enviarlo */
      message.value = '';
    })
    .catch((error) => {
      console.error(error);
    });
}

readSockets();

function loadChat() {
  socket.on('init', (data) => {
    console.log('init', data);
    loadData(data);
  });
}

function readSockets() {
  loadChat();
  socket.on('nuevomensaje', (data) => {
    loadData(data);
  });
}

function loadData(data) {
  let innerHtml = '';
  data.forEach((msj) => {
    innerHtml += `<b>${msj.user}:</b> <span>${msj.message}</span><br>`;
  });
  chat_contenedor.innerHTML = innerHtml;
}
