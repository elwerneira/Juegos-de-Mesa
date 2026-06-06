function agregarCarrito(nombreJuego) {
    alert(nombreJuego + ' fue agregado al carrito');
}

document.addEventListener('DOMContentLoaded', function () {
    const STORAGE_USERS_KEY = 'tabletop_users';
    const STORAGE_SESSION_KEY = 'tabletop_session';

    const feedbackRegistro = document.getElementById('registroFeedback');
    const feedbackLogin = document.getElementById('loginFeedback');
    const formularioRegistro = document.getElementById('formularioRegistro');
    const loginForm = document.getElementById('loginForm');
    const botonesPassword = document.querySelectorAll('.toggle-password');
    const siteHeader = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navPrincipal = document.getElementById('site-navigation');

    function leerUsuarios() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || [];
        } catch (error) {
            return [];
        }
    }

    function guardarUsuarios(usuarios) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usuarios));
    }

    function leerSesion() {
        try {
            return JSON.parse(sessionStorage.getItem(STORAGE_SESSION_KEY));
        } catch (error) {
            return null;
        }
    }

    function guardarSesion(usuario) {
        sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(usuario));
    }

    function cerrarSesion() {
        sessionStorage.removeItem(STORAGE_SESSION_KEY);
        actualizarNavbarSesion();
    }

    function mostrarFeedback(elemento, mensaje, tipo) {
        if (!elemento) {
            return;
        }

        elemento.textContent = mensaje || '';
        elemento.classList.remove('exito', 'error');
        if (tipo) {
            elemento.classList.add(tipo);
        }
    }

    function normalizarTexto(valor) {
        return valor.trim().toLowerCase();
    }

    function obtenerCampoVisual(campo) {
        return campo.closest('.campo-password') || campo;
    }

    function mostrarError(campo, contenedorError, mensaje) {
        const campoVisual = obtenerCampoVisual(campo);
        campoVisual.classList.add('campo-invalido');
        campoVisual.classList.remove('campo-valido');
        contenedorError.textContent = mensaje;
    }

    function limpiarError(campo, contenedorError) {
        const campoVisual = obtenerCampoVisual(campo);
        campoVisual.classList.remove('campo-invalido');
        campoVisual.classList.add('campo-valido');
        contenedorError.textContent = '';
    }

    function limpiarEstado(campo, contenedorError) {
        const campoVisual = obtenerCampoVisual(campo);
        campoVisual.classList.remove('campo-invalido', 'campo-valido');
        if (contenedorError) {
            contenedorError.textContent = '';
        }
    }

    function ocultarPassword(campo) {
        const boton = document.querySelector('[data-target="' + campo.id + '"]');
        campo.type = 'password';
        if (boton) {
            boton.classList.remove('password-visible');
        }
    }

    function correoValido(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }

    function passwordSegura(valor) {
        return /[A-Z]/.test(valor) && /\d/.test(valor);
    }

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

    function validarFormularioRegistro(campos, errores) {
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

    function actualizarNavbarSesion() {
        const enlaceSesion = document.querySelector('nav a[href="loguin.html"]');
        const sesionActiva = leerSesion();

        if (!enlaceSesion) {
            return;
        }

        if (sesionActiva) {
            enlaceSesion.textContent = 'Cerrar sesion';
            enlaceSesion.href = '#';
            enlaceSesion.dataset.sessionAction = 'logout';
        } else {
            enlaceSesion.textContent = 'Iniciar sesion';
            enlaceSesion.href = 'loguin.html';
            delete enlaceSesion.dataset.sessionAction;
        }
    }

    function cerrarMenuMovil() {
        if (!siteHeader || !navToggle) {
            return;
        }

        siteHeader.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
    }

    function alternarMenuMovil() {
        if (!siteHeader || !navToggle) {
            return;
        }

        const estaAbierto = siteHeader.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(estaAbierto));
        navToggle.setAttribute('aria-label', estaAbierto ? 'Cerrar menu' : 'Abrir menu');
    }

    function crearRegistroUsuario(datos) {
        const usuarios = leerUsuarios();
        const existeUsuario = usuarios.some(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(datos.usuario) ||
                normalizarTexto(usuario.correo) === normalizarTexto(datos.correo);
        });

        if (existeUsuario) {
            return { ok: false, mensaje: 'Ese usuario o correo ya existe.' };
        }

        usuarios.push(datos);
        guardarUsuarios(usuarios);
        return { ok: true, mensaje: 'Cuenta registrada e inicio de sesion realizado correctamente.' };
    }

    function autenticarUsuario(identificador, password) {
        const usuarios = leerUsuarios();
        return usuarios.find(function (usuario) {
            const coincideUsuario = normalizarTexto(usuario.usuario) === normalizarTexto(identificador);
            const coincideCorreo = normalizarTexto(usuario.correo) === normalizarTexto(identificador);
            return (coincideUsuario || coincideCorreo) && usuario.password === password;
        }) || null;
    }

    function recuperarUsuarioPorIdentificador(identificador) {
        const usuarios = leerUsuarios();
        return usuarios.find(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(identificador) ||
                normalizarTexto(usuario.correo) === normalizarTexto(identificador);
        }) || null;
    }

    if (formularioRegistro) {
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

        formularioRegistro.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!validarFormularioRegistro(campos, errores)) {
                mostrarFeedback(feedbackRegistro, 'Revisa los campos marcados antes de continuar.', 'error');
                return;
            }

            const resultado = crearRegistroUsuario({
                nombre: campos.nombre.value.trim(),
                usuario: campos.usuario.value.trim(),
                correo: campos.correo.value.trim(),
                password: campos.password.value,
                fechaNacimiento: campos.fechaNacimiento.value,
                direccion: campos.direccion.value.trim()
            });

            if (!resultado.ok) {
                mostrarFeedback(feedbackRegistro, resultado.mensaje, 'error');
                return;
            }

            guardarSesion({
                nombre: campos.nombre.value.trim(),
                usuario: campos.usuario.value.trim(),
                correo: campos.correo.value.trim()
            });

            actualizarNavbarSesion();

            mostrarFeedback(feedbackRegistro, resultado.mensaje, 'exito');
            campos.nombre.value = '';
            campos.usuario.value = '';
            campos.correo.value = '';
            campos.password.value = '';
            campos.confirmarPassword.value = '';
            campos.fechaNacimiento.value = '';
            campos.direccion.value = '';
            Object.keys(errores).forEach(function (clave) {
                limpiarEstado(campos[clave], errores[clave]);
            });
            limpiarEstado(campos.direccion);
            ocultarPassword(campos.password);
            ocultarPassword(campos.confirmarPassword);
        });

        formularioRegistro.addEventListener('reset', function () {
            setTimeout(function () {
                Object.keys(errores).forEach(function (clave) {
                    limpiarEstado(campos[clave], errores[clave]);
                });
                limpiarEstado(campos.direccion);
                ocultarPassword(campos.password);
                ocultarPassword(campos.confirmarPassword);
                mostrarFeedback(feedbackRegistro, '');
            }, 0);
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

    if (loginForm) {
        const loginUsuario = document.getElementById('loginUsuario');
        const loginPassword = document.getElementById('loginPassword');
        const errorLoginUsuario = document.getElementById('errorLoginUsuario');
        const errorLoginPassword = document.getElementById('errorLoginPassword');
        const btnRecuperarClave = loginForm.querySelector('.btn-secondary, button[type="reset"]');

        if (btnRecuperarClave) {
            btnRecuperarClave.textContent = 'Recuperar clave';
            btnRecuperarClave.type = 'button';
            btnRecuperarClave.id = 'btnRecuperarClave';
        }

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let esValido = true;

            if (!loginUsuario.value.trim()) {
                mostrarError(loginUsuario, errorLoginUsuario, 'Ingresa tu usuario o correo.');
                esValido = false;
            } else {
                limpiarError(loginUsuario, errorLoginUsuario);
            }

            if (!loginPassword.value.trim()) {
                mostrarError(loginPassword, errorLoginPassword, 'Ingresa tu contrasena.');
                esValido = false;
            } else {
                limpiarError(loginPassword, errorLoginPassword);
            }

            if (!esValido) {
                mostrarFeedback(feedbackLogin, 'Completa los campos para continuar.', 'error');
                return;
            }

            const usuarioEncontrado = autenticarUsuario(loginUsuario.value, loginPassword.value);

            if (!usuarioEncontrado) {
                mostrarFeedback(feedbackLogin, 'Usuario o contrasena incorrectos.', 'error');
                mostrarError(loginUsuario, errorLoginUsuario, 'No se encontro una cuenta valida.');
                mostrarError(loginPassword, errorLoginPassword, 'No se encontro una cuenta valida.');
                return;
            }

            guardarSesion({
                nombre: usuarioEncontrado.nombre,
                usuario: usuarioEncontrado.usuario,
                correo: usuarioEncontrado.correo
            });

            mostrarFeedback(feedbackLogin, 'Sesion iniciada correctamente.', 'exito');
            actualizarNavbarSesion();

            setTimeout(function () {
                window.location.href = 'index.html';
            }, 650);
        });

        if (btnRecuperarClave) {
            btnRecuperarClave.addEventListener('click', function (event) {
                event.preventDefault();

                const identificador = loginUsuario.value.trim();

                limpiarEstado(loginUsuario, errorLoginUsuario);
                limpiarEstado(loginPassword, errorLoginPassword);

                if (!identificador) {
                    mostrarError(loginUsuario, errorLoginUsuario, 'Ingresa tu usuario o correo para recuperar la clave.');
                    mostrarFeedback(feedbackLogin, 'Necesitamos tu usuario o correo para buscar la cuenta.', 'error');
                    return;
                }

                const usuarioRecuperado = recuperarUsuarioPorIdentificador(identificador);

                if (!usuarioRecuperado) {
                    mostrarError(loginUsuario, errorLoginUsuario, 'No existe una cuenta asociada a ese dato.');
                    mostrarFeedback(feedbackLogin, 'No encontramos una cuenta registrada con ese usuario o correo.', 'error');
                    return;
                }

                loginPassword.value = usuarioRecuperado.password;
                ocultarPassword(loginPassword);
                mostrarFeedback(
                    feedbackLogin,
                    'Clave recuperada correctamente. Tu contrasena registrada es: ' + usuarioRecuperado.password,
                    'exito'
                );
            });
        }

        loginForm.addEventListener('reset', function () {
            setTimeout(function () {
                limpiarEstado(loginUsuario, errorLoginUsuario);
                limpiarEstado(loginPassword, errorLoginPassword);
                ocultarPassword(loginPassword);
                mostrarFeedback(feedbackLogin, '');
            }, 0);
        });

        loginPassword.addEventListener('blur', function () {
            setTimeout(function () {
                ocultarPassword(loginPassword);
            }, 120);
        });
    }

    botonesPassword.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const campoObjetivo = document.getElementById(boton.dataset.target);
            const esPassword = campoObjetivo.type === 'password';
            campoObjetivo.type = esPassword ? 'text' : 'password';
            boton.classList.toggle('password-visible', esPassword);
        });
    });

    if (navToggle && siteHeader) {
        navToggle.addEventListener('click', alternarMenuMovil);

        if (navPrincipal) {
            navPrincipal.addEventListener('click', function (event) {
                if (window.innerWidth <= 768 && event.target.closest('a')) {
                    cerrarMenuMovil();
                }
            });
        }

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                cerrarMenuMovil();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                cerrarMenuMovil();
            }
        });
    }

    document.addEventListener('click', function (event) {
        const enlaceSesion = event.target.closest('a[data-session-action="logout"]');
        if (!enlaceSesion) {
            return;
        }

        event.preventDefault();
        cerrarSesion();
        window.location.href = 'index.html';
    });

    actualizarNavbarSesion();
});
