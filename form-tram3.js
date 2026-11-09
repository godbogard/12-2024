var auth3;
var auth4;

jQuery(function () {
    var id_tema_tramites = 15; // <-- CAMBIA esto por el ID del tema de trámites
    jQuery("#hidden-tramites").load("/post?t=" + id_tema_tramites + "&mode=reply form[action='/post']");
});

// --- Añadir una nueva fila de tipo de trámite ---
function agregarTipoTramite(boton) {
    var contenedor = document.getElementById("tram-tipos");
    var fila = document.createElement("div");
    fila.className = "tram-tipo-row";
    fila.innerHTML =
        '<select class="labelclas0 tram-tipo-select" name="tramtipo[]" required>' +
          '<option value="">— Selecciona un tipo de trámite —</option>' +
          '<option value="Moderación de sistema" style="color:#58ad9f;">Moderación de sistema</option>' +
          '<option value="Mover/Abrir un tema" style="color:#9d4edd;">Mover/Abrir un tema</option>' +
          '<option value="Abrir/Cerrar una ficha" style="color:#4cc9f0;">Abrir/Cerrar una ficha</option>' +
          '<option value="Aviso de ausencia" style="color:#ecb939;">Aviso de ausencia</option>' +
          '<option value="Registro de récord" style="color:#f72585;">Registro de récord</option>' +
          '<option value="Otro" style="color:#b0b0b0;">Otro</option>' +
        '</select>' +
        '<button type="button" class="tram-remove" onclick="eliminarTipoTramite(this)" title="Eliminar este trámite">×</button>';
    contenedor.appendChild(fila);
}

// --- Eliminar una fila de tipo de trámite ---
function eliminarTipoTramite(boton) {
    var fila = boton.parentNode;
    fila.parentNode.removeChild(fila);
}

// --- Añadir una nueva fila de link + nombre ---
function agregarLinkTramite(boton) {
    var contenedor = document.getElementById("tram-links");
    var fila = document.createElement("div");
    fila.className = "tram-link-row";
    fila.innerHTML =
        '<input class="labelclas0 tram-link-url" name="tramlink[]" size="30" placeholder="https://..." required />' +
        '<input class="labelclas0 tram-link-nombre" name="tramnombreTema[]" size="30" placeholder="Nombre del tema" required />' +
        '<button type="button" class="tram-remove" onclick="eliminarLinkTramite(this)" title="Eliminar este link">×</button>';
    contenedor.appendChild(fila);
}

// --- Eliminar una fila de link ---
function eliminarLinkTramite(boton) {
    var fila = boton.parentNode;
    fila.parentNode.removeChild(fila);
}

function enviarTramite(form) {
    // --- Validación de campos obligatorios ---
    var nombre = (form.tramnombre.value || "").trim();

    if (!nombre) {
        alert("Por favor, introduce el nombre del personaje.");
        form.tramnombre.focus();
        return false;
    }

    // --- Recoger todos los tipos de trámite seleccionados ---
    var tipos = [];
    jQuery("#tram-tipos .tram-tipo-select").each(function () {
        var val = jQuery(this).val();
        if (val) tipos.push(val);
    });

    if (tipos.length === 0) {
        alert("Por favor, selecciona al menos un tipo de trámite.");
        return false;
    }

    // --- Recoger todas las filas de link + nombre ---
    var links = [];
    jQuery("#tram-links .tram-link-row").each(function () {
        var url     = jQuery(this).find(".tram-link-url").val().trim();
        var nomTema = jQuery(this).find(".tram-link-nombre").val().trim();
        if (url && nomTema) {
            links.push("[url=" + url + "]" + nomTema + "[/url]");
        }
    });

    if (links.length === 0) {
        alert("Por favor, introduce al menos un link del tema con su nombre.");
        return false;
    }

    // --- Función auxiliar: devuelve el bloque solo si hay valor ---
    function campo(etiqueta, valor) {
        valor = (valor || "").trim();
        return valor ? "[b]" + etiqueta + ":[/b] " + valor + "\n" : "";
    }

    // --- Comentario extra ---
    var comentario = (form.tramcomentario.value || "").trim();
    var bloqueComentario = comentario
        ? "[b]Comentario extra:[/b] " + comentario + "\n"
        : "";

    // --- Construir el mensaje ---
    var txt_message =
        campo("Nombre del personaje", nombre) +
        campo("Tipo de trámite", tipos.join(" | ")) +
        campo("Link del tema", links.join("\n")) +
        bloqueComentario;

    form.message.value = txt_message;

    // --- Copiar auth[] y tokens del formulario oculto ---
    jQuery("#hidden-tramites").find("input[name='auth[]']").each(function (index) {
        if (index == 0) auth3 = jQuery(this).attr("value");
        if (index == 1) auth4 = jQuery(this).attr("value");
    });
    jQuery("input#auth3").attr("value", auth3);
    jQuery("input#auth4").attr("value", auth4);
    jQuery("input#lt2").attr("value", jQuery("#hidden-tramites").find("input[name='lt']").attr('value'));
    jQuery("input#mt2").attr("value", jQuery("#hidden-tramites").find("input[name='t']").attr('value'));
}
