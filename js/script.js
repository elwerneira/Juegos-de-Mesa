const STORAGE_USERS_KEY = 'tabletop_users';
const STORAGE_SESSION_KEY = 'tabletop_session';
const STORAGE_CART_PREFIX = 'tabletop_cart_';
const STORAGE_PURCHASES_PREFIX = 'tabletop_purchases_';
const STORAGE_PRODUCTS_KEY = 'tabletop_products';
const PRODUCT_CATALOG = [
    {
        id: 'catan',
        nombre: 'Catan',
        aliases: ['Catan'],
        precio: 33990,
        precioOriginal: 39990,
        imagen: 'img/catan.png',
        categoria: 'Estrategia',
        oferta: 'Oferta 15%'
    },
    {
        id: 'monopoly',
        nombre: 'Monopoly',
        aliases: ['Monopoly'],
        precio: 24990,
        imagen: 'img/monopoly.png',
        categoria: 'Top ventas'
    },
    {
        id: 'basta',
        nombre: 'Basta',
        aliases: ['Basta'],
        precio: 8600,
        imagen: 'img/basta.png',
        categoria: 'Familiares'
    },
    {
        id: 'ajedrez-premium',
        nombre: 'Ajedrez Premium',
        aliases: ['Ajedrez Premium'],
        precio: 18990,
        imagen: 'img/ajedrez.png',
        categoria: 'Estrategia'
    },
    {
        id: 'risk-clasico',
        nombre: 'Risk Clasico',
        aliases: ['Risk Clasico'],
        precio: 29990,
        imagen: 'img/risk.png',
        categoria: 'Estrategia'
    },
    {
        id: 'uno-party',
        nombre: 'Uno Party',
        aliases: ['Uno', 'Uno ', 'Uno Party'],
        precio: 9990,
        imagen: 'img/uno.png',
        categoria: 'Fiesta'
    },
    {
        id: 'dixit',
        nombre: 'Dixit',
        aliases: ['Dixit'],
        precio: 22390,
        precioOriginal: 27990,
        imagen: 'img/dixit.png',
        categoria: 'Fiesta',
        oferta: 'Oferta 20%'
    },
    {
        id: 'pictionary-air',
        nombre: 'Pictionary Air',
        aliases: ['Pictionary Air'],
        precio: 21990,
        imagen: 'img/pictionary.png',
        categoria: 'Fiesta'
    },
    {
        id: 'jenga-familiar',
        nombre: 'Jenga Familiar',
        aliases: ['Jenga Familiar'],
        precio: 13490,
        precioOriginal: 14990,
        imagen: 'img/jenga.png',
        categoria: 'Familiares',
        oferta: 'Oferta 10%'
    },
    {
        id: 'exploding-kittens',
        nombre: 'EXPLODING KITTENS',
        aliases: ['EXPLODING KITTENS'],
        precio: 19990,
        imagen: 'img/EXPLODING KITTENS.png',
        categoria: 'Familiares'
    },
    {
        id: 'catan-junior',
        nombre: 'Catan Junior',
        aliases: ['Catan Junior'],
        precio: 26390,
        precioOriginal: 29990,
        imagen: 'img/catan junior.png',
        categoria: 'Infantiles',
        oferta: 'Oferta 12%'
    },
    {
        id: 'dobble-31-minutos',
        nombre: 'Dobble 31 Minutos',
        aliases: ['31 Minutos', 'Dobble 31 Minutos'],
        precio: 15990,
        imagen: 'img/31 minutos.png',
        categoria: 'Infantiles'
    },
    {
        id: 'serpientes-y-escaleras',
        nombre: 'Serpientes y Escaleras',
        aliases: ['Serpientes y Escaleras'],
        precio: 6990,
        imagen: 'img/serpientes y escalera.png',
        categoria: 'Infantiles'
    }
];

function normalizarClave(valor) {
    return String(valor || '').trim().toLowerCase();
}

function leerSesionGlobal() {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_SESSION_KEY));
    } catch (error) {
        return null;
    }
}

function obtenerProductoPorNombre(nombreJuego) {
    const nombreNormalizado = normalizarClave(nombreJuego);

    return leerProductos().find(function (producto) {
        const variantes = [producto.nombre].concat(producto.aliases || []);
        return variantes.some(function (alias) {
            return normalizarClave(alias) === nombreNormalizado;
        });
    }) || null;
}

function leerProductos() {
    try {
        const productosGuardados = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY));

        if (Array.isArray(productosGuardados) && productosGuardados.length) {
            return productosGuardados;
        }
    } catch (error) {
        return PRODUCT_CATALOG.map(function (producto) {
            return Object.assign({ stock: 10, estado: 'activo' }, producto);
        });
    }

    return PRODUCT_CATALOG.map(function (producto) {
        return Object.assign({ stock: 10, estado: 'activo' }, producto);
    });
}

function guardarProductos(productos) {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(productos));
}

function obtenerClaveCarritoUsuario() {
    const sesionActiva = leerSesionGlobal();

    if (!sesionActiva) {
        return null;
    }

    return STORAGE_CART_PREFIX + normalizarClave(sesionActiva.usuario || sesionActiva.correo);
}

function obtenerClaveComprasUsuario() {
    const sesionActiva = leerSesionGlobal();

    if (!sesionActiva) {
        return null;
    }

    return STORAGE_PURCHASES_PREFIX + normalizarClave(sesionActiva.usuario || sesionActiva.correo);
}

function leerComprasActuales() {
    const claveCompras = obtenerClaveComprasUsuario();

    if (!claveCompras) {
        return [];
    }

    try {
        return JSON.parse(localStorage.getItem(claveCompras)) || [];
    } catch (error) {
        return [];
    }
}

function guardarComprasActuales(compras) {
    const claveCompras = obtenerClaveComprasUsuario();

    if (!claveCompras) {
        return false;
    }

    localStorage.setItem(claveCompras, JSON.stringify(compras));
    return true;
}

function leerCarritoActual() {
    const claveCarrito = obtenerClaveCarritoUsuario();

    if (!claveCarrito) {
        return [];
    }

    try {
        return JSON.parse(localStorage.getItem(claveCarrito)) || [];
    } catch (error) {
        return [];
    }
}

function guardarCarritoActual(carrito) {
    const claveCarrito = obtenerClaveCarritoUsuario();

    if (!claveCarrito) {
        return false;
    }

    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
    return true;
}

