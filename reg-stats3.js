var auth5;
var auth6;

jQuery(function () {
    var id_tema_stats = 16; // <-- CAMBIA esto por el ID del tema de estadísticas
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

// --- Nombres automáticos para los links: Uno...Seis ---
function nombreLinkStats(index) {
    var nombres = ["Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis"];
    return nombres[index] || ("Link " + (index + 1));
}

// --- Reasignar títulos de razones y placeholders de links ---
function reasignarStats() {
    // Títulos de razones
    jQuery("#stats-razones .stats-razon-bloque").each(function (i) {
        jQuery(this).find(".stats-razon-titulo").text("Razón " + (i + 1));
    });

    // Placeholders de links dentro de cada razón
    jQuery("#stats-razones .stats-razon-bloque").each(function () {
        jQuery(this).find(".stats-link-row").each(function (j) {
            jQuery(this).find(".stats-link-url").attr("placeholder", "Link " + nombreLinkStats(j) + " (https://...)");
        });
    });

    // Ocultar botón + de razón si ya hay 3 bloques
    var totalRazones = jQuery("#stats-razones .stats-razon-bloque").length;
    if (totalRazones >= 3) {
        jQuery("#stats-razones .stats-razon-bloque .stats-razon-header .tram-add").hide();
    } else {
        jQuery("#stats-razones .stats-razon-bloque .stats-razon-header .tram-add").show();
    }

    // Ocultar botón + de links si ya hay 6 en ese bloque
    jQuery("#stats-razones .stats-razon-bloque").each(function () {
        var totalLinks = jQuery(this).find(".stats-link-row").length;
        if (totalLinks >= 6) {
            jQuery(this).find(".stats-links .tram-add").hide();
        } else {
            jQuery(this).find(".stats-links .tram-add").show();
        }
    });
}

// --- Añadir un bloque de razón nuevo ---
function agregarRazonStats(boton) {
    var contenedor = document.getElementById("stats-razones");
    if (jQuery("#stats-razones .stats-razon-bloque").length >= 3) return; // máximo 3 razones

    var bloque = document.createElement("div");
    bloque.className = "stats-razon-bloque";
    bloque.innerHTML =
        '<div class="stats-razon-header">' +
          '<span class="stats-razon-titulo">Razón</span>' +
          '<button type="button" class="tram-remove" onclick="eliminarRazonStats(this)" title="Eliminar esta razón">×</button>' +
        '</div>' +
        '<textarea class="labelclas0 stats-razon-texto" rows="2" cols="50" placeholder="Ej: +1 en magia por tres duelos ganados."></textarea>' +
        '<div class="stats-links">' +
          '<div class="stats-link-row">' +
            '<input class="labelclas0 stats-link-url" size="30" placeholder="https://..." />' +
            '<button type="button" class="tram-add" onclick="agregarLinkStats(this)" title="Añadir otro link (máx. 6)">+</button>' +
          '</div>' +
        '</div>';
    contenedor.appendChild(bloque);
    reasignarStats();
}

// --- Eliminar un bloque de razón ---
function eliminarRazonStats(boton) {
    var bloque = boton.closest(".stats-razon-bloque");
    bloque.parentNode.removeChild(bloque);
    reasignarStats();
}

// --- Añadir un link dentro de un bloque de razón ---
function agregarLinkStats(boton) {
    var bloque = boton.closest(".stats-razon-bloque");
    var contenedor = bloque.querySelector(".stats-links");
    if (contenedor.querySelectorAll(".stats-link-row").length >= 6) return; // máximo 6 links

    var fila = document.createElement("div");
    fila.className = "stats-link-row";
    fila.innerHTML =
        '<input class="labelclas0 stats-link-url" size="30" placeholder="https://..." />' +
        '<button type="button" class="tram-remove" onclick="eliminarLinkStats(this)" title="Eliminar este link">×</button>';
    contenedor.appendChild(fila);
    reasignarStats();
}

// --- Eliminar un link dentro de un bloque de razón ---
function eliminarLinkStats(boton) {
    var fila = boton.closest(".stats-link-row");
    fila.parentNode.removeChild(fila);
    reasignarStats();
}

function enviarStats(form) {
    // --- Validación de campos obligatorios ---
    var nombre = (form.statsnombre.value || "").trim();
    var tipo   = (form.statstipo.value || "").trim();

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

    // --- Recoger razones (cada bloque: texto + links) ---
    var razones = [];
    jQuery("#stats-razones .stats-razon-bloque").each(function () {
        var texto = jQuery(this).find(".stats-razon-texto").val().trim();
        if (!texto) return; // ignorar bloques vacíos

        var links = [];
        jQuery(this).find(".stats-link-row").each(function (j) {
            var url = jQuery(this).find(".stats-link-url").val().trim();
            if (url) {
                links.push("[url=" + url + "]" + nombreLinkStats(j) + "[/url]");
            }
        });

        var linea = texto;
        if (links.length > 0) {
            linea += " - " + links.join(", ");
        }
        razones.push(linea);
    });

    if (razones.length === 0) {
        alert("Por favor, escribe al menos una razón.");
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

    // --- Construir bloque de razones ---
    var bloqueRazones = "";
    razones.forEach(function (r, i) {
        bloqueRazones += "[b]Razón " + (i + 1) + ":[/b] " + r + "\n";
    });

    // --- Construir el bloque de estadísticas ---
    var bloqueStats =
        statLinea("Magia", form.statmagia.value, "nuevo_magia") +
        statLinea("Intelecto", form.statint.value, "nuevo_int") +
        statLinea("Físico", form.statfis.value, "nuevo_fis") +
        statLinea("Social", form.statsoc.value, "nuevo_soc");

    // --- Puntos de vida: etiqueta SIN negrita, valor en negrita, salto de línea previo ---
    var vida = (form.statvida.value || "").trim();
    var bloqueVida = vida ? "\nPuntos de vida: [b]" + vida + "[/b]\n" : "";

    // --- Construir el mensaje ---
    var txt_message =
        campo("Nombre del personaje", nombre) +
        campo("Tipo de trámite", tipo) +
        bloqueRazones +
        "\n[b]Estadísticas actualizadas:[/b]\n" +
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
