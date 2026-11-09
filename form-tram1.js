var auth3;
var auth4;

jQuery(function () {
    var id_tema_tramites = 15; // <-- CAMBIA esto por el ID del tema de trámites
    jQuery("#hidden-tramites").load("/post?t=" + id_tema_tramites + "&mode=reply form[action='/post']");
});

function enviarTramite(form) {
    // --- Validación de campos obligatorios ---
    var nombre    = (form.tramnombre.value || "").trim();
    var tipo      = (form.tramtipo.value || "").trim();
    var link      = (form.tramlink.value || "").trim();
    var nomTema   = (form.tramnombreTema.value || "").trim();

    if (!nombre) {
        alert("Por favor, introduce el nombre del personaje.");
        form.tramnombre.focus();
        return false;
    }
    if (!tipo) {
        alert("Por favor, selecciona un tipo de trámite.");
        form.tramtipo.focus();
        return false;
    }
    if (!link) {
        alert("Por favor, introduce el link del tema.");
        form.tramlink.focus();
        return false;
    }
    if (!nomTema) {
        alert("Por favor, introduce el nombre del tema.");
        form.tramnombreTema.focus();
        return false;
    }

    // --- Función auxiliar: devuelve el bloque solo si hay valor ---
    function campo(etiqueta, valor) {
        valor = (valor || "").trim();
        return valor ? "[b]" + etiqueta + ":[/b] " + valor + "\n" : "";
    }

    // --- Convierte una URL en [url=URL]Texto[/url] (solo si hay URL) ---
    function linkBBCode(url, texto) {
        url = (url || "").trim();
        return url ? "[url=" + url + "]" + texto + "[/url]" : "";
    }

    // --- Comentario extra ---
    var comentario = (form.tramcomentario.value || "").trim();
    var bloqueComentario = comentario
        ? "[b]Comentario extra:[/b] " + comentario + "\n"
        : "";

    // --- Construir el mensaje ---
    var txt_message =
        campo("Nombre del personaje", nombre) +
        campo("Tipo de trámite", tipo) +
        campo("Link del tema", linkBBCode(link, nomTema)) +
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