function formatearPrecio(valor) {
    return '$' + Number(valor || 0).toLocaleString('es-CL');
}

function sincronizarTarjetasCatalogo() {
    document.querySelectorAll('.card button[onclick*="agregarCarrito"]').forEach(function (boton) {
        const llamadaCarrito = boton.getAttribute('onclick') || '';
        const coincidenciaNombre = llamadaCarrito.match(/agregarCarrito\('(.+)'\)/);

        if (!coincidenciaNombre) {
            return;
        }

        const producto = obtenerProductoPorNombre(coincidenciaNombre[1]);
        const tarjeta = boton.closest('.card');
        const acciones = boton.closest('.card-acciones');
        const etiquetaDescuento = tarjeta ? tarjeta.querySelector('.estado-descuento') : null;

        if (!producto || !tarjeta || !acciones) {
            return;
        }

        tarjeta.classList.toggle('card-oferta', Boolean(producto.precioOriginal));

        if (etiquetaDescuento) {
            etiquetaDescuento.textContent = producto.oferta || 'Sin descuentos';
            etiquetaDescuento.classList.toggle('estado-sin-descuento', !producto.oferta);
        }

        const precioActual = acciones.firstElementChild;
        const precioHtml = producto.precioOriginal
            ? '<div class="precio-contenedor"><span class="precio-original">' + formatearPrecio(producto.precioOriginal) + '</span><span class="precio-oferta">' + formatearPrecio(producto.precio) + '</span></div>'
            : '<span>' + formatearPrecio(producto.precio) + '</span>';

        if (precioActual) {
            precioActual.outerHTML = precioHtml;
        }

        boton.disabled = producto.estado === 'inactivo' || Number(producto.stock || 0) <= 0;
        boton.textContent = boton.disabled ? 'Sin stock' : 'Agregar al carrito';
    });
}

function agregarCarrito(nombreJuego) {
    const sesionActiva = leerSesionGlobal();

    if (!sesionActiva) {
        alert('Debes iniciar sesion para agregar productos al carrito.');
        window.location.href = 'loguin.html';
        return;
    }

    const producto = obtenerProductoPorNombre(nombreJuego);

    if (!producto) {
        alert('No se encontro el producto seleccionado.');
        return;
    }

    if ((producto.estado || 'activo') !== 'activo' || Number(producto.stock || 0) <= 0) {
        alert('Este producto no tiene stock disponible.');
        return;
    }

    const carrito = leerCarritoActual();
    const indiceExistente = carrito.findIndex(function (item) {
        return item.id === producto.id;
    });

    if (indiceExistente !== -1) {
        carrito[indiceExistente].cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            precioOriginal: producto.precioOriginal || null,
            imagen: producto.imagen,
            categoria: producto.categoria,
            oferta: producto.oferta || '',
            cantidad: 1
        });
    }

    const cantidadEnCarrito = carrito.find(function (item) {
        return item.id === producto.id;
    }).cantidad;

    if (cantidadEnCarrito > Number(producto.stock || 0)) {
        alert('Solo quedan ' + producto.stock + ' unidades disponibles.');
        return;
    }

    guardarCarritoActual(carrito);
    alert(producto.nombre + ' fue agregado al carrito.');
}

