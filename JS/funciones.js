$(document).ready(() => {

    let urlBase = "https://reqres.in";
    let listUserEP = "/api/users?page=";
    let singleUserEP = "/api/users/?id=";
    let singleUserEP2 = "/api/users/";
    let idConsultar;
    let pagina = 1;
    let nombreNuevo;
    let apellidoNuevo;
    let emailNuevo;
    let avatarNuevo;
    let totalUsuarios;

    $("#cargando-form-agregar").hide();
    $("#btn-mostrarMas").hide();
    $("#cargando").hide();
    consultarUsers();

    $("#btn-mostrarMas").click(() => {
        pagina++;
        consultarUsers(pagina);
    })

    function consultarUsers() {
        $("#tabla-contenido").hide();
        $("#cargando").show();

        fetch(urlBase + listUserEP + pagina)
            .then((resultado) => {
                if (resultado.ok)
                    return resultado.json();
                else
                    console.log("error...")
            })
            .then((respuesta) => {
                mostrarResultados(respuesta);

                // FUNCION CLICK PARA GET EL ID PARA FORM EDITAR
                $(`#cont-btn-editar > button`).click(function () {
                    idConsultar = this.value;
                    consultarSingleUser(idConsultar)
                });

                // BOTON: GUARDAR EN MODAL: EDITAR
                $("#btn-guardar").click(function () {
                    console.log(`Actualizar => id: ${idConsultar}`)
                    actualizarSingleUser(idConsultar);
                });

                // BOTON BORRAR SOLO FUNCIONA CON USER DEFAULT DE LA API
                $(`#cont-btn-borrar > button`).click(function () {
                    let idEliminar = this.value;
                    let trEliminar = this.name;
                    console.log(`Eliminar => id: ${idEliminar}`);
                    console.log(`Eliminar => tr: ${trEliminar}`);
                    borrarSingleUser(idEliminar, trEliminar);
                });
            })
            .catch(function (error) {
                console.log("error ")
                console.log(error)
                if (error.responseJSON) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error en la peticion. La respuesta fue: ' + error.responseJSON.Error,
                    })
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error en la peticion',
                    })
                }
            })
            .finally(() => {
                // se ejecuta siempre
                $("#cargando").hide()
                $("#tabla-contenido").show();
                console.log("User cargados y mostrados en página");
            })
    }

    function mostrarResultados(respuesta) {
        for (i = 0; i < respuesta.data.length; i++) {

            $("#cuerpo-tabla").append(`<tr id="tr${respuesta.data[i].id}" class="align-middle">
                <td>${respuesta.data[i].id}</td>
                <td><img class="border border-secondary border-3 rounded" src="${respuesta.data[i].avatar}" width="80" height="80"></td>
                <td>${respuesta.data[i].first_name}</td>
                <td>${respuesta.data[i].last_name}</td>
                <td>${respuesta.data[i].email}</td>
                <td id="cont-btn-editar"><button value="${respuesta.data[i].id}" type="button" class="botonesEditar btn btn-primary" data-bs-toggle="modal" data-bs-target="#editarModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                    </button>
                </td>
                <td id="cont-btn-borrar"><button value="${respuesta.data[i].id}" name="tr${respuesta.data[i].id}" type="button" class="btn btn-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                </button>
                </td>
              </tr>
              `)
        }

        totalUsuarios = respuesta.total;
        $("#mostarTotalUsers").text(totalUsuarios);

        if (pagina == respuesta.total_pages) {
            $("#btn-mostrarMas").hide();
        }
        else
            $("#btn-mostrarMas").show();
    }

    function validarTexto(texto) {
        let patronTexto = /^[A-Za-z0-9-]/;

        if (!patronTexto.test(texto)) {
            return false
        } else
            return true
    }

    function validarEmail(email) {
        let patronEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        if (!email.match(patronEmail)) {
            return false
        } else
            return true
    }

    function todoValido() {
        let nombreAgregar = $("#nombreAgregar").val();
        let nombreVal = false;
        let apellidoAgregar = $("#apellidoAgregar").val();
        let apellidoVal = false;
        let emailAgregar = $("#emailAgregar").val();
        let emailVal = false;

        if (validarTexto(nombreAgregar) == false) {
            Swal.fire({
                icon: 'error',
                title: 'Nombre Incorrecto',
                text: 'Solo puede contener caracteres alfanuméricos y guiones (-)!',
            })
            nombreVal = false;
        } else {
            nombreVal = true;
        }

        if (validarTexto(apellidoAgregar) == false) {
            Swal.fire({
                icon: 'error',
                title: 'Apellido Incorrecto',
                text: 'Solo puede contener caracteres alfanuméricos y guiones (-)!',
            })
            apellidoVal = false;
        } else {
            apellidoVal = true;
        }

        if (validarEmail(emailAgregar) == false) {
            Swal.fire({
                icon: 'error',
                title: 'Email Incorrecto',
                text: 'Asegúrese de ingresar una dirección de correo válida.',
            })
            emailVal = false;
        } else {
            emailVal = true;
        }

        if (nombreVal == true && apellidoVal == true && emailVal == true)
            return true
        else
            return false

    }

    // BOTON: ENVIAR EN MODAL: AGREGAR
    $("#btn-enviarAgregar").click(() => {

        let datosFormAgregar = new URLSearchParams({
            "email": $("#emailAgregar").val(),
            "first_name": $("#nombreAgregar").val(),
            "last_name": $("#apellidoAgregar").val(),
            "avatar": $("#avatarAgregar").val()
        });

        console.log(datosFormAgregar);

        if (!todoValido())
            console.log("Datos invalidos")
        else {
            $("#cargando-form-agregar").show();
            $("#formularioAgregar").hide();
            $("#btn-enviarAgregar").attr("disabled", true)

            let endPoint = "/api/users";

            fetch(urlBase + endPoint, {
                body: datosFormAgregar,
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((respAgregar) => {
                console.log(respAgregar)
                if (respAgregar.ok) {
                    return respAgregar.json();
                } else {
                    console.log("Error en los datos...");
                    $("#enviarMensaje").text("Error en los datos...");
                    $("#formularioAgregar").show();
                    $("#agregarModal").modal(`show`);
                }
            })
                .then((datosAgregar) => {
                    // para procesar la respuesta del backend
                    console.log(datosAgregar);

                    Swal.fire({
                        position: 'top-end',
                        toast: true,
                        icon: 'success',
                        text: "Se registro exitosamente con el id: " + datosAgregar.id + " fecha: " + datosAgregar.createdAt,
                        showConfirmButton: false,
                        timer: 5000
                    }).then(function () {
                        mostrarNuevoUser(datosAgregar.id, datosAgregar.email, datosAgregar.first_name, datosAgregar.last_name, datosAgregar.avatar);
                        
                        totalUsuarios++;
                        $("#mostarTotalUsers").text(totalUsuarios);
                        
                    })
                    $("#agregarModal").modal(`hide`);
                    $("#formularioAgregar")[0].reset();
                })
                .catch(() => {
                    console.log("Error de comunicacion...")
                    $("#enviarMensaje").text("Error de comunicacion...");
                    $("#formularioAgregar").show();
                    $("#agregarModal").modal(`show`);
                })
                .finally(() => {
                    $("#cargando-form-agregar").hide();
                    $("#btn-enviarAgregar").attr("disabled", false);
                })
        }
    })

    function mostrarNuevoUser(idNuevo, emailNuevo, nombreNuevo, apellidoNuevo, avatarNuevo) {

        $("#cuerpo-tabla").append(`<tr id="tr${idNuevo}" class="align-middle">
                <td>${idNuevo}</td>
                <td><img class="border border-secondary border-3 rounded" src="${avatarNuevo}" width="80" height="80"></td>
                <td>${nombreNuevo}</td>
                <td>${apellidoNuevo}</td>
                <td>${emailNuevo}</td>
                <td id="cont-btn-editar"><button value="${idNuevo}" type="button" class="botonesEditar btn btn-primary" data-bs-toggle="modal" data-bs-target="#editarModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                    </button>
                </td>
                <td id="cont-btn-borrar"><button value="${idNuevo}" name="tr${idNuevo}" type="button" class="btn btn-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                    </svg>
                </button>
                </td>
              </tr>
              `)
    }

    function consultarSingleUser(idConsultar) {
        $("#formEditar").hide()
        $("#cargando-form-editar").show();

        console.log(`id del User a editar: ${idConsultar}`);

        fetch(urlBase + singleUserEP + idConsultar)
            .then((resultadoSingleUser) => {
                if (resultadoSingleUser.ok)
                    return resultadoSingleUser.json();
                else
                    console.log("error...")
            })
            .then((respuestaSingleUser) => {
                mostrarResultadosSingleUser(respuestaSingleUser)
            })
            .catch(function (error) {
                console.log("error ")
                console.log(error)
                if (error.responseJSON) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error en la peticion. La respuesta fue: ' + error.responseJSON.Error,
                    })
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error en la peticion',
                    })
                }
            })
            .finally(() => {
                // se ejecuta siempre
                $("#cargando-form-editar").hide()
                $("#formEditar").show();
                console.log("User cargado, listo para editar");
            })
    }

    function mostrarResultadosSingleUser(respuestaSingleUser) {
        $("#mostrarNombreEditar").text(respuestaSingleUser.data.first_name);
        $("#mostrarApellidoEditar").text(respuestaSingleUser.data.last_name);
        $("#mostrarEmailEditar").text(respuestaSingleUser.data.email);
        $("#mostrarAvatarEditar").attr("src", respuestaSingleUser.data.avatar);
    }

    function actualizarSingleUser(idActualizar) {

        let datosFormEditar = new URLSearchParams({
            "email": $("#inputEmailEditar").val(),
            "first_name": $("#inputNombreEditar").val(),
            "last_name": $("#inputApellidoEditar").val(),
            "avatar": $("#inputAvatarEditar").val()
        });

        $("#cargando-form-editar").show();
        $("#formEditar").hide();
        $("#btn-guardar").attr("disabled", true)

        fetch(urlBase + singleUserEP2 + idActualizar, {
            body: datosFormEditar,
            method: "PUT",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        })
            .then((respAct) => {
                if (respAct.ok) {
                    console.log(respAct)
                    return respAct.json()
                } else if (!respAct.ok) {
                    const error = (data && data.message) || response.status;
                    console.log("Error en los datos...");
                    $("#enviarMensajeEditar").text("Error en los datos...");
                    $("#formEditar").show();
                    $("#agregarModal").modal(`show`);
                    return Promise.reject(error);
                }
            })
            .then((datosAct) => {
                // para procesar la respuesta del backend
                console.log(datosAct);

                Swal.fire({
                    position: 'top-end',
                    toast: true,
                    icon: 'success',
                    text: "Actualizado exitosamente. Fecha: " + datosAct.updatedAt,
                    showConfirmButton: false,
                    timer: 5000
                })
                $("#formEditar")[0].reset();
                $("#editarModal").modal(`hide`);
            })
            .catch(() => {
                console.log("Error de comunicacion...")
                $("#enviarMensajeEditar").text("Error de comunicacion...");
                $("#formEditar").show();
                $("#editarModal").modal(`show`);
            })
            .finally(() => {
                $("#cargando-form-editar").hide();
                $("#btn-guardar").attr("disabled", false);
            })
    }

    function borrarSingleUser(idBorrar, idTrBorrar) {

        $("#cargando").show();

        fetch(urlBase + singleUserEP2 + idBorrar, {
            method: "delete",
        })
            .then((respDel) => {
                if (respDel.ok) {
                    console.log(respDel);
                    return respDel;
                } else if (!respDel.ok) {
                    const error = (data && data.message) || response.status;
                    console.log("Error en los datos...");
                    return Promise.reject(error);
                }
            })
            .then((datosDel) => {
                // para procesar la respuesta del backend
                console.log(datosDel);
                $(`#${idTrBorrar}`).remove();
                
                totalUsuarios--;
                $("#mostarTotalUsers").text(totalUsuarios);
                
                Swal.fire({
                    position: 'top-end',
                    toast: true,
                    icon: 'info',
                    text: "User eliminado",
                    showConfirmButton: false,
                    timer: 5000
                })
            })
            .catch((errorDel) => {
                console.log(`Error de comunicacion: ${errorDel}`)

                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar',
                    text: 'Error de comunicacion',
                    showConfirmButton: false
                })
            })
            .finally(() => {
                $("#cargando").hide();
            })
    }
})