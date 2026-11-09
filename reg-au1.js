var auth1;
var auth2;

jQuery(function () {
    var id_tema = 13; // <-- CAMBIA esto por el ID del tema donde se postea el registro
    jQuery("#hidden").load("/post?t=" + id_tema + "&mode=reply form[action='/post']");
});

function enviarMensaje(form) {
    // Construir el enlace al perfil a partir del número de usuario
    var numUser = (form.usernum.value || "").trim().replace(/[^0-9]/g, "");
    var prolink = numUser ? "/u" + numUser : "";

    // Nombre con enlace (si hay número de usuario) o solo texto
    var nombreConLink = prolink
        ? '<a href="' + prolink + '">' + form.charname.value + '</a>'
        : form.charname.value;

    // Función auxiliar: devuelve el bloque "[b]Etiqueta:[/b] valor" solo si hay valor
    function campo(etiqueta, valor) {
        valor = (valor || "").trim();
        return valor ? "[b]" + etiqueta + ":[/b] " + valor + "<br>" : "";
    }

    // Construir el mensaje (nota: el foro usa [code] solo para el enlace del personaje)
    var txt_message =
        "[code] " + nombreConLink + "[/code]<br>" +
        campo("Enlace a la ficha del personaje", form.ficha.value) +
        campo("Enlace a la solicitud de estadísticas", form.stats.value) +
        campo("Grupo", form.chargrup.value) +
        campo("Curso", form.charcurso.value) +
        campo("Empleo", form.charempleo.value) +
        campo("Apellido", form.charapel.value) +
        campo("Habilidad innata", form.charhab.value) +
        campo("Patronus", form.charpat.value) +
        campo("Nombre y apellido del avatar", form.charavatar.value);

    form.message.value = txt_message;

    // Copiar auth[] y tokens del formulario oculto
    jQuery("#hidden").find("input[name='auth[]']").each(function (index) {
        if (index == 0) auth1 = jQuery(this).attr("value");
        if (index == 1) auth2 = jQuery(this).attr("value");
    });
    jQuery("input#auth1").attr("value", auth1);
    jQuery("input#auth2").attr("value", auth2);
    jQuery("input#lt1").attr("value", jQuery("#hidden").find("input[name='lt']").attr('value'));
    jQuery("input#mt").attr("value", jQuery("#hidden").find("input[name='t']").attr('value'));
}