document.addEventListener('DOMContentLoaded', function () {
    const ADMIN_DEFAULT_USER = {
        nombre: 'Administrador',
        usuario: 'admin',
        correo: 'admin@tabletopet.cl',
        password: 'Admin123',
        rol: 'admin'
    };

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

    function asegurarUsuarioAdmin() {
        const usuarios = leerUsuarios();
        const indiceAdmin = usuarios.findIndex(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(ADMIN_DEFAULT_USER.usuario) ||
                normalizarTexto(usuario.correo) === normalizarTexto(ADMIN_DEFAULT_USER.correo);
        });

        if (indiceAdmin !== -1) {
            usuarios[indiceAdmin] = Object.assign({}, usuarios[indiceAdmin], {
                rol: 'admin',
                estado: 'activo'
            });
            guardarUsuarios(usuarios);
            return;
        }

        usuarios.push(ADMIN_DEFAULT_USER);
        guardarUsuarios(usuarios);
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

    function obtenerUsuarioActual() {
        const sesionActiva = leerSesion();

        if (!sesionActiva) {
            return null;
        }

        return recuperarUsuarioPorIdentificador(sesionActiva.usuario || sesionActiva.correo);
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
        const navLista = document.querySelector('#site-navigation ul');
        let enlaceAdmin = document.getElementById('navAdminLink');
        let enlaceCarrito = document.getElementById('navCartLink');
        let enlaceCompras = document.getElementById('navPurchasesLink');
        let enlacePerfil = document.getElementById('navProfileLink');

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

        if (navLista) {
            if ((!sesionActiva || sesionActiva.rol !== 'admin') && !enlaceCarrito) {
                const itemCarrito = document.createElement('li');
                enlaceCarrito = document.createElement('a');
                enlaceCarrito.id = 'navCartLink';
                enlaceCarrito.href = 'carrito.html';
                enlaceCarrito.textContent = 'Carrito';
                itemCarrito.appendChild(enlaceCarrito);
                navLista.insertBefore(itemCarrito, navLista.lastElementChild);
            } else if (sesionActiva && sesionActiva.rol === 'admin' && enlaceCarrito && enlaceCarrito.parentElement) {
                enlaceCarrito.parentElement.remove();
            }

            if (sesionActiva && sesionActiva.rol !== 'admin') {
                if (!enlaceCompras) {
                    const itemCompras = document.createElement('li');
                    enlaceCompras = document.createElement('a');
                    enlaceCompras.id = 'navPurchasesLink';
                    enlaceCompras.href = 'mis-compras.html';
                    enlaceCompras.textContent = 'Mis compras';
                    itemCompras.appendChild(enlaceCompras);
                    navLista.insertBefore(itemCompras, navLista.lastElementChild);
                }

                if (!enlacePerfil) {
                    const itemPerfil = document.createElement('li');
                    enlacePerfil = document.createElement('a');
                    enlacePerfil.id = 'navProfileLink';
                    enlacePerfil.href = 'perfil.html';
                    enlacePerfil.textContent = 'Mi perfil';
                    itemPerfil.appendChild(enlacePerfil);
                    navLista.insertBefore(itemPerfil, navLista.lastElementChild);
                }
            } else {
                if (enlaceCompras && enlaceCompras.parentElement) {
                    enlaceCompras.parentElement.remove();
                }

                if (!sesionActiva && enlacePerfil && enlacePerfil.parentElement) {
                    enlacePerfil.parentElement.remove();
                }
            }

            if (sesionActiva && sesionActiva.rol === 'admin' && !enlacePerfil) {
                const itemPerfil = document.createElement('li');
                enlacePerfil = document.createElement('a');
                enlacePerfil.id = 'navProfileLink';
                enlacePerfil.href = 'perfil.html';
                enlacePerfil.textContent = 'Mi perfil';
                itemPerfil.appendChild(enlacePerfil);
                navLista.insertBefore(itemPerfil, navLista.lastElementChild);
            }

            if (sesionActiva && sesionActiva.rol === 'admin') {
                if (!enlaceAdmin) {
                    const itemAdmin = document.createElement('li');
                    enlaceAdmin = document.createElement('a');
                    enlaceAdmin.id = 'navAdminLink';
                    enlaceAdmin.href = 'admin.html';
                    enlaceAdmin.textContent = 'Panel ADM';
                    itemAdmin.appendChild(enlaceAdmin);
                    navLista.insertBefore(itemAdmin, navLista.lastElementChild);
                }
            } else if (enlaceAdmin && enlaceAdmin.parentElement) {
                enlaceAdmin.parentElement.remove();
            }
        }
    }

    function protegerVistaAdmin() {
        const paginaActual = window.location.pathname.split('/').pop().toLowerCase();
        const sesionActiva = leerSesion();

        if (paginaActual !== 'admin.html') {
            return;
        }

        if (!sesionActiva) {
            window.location.href = 'loguin.html';
            return;
        }

        if (sesionActiva.rol !== 'admin') {
            window.location.href = 'index.html';
        }
    }

    function protegerVistaPerfil() {
        const paginaActual = window.location.pathname.split('/').pop().toLowerCase();

        if (paginaActual !== 'perfil.html') {
            return;
        }

        if (!leerSesion()) {
            window.location.href = 'loguin.html';
        }
    }

    function protegerVistaCarrito() {
        const paginaActual = window.location.pathname.split('/').pop().toLowerCase();

        if (paginaActual !== 'carrito.html' && paginaActual !== 'mis-compras.html') {
            return;
        }

        if (!leerSesion()) {
            window.location.href = 'loguin.html';
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
            return (coincideUsuario || coincideCorreo) &&
                usuario.password === password &&
                (usuario.estado || 'activo') !== 'bloqueado';
        }) || null;
    }

    function recuperarUsuarioPorIdentificador(identificador) {
        const usuarios = leerUsuarios();
        return usuarios.find(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(identificador) ||
                normalizarTexto(usuario.correo) === normalizarTexto(identificador);
        }) || null;
    }

    function actualizarPasswordUsuario(identificador, nuevaPassword) {
        const usuarios = leerUsuarios();
        const indiceUsuario = usuarios.findIndex(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(identificador) ||
                normalizarTexto(usuario.correo) === normalizarTexto(identificador);
        });

        if (indiceUsuario === -1) {
            return { ok: false, mensaje: 'No existe una cuenta asociada a ese usuario o correo.' };
        }

        usuarios[indiceUsuario].password = nuevaPassword;
        guardarUsuarios(usuarios);

        return {
            ok: true,
            mensaje: 'Contrasena actualizada correctamente. Ya puedes iniciar sesion con tu nueva clave.',
            usuario: usuarios[indiceUsuario]
        };
    }

    function actualizarPerfilUsuario(identificadorActual, datosActualizados) {
        const usuarios = leerUsuarios();
        const indiceUsuario = usuarios.findIndex(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(identificadorActual) ||
                normalizarTexto(usuario.correo) === normalizarTexto(identificadorActual);
        });

        if (indiceUsuario === -1) {
            return { ok: false, mensaje: 'No se encontro la cuenta que deseas actualizar.' };
        }

        const existeDuplicado = usuarios.some(function (usuario, indice) {
            if (indice === indiceUsuario) {
                return false;
            }

            return normalizarTexto(usuario.usuario) === normalizarTexto(datosActualizados.usuario) ||
                normalizarTexto(usuario.correo) === normalizarTexto(datosActualizados.correo);
        });

        if (existeDuplicado) {
            return { ok: false, mensaje: 'Ese usuario o correo ya esta siendo utilizado por otra cuenta.' };
        }

        usuarios[indiceUsuario] = Object.assign({}, usuarios[indiceUsuario], datosActualizados);
        guardarUsuarios(usuarios);

        return {
            ok: true,
            mensaje: 'Perfil actualizado correctamente.',
            usuario: usuarios[indiceUsuario]
        };
    }

    function obtenerUsuariosAdministrables() {
        return leerUsuarios().map(function (usuario) {
            return Object.assign({
                rol: 'cliente',
                estado: 'activo'
            }, usuario);
        });
    }

    function actualizarRolUsuario(identificador, nuevoRol) {
        const usuarios = leerUsuarios();
        const indiceUsuario = usuarios.findIndex(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(identificador) ||
                normalizarTexto(usuario.correo) === normalizarTexto(identificador);
        });

        if (indiceUsuario === -1) {
            return { ok: false, mensaje: 'No encontramos la cuenta seleccionada.' };
        }

        usuarios[indiceUsuario].rol = nuevoRol;
        guardarUsuarios(usuarios);

        return { ok: true, mensaje: 'Rol actualizado correctamente.' };
    }

    function actualizarEstadoUsuario(identificador, nuevoEstado) {
        const usuarios = leerUsuarios();
        const indiceUsuario = usuarios.findIndex(function (usuario) {
            return normalizarTexto(usuario.usuario) === normalizarTexto(identificador) ||
                normalizarTexto(usuario.correo) === normalizarTexto(identificador);
        });

        if (indiceUsuario === -1) {
            return { ok: false, mensaje: 'No encontramos la cuenta seleccionada.' };
        }

        if ((usuarios[indiceUsuario].rol || 'cliente') === 'admin' && nuevoEstado === 'bloqueado') {
            return { ok: false, mensaje: 'No puedes bloquear la cuenta administradora principal.' };
        }

        usuarios[indiceUsuario].estado = nuevoEstado;
        guardarUsuarios(usuarios);

        return {
            ok: true,
            mensaje: nuevoEstado === 'bloqueado'
                ? 'Cuenta bloqueada correctamente.'
                : 'Cuenta habilitada correctamente.'
        };
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
                direccion: campos.direccion.value.trim(),
                rol: 'cliente'
            });

            if (!resultado.ok) {
                mostrarFeedback(feedbackRegistro, resultado.mensaje, 'error');
                return;
            }

            guardarSesion({
                nombre: campos.nombre.value.trim(),
                usuario: campos.usuario.value.trim(),
                correo: campos.correo.value.trim(),
                rol: 'cliente'
            });

            actualizarNavbarSesion();

            mostrarFeedback(feedbackRegistro, resultado.mensaje, 'exito');

            setTimeout(function () {
                window.location.href = 'index.html';
            }, 1200);

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
            if (btnRecuperarClave.tagName === 'A') {
                btnRecuperarClave.setAttribute('href', 'recuperar.html');
            }
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
                const usuarioBloqueado = recuperarUsuarioPorIdentificador(loginUsuario.value);

                if (usuarioBloqueado && (usuarioBloqueado.estado || 'activo') === 'bloqueado') {
                    mostrarFeedback(feedbackLogin, 'Tu cuenta esta bloqueada. Debes contactar al administrador.', 'error');
                    mostrarError(loginUsuario, errorLoginUsuario, 'La cuenta se encuentra bloqueada.');
                    mostrarError(loginPassword, errorLoginPassword, 'La cuenta se encuentra bloqueada.');
                    return;
                }

                mostrarFeedback(feedbackLogin, 'Usuario o contrasena incorrectos.', 'error');
                mostrarError(loginUsuario, errorLoginUsuario, 'No se encontro una cuenta valida.');
                mostrarError(loginPassword, errorLoginPassword, 'No se encontro una cuenta valida.');
                return;
            }

            guardarSesion({
                nombre: usuarioEncontrado.nombre,
                usuario: usuarioEncontrado.usuario,
                correo: usuarioEncontrado.correo,
                rol: usuarioEncontrado.rol || 'cliente'
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
                window.location.href = 'recuperar.html';
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

    const formularioRecuperar = document.getElementById('formularioRecuperar');
    const feedbackRecuperar = document.getElementById('recuperarFeedback');

    if (formularioRecuperar) {
        const recuperarUsuario = document.getElementById('recuperarUsuario');
        const recuperarPassword = document.getElementById('recuperarPassword');
        const recuperarConfirmarPassword = document.getElementById('recuperarConfirmarPassword');
        const errorRecuperarUsuario = document.getElementById('errorRecuperarUsuario');
        const errorRecuperarPassword = document.getElementById('errorRecuperarPassword');
        const errorRecuperarConfirmarPassword = document.getElementById('errorRecuperarConfirmarPassword');

        formularioRecuperar.addEventListener('submit', function (event) {
            event.preventDefault();

            let esValido = true;
            const identificador = recuperarUsuario.value.trim();
            const nuevaPassword = recuperarPassword.value;
            const confirmarPassword = recuperarConfirmarPassword.value;

            if (!identificador) {
                mostrarError(recuperarUsuario, errorRecuperarUsuario, 'Ingresa tu usuario o correo.');
                esValido = false;
            } else if (!recuperarUsuarioPorIdentificador(identificador)) {
                mostrarError(recuperarUsuario, errorRecuperarUsuario, 'No encontramos una cuenta con ese dato.');
                esValido = false;
            } else {
                limpiarError(recuperarUsuario, errorRecuperarUsuario);
            }

            if (!nuevaPassword) {
                mostrarError(recuperarPassword, errorRecuperarPassword, 'Ingresa una nueva contrasena.');
                esValido = false;
            } else if (nuevaPassword.length < 6 || nuevaPassword.length > 18) {
                mostrarError(recuperarPassword, errorRecuperarPassword, 'La contrasena debe tener entre 6 y 18 caracteres.');
                esValido = false;
            } else if (!passwordSegura(nuevaPassword)) {
                mostrarError(recuperarPassword, errorRecuperarPassword, 'La contrasena debe incluir una mayuscula y un numero.');
                esValido = false;
            } else {
                limpiarError(recuperarPassword, errorRecuperarPassword);
            }

            if (!confirmarPassword) {
                mostrarError(recuperarConfirmarPassword, errorRecuperarConfirmarPassword, 'Confirma tu nueva contrasena.');
                esValido = false;
            } else if (nuevaPassword !== confirmarPassword) {
                mostrarError(recuperarConfirmarPassword, errorRecuperarConfirmarPassword, 'Las contrasenas deben ser iguales.');
                esValido = false;
            } else {
                limpiarError(recuperarConfirmarPassword, errorRecuperarConfirmarPassword);
            }

            if (!esValido) {
                mostrarFeedback(feedbackRecuperar, 'Revisa los campos marcados antes de continuar.', 'error');
                return;
            }

            const resultadoRecuperacion = actualizarPasswordUsuario(identificador, nuevaPassword);

            if (!resultadoRecuperacion.ok) {
                mostrarFeedback(feedbackRecuperar, resultadoRecuperacion.mensaje, 'error');
                return;
            }

            mostrarFeedback(feedbackRecuperar, resultadoRecuperacion.mensaje, 'exito');

            setTimeout(function () {
                window.location.href = 'loguin.html';
            }, 1400);
        });

        formularioRecuperar.addEventListener('reset', function () {
            setTimeout(function () {
                limpiarEstado(recuperarUsuario, errorRecuperarUsuario);
                limpiarEstado(recuperarPassword, errorRecuperarPassword);
                limpiarEstado(recuperarConfirmarPassword, errorRecuperarConfirmarPassword);
                ocultarPassword(recuperarPassword);
                ocultarPassword(recuperarConfirmarPassword);
                mostrarFeedback(feedbackRecuperar, '');
            }, 0);
        });

        recuperarPassword.addEventListener('blur', function () {
            setTimeout(function () {
                ocultarPassword(recuperarPassword);
            }, 120);
        });

        recuperarConfirmarPassword.addEventListener('blur', function () {
            setTimeout(function () {
                ocultarPassword(recuperarConfirmarPassword);
            }, 120);
        });
    }

    const formularioPerfil = document.getElementById('formularioPerfil');
    const feedbackPerfil = document.getElementById('perfilFeedback');

    if (formularioPerfil) {
        const perfilActual = obtenerUsuarioActual();
        const perfilNombre = document.getElementById('perfilNombre');
        const perfilUsuario = document.getElementById('perfilUsuario');
        const perfilCorreo = document.getElementById('perfilCorreo');
        const perfilFechaNacimiento = document.getElementById('perfilFechaNacimiento');
        const perfilDireccion = document.getElementById('perfilDireccion');
        const perfilPassword = document.getElementById('perfilPassword');
        const perfilConfirmarPassword = document.getElementById('perfilConfirmarPassword');

        const errorPerfilNombre = document.getElementById('errorPerfilNombre');
        const errorPerfilUsuario = document.getElementById('errorPerfilUsuario');
        const errorPerfilCorreo = document.getElementById('errorPerfilCorreo');
        const errorPerfilFechaNacimiento = document.getElementById('errorPerfilFechaNacimiento');
        const errorPerfilPassword = document.getElementById('errorPerfilPassword');
        const errorPerfilConfirmarPassword = document.getElementById('errorPerfilConfirmarPassword');

        if (perfilActual) {
            perfilNombre.value = perfilActual.nombre || '';
            perfilUsuario.value = perfilActual.usuario || '';
            perfilCorreo.value = perfilActual.correo || '';
            perfilFechaNacimiento.value = perfilActual.fechaNacimiento || '';
            perfilDireccion.value = perfilActual.direccion || '';
        }

        formularioPerfil.addEventListener('submit', function (event) {
            event.preventDefault();

            const datosPerfil = {
                nombre: perfilNombre.value.trim(),
                usuario: perfilUsuario.value.trim(),
                correo: perfilCorreo.value.trim(),
                fechaNacimiento: perfilFechaNacimiento.value,
                direccion: perfilDireccion.value.trim()
            };

            const nuevaPassword = perfilPassword.value;
            const confirmarPassword = perfilConfirmarPassword.value;
            let esValido = true;

            if (!datosPerfil.nombre) {
                mostrarError(perfilNombre, errorPerfilNombre, 'El nombre completo es obligatorio.');
                esValido = false;
            } else {
                limpiarError(perfilNombre, errorPerfilNombre);
            }

            if (!datosPerfil.usuario) {
                mostrarError(perfilUsuario, errorPerfilUsuario, 'El usuario es obligatorio.');
                esValido = false;
            } else {
                limpiarError(perfilUsuario, errorPerfilUsuario);
            }

            if (!datosPerfil.correo) {
                mostrarError(perfilCorreo, errorPerfilCorreo, 'El correo electronico es obligatorio.');
                esValido = false;
            } else if (!correoValido(datosPerfil.correo)) {
                mostrarError(perfilCorreo, errorPerfilCorreo, 'Ingresa un correo electronico valido.');
                esValido = false;
            } else {
                limpiarError(perfilCorreo, errorPerfilCorreo);
            }

            if (!datosPerfil.fechaNacimiento) {
                mostrarError(perfilFechaNacimiento, errorPerfilFechaNacimiento, 'La fecha de nacimiento es obligatoria.');
                esValido = false;
            } else if (!tieneEdadMinima(datosPerfil.fechaNacimiento)) {
                mostrarError(perfilFechaNacimiento, errorPerfilFechaNacimiento, 'Debes tener al menos 13 anos para usar el sitio.');
                esValido = false;
            } else {
                limpiarError(perfilFechaNacimiento, errorPerfilFechaNacimiento);
            }

            if (nuevaPassword || confirmarPassword) {
                if (nuevaPassword.length < 6 || nuevaPassword.length > 18) {
                    mostrarError(perfilPassword, errorPerfilPassword, 'La contrasena debe tener entre 6 y 18 caracteres.');
                    esValido = false;
                } else if (!passwordSegura(nuevaPassword)) {
                    mostrarError(perfilPassword, errorPerfilPassword, 'La contrasena debe incluir una mayuscula y un numero.');
                    esValido = false;
                } else {
                    limpiarError(perfilPassword, errorPerfilPassword);
                }

                if (!confirmarPassword) {
                    mostrarError(perfilConfirmarPassword, errorPerfilConfirmarPassword, 'Confirma tu nueva contrasena.');
                    esValido = false;
                } else if (nuevaPassword !== confirmarPassword) {
                    mostrarError(perfilConfirmarPassword, errorPerfilConfirmarPassword, 'Las contrasenas deben ser iguales.');
                    esValido = false;
                } else {
                    limpiarError(perfilConfirmarPassword, errorPerfilConfirmarPassword);
                }
            } else {
                limpiarEstado(perfilPassword, errorPerfilPassword);
                limpiarEstado(perfilConfirmarPassword, errorPerfilConfirmarPassword);
            }

            if (!esValido) {
                mostrarFeedback(feedbackPerfil, 'Revisa los campos marcados antes de guardar tu perfil.', 'error');
                return;
            }

            if (nuevaPassword) {
                datosPerfil.password = nuevaPassword;
            }

            const sesionActiva = leerSesion();
            const resultadoPerfil = actualizarPerfilUsuario(sesionActiva.usuario || sesionActiva.correo, datosPerfil);

            if (!resultadoPerfil.ok) {
                mostrarFeedback(feedbackPerfil, resultadoPerfil.mensaje, 'error');
                return;
            }

            guardarSesion({
                nombre: resultadoPerfil.usuario.nombre,
                usuario: resultadoPerfil.usuario.usuario,
                correo: resultadoPerfil.usuario.correo,
                rol: resultadoPerfil.usuario.rol || 'cliente'
            });

            actualizarNavbarSesion();
            ocultarPassword(perfilPassword);
            ocultarPassword(perfilConfirmarPassword);
            perfilPassword.value = '';
            perfilConfirmarPassword.value = '';
            mostrarFeedback(feedbackPerfil, resultadoPerfil.mensaje, 'exito');
        });

        formularioPerfil.addEventListener('reset', function () {
            setTimeout(function () {
                const usuarioRecargado = obtenerUsuarioActual();

                if (usuarioRecargado) {
                    perfilNombre.value = usuarioRecargado.nombre || '';
                    perfilUsuario.value = usuarioRecargado.usuario || '';
                    perfilCorreo.value = usuarioRecargado.correo || '';
                    perfilFechaNacimiento.value = usuarioRecargado.fechaNacimiento || '';
                    perfilDireccion.value = usuarioRecargado.direccion || '';
                }

                limpiarEstado(perfilNombre, errorPerfilNombre);
                limpiarEstado(perfilUsuario, errorPerfilUsuario);
                limpiarEstado(perfilCorreo, errorPerfilCorreo);
                limpiarEstado(perfilFechaNacimiento, errorPerfilFechaNacimiento);
                limpiarEstado(perfilPassword, errorPerfilPassword);
                limpiarEstado(perfilConfirmarPassword, errorPerfilConfirmarPassword);
                ocultarPassword(perfilPassword);
                ocultarPassword(perfilConfirmarPassword);
                perfilPassword.value = '';
                perfilConfirmarPassword.value = '';
                mostrarFeedback(feedbackPerfil, '');
            }, 0);
        });

        perfilPassword.addEventListener('blur', function () {
            setTimeout(function () {
                ocultarPassword(perfilPassword);
            }, 120);
        });

        perfilConfirmarPassword.addEventListener('blur', function () {
            setTimeout(function () {
                ocultarPassword(perfilConfirmarPassword);
            }, 120);
        });
    }

    const carritoPagina = document.getElementById('carritoPagina');

    if (carritoPagina) {
        const carritoLista = document.getElementById('carritoLista');
        const carritoVacio = document.getElementById('carritoVacio');
        const carritoResumen = document.getElementById('carritoResumen');
        const carritoTotal = document.getElementById('carritoTotal');
        const carritoCantidad = document.getElementById('carritoCantidad');
        const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
        const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

        function renderizarCarrito() {
            const carrito = leerCarritoActual();

            if (!carrito.length) {
                carritoLista.innerHTML = '';
                carritoVacio.hidden = false;
                carritoResumen.hidden = true;
                return;
            }

            carritoVacio.hidden = true;
            carritoResumen.hidden = false;

            let total = 0;
            let cantidadTotal = 0;

            carritoLista.innerHTML = carrito.map(function (item) {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                cantidadTotal += item.cantidad;

                return [
                    '<article class="carrito-item">',
                    '  <img src="' + item.imagen + '" alt="' + item.nombre + '" class="carrito-item-imagen">',
                    '  <div class="carrito-item-contenido">',
                    '      <div class="carrito-item-head">',
                    '          <div>',
                    '              <span class="carrito-item-categoria">' + item.categoria + '</span>',
                    '              <h3>' + item.nombre + '</h3>',
                    (item.oferta ? '              <div class="estado-descuento">' + item.oferta + '</div>' : ''),
                    '          </div>',
                    '          <button type="button" class="carrito-eliminar" data-cart-remove="' + item.id + '">Quitar</button>',
                    '      </div>',
                    '      <div class="carrito-item-precios">',
                    (item.precioOriginal ? '          <span class="precio-original">' + formatearPrecio(item.precioOriginal) + '</span>' : ''),
                    '          <span class="' + (item.precioOriginal ? 'precio-oferta' : 'carrito-precio-normal') + '">' + formatearPrecio(item.precio) + '</span>',
                    '      </div>',
                    '      <div class="carrito-item-footer">',
                    '          <div class="carrito-cantidad-control">',
                    '              <button type="button" data-cart-change="' + item.id + '" data-cart-delta="-1">-</button>',
                    '              <span>' + item.cantidad + '</span>',
                    '              <button type="button" data-cart-change="' + item.id + '" data-cart-delta="1">+</button>',
                    '          </div>',
                    '          <strong class="carrito-subtotal">' + formatearPrecio(subtotal) + '</strong>',
                    '      </div>',
                    '  </div>',
                    '</article>'
                ].join('');
            }).join('');

            carritoTotal.textContent = formatearPrecio(total);
            carritoCantidad.textContent = cantidadTotal + (cantidadTotal === 1 ? ' producto' : ' productos');
        }

        function actualizarCantidadCarrito(idProducto, delta) {
            const carrito = leerCarritoActual();
            const indiceProducto = carrito.findIndex(function (item) {
                return item.id === idProducto;
            });

            if (indiceProducto === -1) {
                return;
            }

            carrito[indiceProducto].cantidad += delta;

            if (carrito[indiceProducto].cantidad <= 0) {
                carrito.splice(indiceProducto, 1);
            }

            guardarCarritoActual(carrito);
            renderizarCarrito();
        }

        function eliminarProductoCarrito(idProducto) {
            const carrito = leerCarritoActual().filter(function (item) {
                return item.id !== idProducto;
            });

            guardarCarritoActual(carrito);
            renderizarCarrito();
        }

        if (btnVaciarCarrito) {
            btnVaciarCarrito.addEventListener('click', function () {
                guardarCarritoActual([]);
                renderizarCarrito();
            });
        }

        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', function () {
                const carrito = leerCarritoActual();
                const productos = leerProductos();

                if (!carrito.length) {
                    return;
                }

                const sinStock = carrito.find(function (item) {
                    const producto = productos.find(function (productoActual) {
                        return productoActual.id === item.id;
                    });

                    return !producto || producto.estado === 'inactivo' || Number(producto.stock || 0) < item.cantidad;
                });

                if (sinStock) {
                    alert('No hay stock suficiente para completar la compra de ' + sinStock.nombre + '.');
                    return;
                }

                const total = carrito.reduce(function (acumulado, item) {
                    return acumulado + (item.precio * item.cantidad);
                }, 0);
                const compras = leerComprasActuales();

                compras.unshift({
                    id: 'COMP-' + Date.now(),
                    fecha: new Date().toISOString(),
                    estado: 'Confirmada',
                    total: total,
                    items: carrito
                });

                carrito.forEach(function (item) {
                    const producto = productos.find(function (productoActual) {
                        return productoActual.id === item.id;
                    });
                    producto.stock = Number(producto.stock || 0) - item.cantidad;
                });

                guardarProductos(productos);
                guardarComprasActuales(compras);
                guardarCarritoActual([]);
                window.location.href = 'mis-compras.html?compra=exitosa';
            });
        }

        document.addEventListener('click', function (event) {
            const botonCantidad = event.target.closest('[data-cart-change]');
            const botonEliminar = event.target.closest('[data-cart-remove]');

            if (botonCantidad) {
                actualizarCantidadCarrito(botonCantidad.dataset.cartChange, Number(botonCantidad.dataset.cartDelta));
            }

            if (botonEliminar) {
                eliminarProductoCarrito(botonEliminar.dataset.cartRemove);
            }
        });

        renderizarCarrito();
    }

    const misComprasPagina = document.getElementById('misComprasPagina');

    if (misComprasPagina) {
        const comprasLista = document.getElementById('comprasLista');
        const comprasVacio = document.getElementById('comprasVacio');
        const comprasFeedback = document.getElementById('comprasFeedback');
        const compras = leerComprasActuales();

        if (new URLSearchParams(window.location.search).get('compra') === 'exitosa') {
            mostrarFeedback(comprasFeedback, 'Compra confirmada correctamente. Ya puedes revisar su detalle.', 'exito');
        }

        if (!compras.length) {
            comprasVacio.hidden = false;
            comprasLista.innerHTML = '';
        } else {
            comprasVacio.hidden = true;
            comprasLista.innerHTML = compras.map(function (compra) {
                const fecha = new Date(compra.fecha);
                const fechaCompra = fecha.toLocaleDateString('es-CL');
                const horaCompra = fecha.toLocaleTimeString('es-CL', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const cantidadProductos = compra.items.reduce(function (total, item) {
                    return total + item.cantidad;
                }, 0);

                return [
                    '<article class="compra-card">',
                    '  <div class="compra-card-head">',
                    '      <div>',
                    '          <span class="carrito-item-categoria">Orden ' + compra.id + '</span>',
                    '          <h3>Compra realizada</h3>',
                    '          <p class="compra-fecha">' + fechaCompra + ' a las ' + horaCompra + '</p>',
                    '      </div>',
                    '      <span class="compra-estado">' + compra.estado + '</span>',
                    '  </div>',
                    '  <div class="compra-productos">',
                    compra.items.map(function (item) {
                        return [
                            '<div class="compra-producto">',
                            '  <img src="' + item.imagen + '" alt="' + item.nombre + '" class="compra-producto-imagen">',
                            '  <div class="compra-producto-info">',
                            '      <span class="carrito-item-categoria">' + item.categoria + '</span>',
                            '      <h4>' + item.nombre + '</h4>',
                            '      <span>' + item.cantidad + (item.cantidad === 1 ? ' unidad' : ' unidades') + ' · ' + formatearPrecio(item.precio) + ' c/u</span>',
                            '  </div>',
                            '  <strong class="compra-producto-precio">' + formatearPrecio(item.precio * item.cantidad) + '</strong>',
                            '</div>'
                        ].join('');
                    }).join(''),
                    '  </div>',
                    '  <div class="compra-card-total"><span>Total · ' + cantidadProductos + (cantidadProductos === 1 ? ' producto' : ' productos') + '</span><strong>' + formatearPrecio(compra.total) + '</strong></div>',
                    '</article>'
                ].join('');
            }).join('');
        }
    }

    const adminMenuOpciones = document.querySelectorAll('[data-admin-view]');
    const adminVistas = document.querySelectorAll('[data-admin-panel]');

    function mostrarVistaAdmin(nombreVista) {
        adminMenuOpciones.forEach(function (opcion) {
            const estaActiva = opcion.dataset.adminView === nombreVista;
            opcion.classList.toggle('activo', estaActiva);
            opcion.setAttribute('aria-pressed', String(estaActiva));
        });

        adminVistas.forEach(function (vista) {
            const estaActiva = vista.dataset.adminPanel === nombreVista;
            vista.hidden = !estaActiva;
            vista.classList.toggle('activo', estaActiva);
        });
    }

    adminMenuOpciones.forEach(function (opcion) {
        opcion.addEventListener('click', function () {
            mostrarVistaAdmin(opcion.dataset.adminView);
        });
    });

    const adminUsuariosLista = document.getElementById('adminUsuariosLista');

    if (adminUsuariosLista) {
        const adminUsuariosVacio = document.getElementById('adminUsuariosVacio');
        const adminUsuariosCantidad = document.getElementById('adminUsuariosCantidad');
        const adminUsuariosActivos = document.getElementById('adminUsuariosActivos');
        const adminUsuariosFeedback = document.getElementById('adminUsuariosFeedback');

        function renderizarAdminUsuarios() {
            const usuarios = obtenerUsuariosAdministrables();
            const usuariosActivos = usuarios.filter(function (usuario) {
                return (usuario.estado || 'activo') !== 'bloqueado';
            });

            adminUsuariosCantidad.textContent = usuarios.length;
            adminUsuariosActivos.textContent = usuariosActivos.length;

            if (!usuarios.length) {
                adminUsuariosLista.innerHTML = '';
                adminUsuariosVacio.hidden = false;
                return;
            }

            adminUsuariosVacio.hidden = true;
            adminUsuariosLista.innerHTML = usuarios.map(function (usuario) {
                const rolActual = usuario.rol || 'cliente';
                const estadoActual = usuario.estado || 'activo';
                const identificador = usuario.usuario || usuario.correo;

                return [
                    '<article class="admin-usuario-card ' + (estadoActual === 'bloqueado' ? 'admin-usuario-bloqueado' : '') + '">',
                    '  <div class="admin-usuario-info">',
                    '      <div>',
                    '          <span class="carrito-item-categoria">' + (rolActual === 'admin' ? 'Administrador' : 'Cliente') + '</span>',
                    '          <h3>' + usuario.nombre + '</h3>',
                    '          <p><strong>Usuario:</strong> ' + usuario.usuario + '</p>',
                    '          <p><strong>Correo:</strong> ' + usuario.correo + '</p>',
                    '      </div>',
                    '      <span class="admin-usuario-estado estado-' + estadoActual + '">' + estadoActual + '</span>',
                    '  </div>',
                    '  <div class="admin-usuario-acciones">',
                    '      <label class="admin-control">',
                    '          <span>Rol</span>',
                    '          <select data-admin-role="' + identificador + '"' + (usuario.usuario === 'admin' ? ' disabled' : '') + '>',
                    '              <option value="cliente"' + (rolActual === 'cliente' ? ' selected' : '') + '>Cliente</option>',
                    '              <option value="admin"' + (rolActual === 'admin' ? ' selected' : '') + '>Administrador</option>',
                    '          </select>',
                    '      </label>',
                    '      <button type="button" class="btn btn-secondary admin-toggle-estado" data-admin-toggle="' + identificador + '" data-admin-estado="' + estadoActual + '"' +
                    (usuario.usuario === 'admin' ? ' disabled' : '') + '>' +
                    (estadoActual === 'bloqueado' ? 'Habilitar cuenta' : 'Bloquear cuenta') +
                    '</button>',
                    '  </div>',
                    '</article>'
                ].join('');
            }).join('');
        }

        adminUsuariosLista.addEventListener('change', function (event) {
            const selectorRol = event.target.closest('[data-admin-role]');

            if (!selectorRol) {
                return;
            }

            const resultadoRol = actualizarRolUsuario(selectorRol.dataset.adminRole, selectorRol.value);
            mostrarFeedback(adminUsuariosFeedback, resultadoRol.mensaje, resultadoRol.ok ? 'exito' : 'error');
            renderizarAdminUsuarios();
        });

        adminUsuariosLista.addEventListener('click', function (event) {
            const botonEstado = event.target.closest('[data-admin-toggle]');

            if (!botonEstado) {
                return;
            }

            const siguienteEstado = botonEstado.dataset.adminEstado === 'bloqueado' ? 'activo' : 'bloqueado';
            const resultadoEstado = actualizarEstadoUsuario(botonEstado.dataset.adminToggle, siguienteEstado);
            mostrarFeedback(adminUsuariosFeedback, resultadoEstado.mensaje, resultadoEstado.ok ? 'exito' : 'error');
            renderizarAdminUsuarios();
        });

        renderizarAdminUsuarios();
    }

    const adminProductosLista = document.getElementById('adminProductosLista');

    if (adminProductosLista) {
        const adminProductoForm = document.getElementById('adminProductoForm');
        const adminProductosCantidad = document.getElementById('adminProductosCantidad');
        const adminStockTotal = document.getElementById('adminStockTotal');
        const adminProductosFeedback = document.getElementById('adminProductosFeedback');
        const productoId = document.getElementById('productoId');
        const productoNombre = document.getElementById('productoNombre');
        const productoCategoria = document.getElementById('productoCategoria');
        const productoPrecio = document.getElementById('productoPrecio');
        const productoPrecioOriginal = document.getElementById('productoPrecioOriginal');
        const productoStock = document.getElementById('productoStock');
        const productoImagen = document.getElementById('productoImagen');
        const productoOferta = document.getElementById('productoOferta');
        const productoEstado = document.getElementById('productoEstado');
        const btnCancelarProducto = document.getElementById('btnCancelarProducto');

        function renderizarAdminProductos() {
            const productos = leerProductos();
            const stockTotal = productos.reduce(function (total, producto) {
                return total + Number(producto.stock || 0);
            }, 0);

            adminProductosCantidad.textContent = productos.length;
            adminStockTotal.textContent = stockTotal;
            adminProductosLista.innerHTML = productos.map(function (producto) {
                return [
                    '<article class="admin-producto-card">',
                    '  <img src="' + producto.imagen + '" alt="' + producto.nombre + '">',
                    '  <div class="admin-producto-info">',
                    '      <span class="carrito-item-categoria">' + producto.categoria + '</span>',
                    '      <h3>' + producto.nombre + '</h3>',
                    '      <div class="admin-producto-datos">',
                    '          <span>Precio <strong>' + formatearPrecio(producto.precio) + '</strong></span>',
                    '          <span>Stock <strong>' + Number(producto.stock || 0) + '</strong></span>',
                    '          <span class="admin-usuario-estado estado-' + (producto.estado || 'activo') + '">' + (producto.estado || 'activo') + '</span>',
                    '      </div>',
                    '  </div>',
                    '  <button type="button" class="btn btn-secondary" data-product-edit="' + producto.id + '">Editar</button>',
                    '</article>'
                ].join('');
            }).join('');
        }

        function limpiarFormularioProducto() {
            adminProductoForm.reset();
            productoId.value = '';
            productoEstado.value = 'activo';
            btnCancelarProducto.hidden = true;
        }

        adminProductoForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const productos = leerProductos();
            const nombre = productoNombre.value.trim();
            const idActual = productoId.value;
            const precio = Number(productoPrecio.value);
            const stock = Number(productoStock.value);

            if (!nombre || !productoCategoria.value || !productoImagen.value.trim() || precio <= 0 || stock < 0) {
                mostrarFeedback(adminProductosFeedback, 'Completa nombre, categoria, imagen, precio y stock con valores validos.', 'error');
                return;
            }

            const datosProducto = {
                id: idActual || normalizarClave(nombre).replace(/\s+/g, '-'),
                nombre: nombre,
                aliases: [nombre],
                categoria: productoCategoria.value,
                precio: precio,
                precioOriginal: Number(productoPrecioOriginal.value) || null,
                stock: stock,
                imagen: productoImagen.value.trim(),
                oferta: productoOferta.value.trim(),
                estado: productoEstado.value
            };
            const indiceProducto = productos.findIndex(function (producto) {
                return producto.id === datosProducto.id;
            });

            if (indiceProducto === -1) {
                productos.push(datosProducto);
            } else {
                datosProducto.aliases = productos[indiceProducto].aliases || [nombre];
                productos[indiceProducto] = datosProducto;
            }

            guardarProductos(productos);
            mostrarFeedback(adminProductosFeedback, indiceProducto === -1 ? 'Producto creado correctamente.' : 'Producto actualizado correctamente.', 'exito');
            limpiarFormularioProducto();
            renderizarAdminProductos();
        });

        adminProductosLista.addEventListener('click', function (event) {
            const botonEditar = event.target.closest('[data-product-edit]');

            if (!botonEditar) {
                return;
            }

            const producto = leerProductos().find(function (productoActual) {
                return productoActual.id === botonEditar.dataset.productEdit;
            });

            if (!producto) {
                return;
            }

            productoId.value = producto.id;
            productoNombre.value = producto.nombre;
            productoCategoria.value = producto.categoria;
            productoPrecio.value = producto.precio;
            productoPrecioOriginal.value = producto.precioOriginal || '';
            productoStock.value = producto.stock || 0;
            productoImagen.value = producto.imagen;
            productoOferta.value = producto.oferta || '';
            productoEstado.value = producto.estado || 'activo';
            btnCancelarProducto.hidden = false;
            adminProductoForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        btnCancelarProducto.addEventListener('click', limpiarFormularioProducto);
        renderizarAdminProductos();
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

    asegurarUsuarioAdmin();
    protegerVistaAdmin();
    protegerVistaCarrito();
    protegerVistaPerfil();
    actualizarNavbarSesion();
    sincronizarTarjetasCatalogo();
});
