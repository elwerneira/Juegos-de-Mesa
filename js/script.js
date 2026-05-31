function agregarCarrito(nombreJuego) {
    alert(nombreJuego + ' fue agregado al carrito');
}

const formularioRegistro = document.getElementById('formularioRegistro');

if (formularioRegistro) {
    const botonesPassword = document.querySelectorAll('.toggle-password');
    const campos = {
        nombre: document.getElementById('nombre'),
        usuario: document.getElementById('usuario'),
        correo: document.getElementById('correo'),
        password: document.getElementById('password'),
        confirmarPassword: document.getElementById('confirmarPassword'),
        fechaNacimiento: document.getElementById('fechaNacimiento'),
        direccion: document.getElementById('direccion')
    };

    const errores = {
        nombre: document.getElementById('errorNombre'),
        usuario: document.getElementById('errorUsuario'),
        correo: document.getElementById('errorCorreo'),
        password: document.getElementById('errorPassword'),
        confirmarPassword: document.getElementById('errorConfirmarPassword'),
        fechaNacimiento: document.getElementById('errorFechaNacimiento')
    };

    // Devuelve el elemento visual que debe recibir los estilos de validacion.
    function obtenerCampoVisual(campo) {
        return campo.closest('.campo-password') || campo;
    }

    // Muestra un mensaje y aplica el estilo de error sobre el campo.
    function mostrarError(campo, contenedorError, mensaje) {
        const campoVisual = obtenerCampoVisual(campo);

        campoVisual.classList.add('campo-invalido');
        campoVisual.classList.remove('campo-valido');
        contenedorError.textContent = mensaje;
    }

    // Limpia el error visible y deja marcado el campo como correcto.
    function limpiarError(campo, contenedorError) {
        const campoVisual = obtenerCampoVisual(campo);

        campoVisual.classList.remove('campo-invalido');
        campoVisual.classList.add('campo-valido');
        contenedorError.textContent = '';
    }

    // Elimina cualquier estado visual previo del campo.
    function limpiarEstado(campo, contenedorError) {
        const campoVisual = obtenerCampoVisual(campo);

        campoVisual.classList.remove('campo-invalido', 'campo-valido');
        if (contenedorError) {
            contenedorError.textContent = '';
        }
    }

    // Oculta una contrasena y actualiza el estado visual del icono.
    function ocultarPassword(campo) {
        const boton = document.querySelector('[data-target="' + campo.id + '"]');

        campo.type = 'password';
        if (boton) {
            boton.classList.remove('password-visible');
        }
    }

    // Valida el formato general de un correo electronico.
    function correoValido(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }

    // Exige al menos una letra mayuscula y un numero en la contrasena.
    function passwordSegura(valor) {
        return /[A-Z]/.test(valor) && /\d/.test(valor);
    }

    // Calcula si la fecha ingresada corresponde a una edad minima de 13 anos.
    function tieneEdadMinima(fechaTexto) {
        const fecha = new Date(fechaTexto);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const diferenciaMes = hoy.getMonth() - fecha.getMonth();

        if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < fecha.getDate())) {
            edad--;
        }

        return edad >= 13;
    }

    // Recorre todas las reglas del formulario y retorna si se puede enviar.
    function validarFormulario() {
        let esValido = true;

        const nombre = campos.nombre.value.trim();
        const usuario = campos.usuario.value.trim();
        const correo = campos.correo.value.trim();
        const password = campos.password.value;
        const confirmarPassword = campos.confirmarPassword.value;
        const fechaNacimiento = campos.fechaNacimiento.value;

        if (!nombre) {
            mostrarError(campos.nombre, errores.nombre, 'El nombre completo es obligatorio.');
            esValido = false;
        } else {
            limpiarError(campos.nombre, errores.nombre);
        }

        if (!usuario) {
            mostrarError(campos.usuario, errores.usuario, 'El usuario es obligatorio.');
            esValido = false;
        } else {
            limpiarError(campos.usuario, errores.usuario);
        }

        if (!correo) {
            mostrarError(campos.correo, errores.correo, 'El correo electronico es obligatorio.');
            esValido = false;
        } else if (!correoValido(correo)) {
            mostrarError(campos.correo, errores.correo, 'Ingresa un correo electronico valido.');
            esValido = false;
        } else {
            limpiarError(campos.correo, errores.correo);
        }

        if (!password) {
            mostrarError(campos.password, errores.password, 'La contrasena es obligatoria.');
            esValido = false;
        } else if (password.length < 6 || password.length > 18) {
            mostrarError(campos.password, errores.password, 'La contrasena debe tener entre 6 y 18 caracteres.');
            esValido = false;
        } else if (!passwordSegura(password)) {
            mostrarError(campos.password, errores.password, 'La contrasena debe incluir una mayuscula y un numero.');
            esValido = false;
        } else {
            limpiarError(campos.password, errores.password);
        }

        if (!confirmarPassword) {
            mostrarError(campos.confirmarPassword, errores.confirmarPassword, 'Debes confirmar la contrasena.');
            esValido = false;
        } else if (password !== confirmarPassword) {
            mostrarError(campos.confirmarPassword, errores.confirmarPassword, 'Las contrasenas deben ser iguales.');
            esValido = false;
        } else {
            limpiarError(campos.confirmarPassword, errores.confirmarPassword);
        }

        if (!fechaNacimiento) {
            mostrarError(campos.fechaNacimiento, errores.fechaNacimiento, 'La fecha de nacimiento es obligatoria.');
            esValido = false;
        } else if (!tieneEdadMinima(fechaNacimiento)) {
            mostrarError(campos.fechaNacimiento, errores.fechaNacimiento, 'Debes tener al menos 13 anos para registrarte.');
            esValido = false;
        } else {
            limpiarError(campos.fechaNacimiento, errores.fechaNacimiento);
        }

        return esValido;
    }

    formularioRegistro.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validarFormulario()) {
            alert('Registro enviado correctamente.');
            formularioRegistro.reset();
            Object.keys(errores).forEach(function (clave) {
                limpiarEstado(campos[clave], errores[clave]);
            });
            limpiarEstado(campos.direccion);
        }
    });

    formularioRegistro.addEventListener('reset', function () {
        setTimeout(function () {
            Object.keys(errores).forEach(function (clave) {
                limpiarEstado(campos[clave], errores[clave]);
            });
            limpiarEstado(campos.direccion);
            ocultarPassword(campos.password);
            ocultarPassword(campos.confirmarPassword);
        }, 0);
    });

    botonesPassword.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const campoObjetivo = document.getElementById(boton.dataset.target);
            const esPassword = campoObjetivo.type === 'password';

            campoObjetivo.type = esPassword ? 'text' : 'password';
            boton.classList.toggle('password-visible', esPassword);
        });
    });

    campos.password.addEventListener('blur', function () {
        setTimeout(function () {
            ocultarPassword(campos.password);
        }, 120);
    });

    campos.confirmarPassword.addEventListener('blur', function () {
        setTimeout(function () {
            ocultarPassword(campos.confirmarPassword);
        }, 120);
    });
}
