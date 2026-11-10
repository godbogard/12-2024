var auth5;
var auth6;

jQuery(function () {
    var id_tema_stats = 15; // <-- CAMBIA esto por el ID del tema de estadísticas
    jQuery("#hidden-stats").load("/post?t=" + id_tema_stats + "&mode=reply form[action='/post']");

    // --- Cálculo automático de puntos de vida ---
    jQuery("#form-stats input[type='number']").on("input", function () {
        var m = parseInt(jQuery("#statmagia").val(), 10) || 0;
        var i = parseInt(jQuery("#statint").val(), 10) || 0;
        var f = parseInt(jQuery("#statfis").val(), 10) || 0;
        var s = parseInt(jQuery("#statsoc").val(), 10) || 0;
        var total = m + i + f + s;
        jQuery("#statvida").val(total > 0 ? (total * 2) : "");
    });
});

// --- Nombres automáticos para los links: Uno, Dos, Tres... ---
function nombreLinkStats(index) {
    var nombres = ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis"];
    return nombres[index] || ("Link " + (index + 1));
}

// --- Reasignar nombres de los links tras añadir/eliminar ---
function reasignarNombresLinksStats() {
    jQuery("#stats-links .stats-link-row").each(function (i) {
        jQuery(this).find(".stats-link-url").attr("placeholder", "Link " + nombreLinkStats(i) + " (https://...)");
    });
    // Ocultar el botón + si ya hay 6 filas
    var total = jQuery("#stats-links .stats-link-row").length;
    if (total >= 6) {
        jQuery("#stats-links .tram-add").hide();
    } else {
        jQuery("#stats-links .tram-add").show();
    }
}

// --- Añadir una nueva fila de link ---
function agregarLinkStats(boton) {
    var contenedor = document.getElementById("stats-links");
    if (jQuery("#stats-links .stats-link-row").length >= 6) return; // máximo 6

    var fila = document.createElement("div");
    fila.className = "stats-link-row";
    fila.innerHTML =
        '<input class="labelclas0 stats-link-url" name="statslink[]" size="30" placeholder="https://..." />' +
        '<button type="button" class="tram-remove" onclick="eliminarLinkStats(this)" title="Eliminar este link">×</button>';
    contenedor.appendChild(fila);
    reasignarNombresLinksStats();
}

// --- Eliminar una fila de link ---
function eliminarLinkStats(boton) {
    var fila = boton.parentNode;
    fila.parentNode.removeChild(fila);
    reasignarNombresLinksStats();
}

function enviarStats(form) {
    // --- Validación de campos obligatorios ---
    var nombre = (form.statsnombre.value || "").trim();
    var tipo   = (form.statstipo.value || "").trim();
    var razon  = (form.statsrazon.value || "").trim();

    if (!nombre) {
        alert("Por favor, introduce el nombre del personaje.");
        form.statsnombre.focus();
        return false;
    }
    if (!tipo) {
        alert("Por favor, selecciona un tipo de trámite.");
        form.statstipo.focus();
        return false;
    }
    if (!razon) {
        alert("Por favor, escribe la razón de la actualización.");
        form.statsrazon.focus();
        return false;
    }

    // --- Función auxiliar: devuelve el bloque solo si hay valor ---
    function campo(etiqueta, valor) {
        valor = (valor || "").trim();
        return valor ? "[b]" + etiqueta + ":[/b] " + valor + "\n" : "";
    }

    // --- Función auxiliar: stat con negrita si el checkbox está marcado ---
    function statLinea(etiqueta, valor, checkboxId) {
        valor = (valor || "").trim();
        if (!valor) return "";
        var esNuevo = jQuery("#" + checkboxId).is(":checked");
        var valorFinal = esNuevo ? "[b]" + valor + "[/b]" : valor;
        return etiqueta + ": " + valorFinal + "\n";
    }

    // --- Recoger links de la razón (Uno, Dos, Tres...) ---
    var linksRazon = [];
    jQuery("#stats-links .stats-link-row").each(function (i) {
        var url = jQuery(this).find(".stats-link-url").val().trim();
        if (url) {
            var nombreLink = nombreLinkStats(i);
            linksRazon.push("[url=" + url + "]" + nombreLink + "[/url]");
        }
    });

    // Razón final: texto libre + links (si hay)
    var razonFinal = razon;
    if (linksRazon.length > 0) {
        razonFinal += " - " + linksRazon.join(", ");
    }

    // --- Construir el bloque de estadísticas ---
    var bloqueStats =
        statLinea("Magia", form.statmagia.value, "nuevo_magia") +
        statLinea("Intelecto", form.statint.value, "nuevo_int") +
        statLinea("Físico", form.statfis.value, "nuevo_fis") +
        statLinea("Social", form.statsoc.value, "nuevo_soc");

    // --- Puntos de vida con [b] y salto de línea previo ---
    var vida = (form.statvida.value || "").trim();
    var bloqueVida = vida ? "\n[b]Puntos de vida:[/b] [b]" + vida + "[/b]\n" : "";

    // --- Construir el mensaje ---
    var txt_message =
        campo("Nombre del personaje", nombre) +
        campo("Tipo de trámite", tipo) +
        campo("Razón", razonFinal) +
        "[b]Estadísticas actualizadas:[/b]\n" +
        bloqueStats +
        bloqueVida;

    form.message.value = txt_message;

    // --- Copiar auth[] y tokens del formulario oculto ---
    jQuery("#hidden-stats").find("input[name='auth[]']").each(function (index) {
        if (index == 0) auth5 = jQuery(this).attr("value");
        if (index == 1) auth6 = jQuery(this).attr("value");
    });
    jQuery("input#auth5").attr("value", auth5);
    jQuery("input#auth6").attr("value", auth6);
    jQuery("input#lt3").attr("value", jQuery("#hidden-stats").find("input[name='lt']").attr('value'));
    jQuery("input#mt3").attr("value", jQuery("#hidden-stats").find("input[name='t']").attr('value'));
}
