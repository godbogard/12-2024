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

    // --- Construir el bloque de estadísticas ---
    var bloqueStats =
        "Magia: " + (jQuery("#nuevo_magia").is(":checked") && form.statmagia.value.trim() ? "[b]" + form.statmagia.value.trim() + "[/b]" : form.statmagia.value.trim()) + "\n" +
        "Intelecto: " + (jQuery("#nuevo_int").is(":checked") && form.statint.value.trim() ? "[b]" + form.statint.value.trim() + "[/b]" : form.statint.value.trim()) + "\n" +
        "Físico: " + (jQuery("#nuevo_fis").is(":checked") && form.statfis.value.trim() ? "[b]" + form.statfis.value.trim() + "[/b]" : form.statfis.value.trim()) + "\n" +
        "Social: " + (jQuery("#nuevo_soc").is(":checked") && form.statsoc.value.trim() ? "[b]" + form.statsoc.value.trim() + "[/b]" : form.statsoc.value.trim()) + "\n";

    // Limpiar líneas vacías (si algún stat está vacío)
    bloqueStats = bloqueStats
        .split("\n")
        .filter(function (linea) { return linea.trim() !== ""; })
        .join("\n");

    // --- Puntos de vida ---
    var vida = (form.statvida.value || "").trim();
    var bloqueVida = vida ? "Puntos de vida: " + vida + "\n" : "";

    // --- Construir el mensaje ---
    var txt_message =
        campo("Nombre del personaje", nombre) +
        campo("Tipo de trámite", tipo) +
        campo("Razón", razon) +
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
