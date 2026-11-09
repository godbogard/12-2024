 var auth1;
        var auth2;
        jQuery(function () {
            var id_tema = 13;
            jQuery("#hidden").load("/post?t=" + id_tema + "&mode=reply form[action='/post']");
        });
        function enviarMensaje(form) {
            // Crear mensaje a partir de los datos suministrados
            var txt_message ="[code]<a href='/u"+ form.numusr.value +"'>"+ form.namlast.value +"</a>[/code]" <br><strong>Grupo: <span>"+ form.chargrup.value +"</span></strong><br>[code][url="+ form.prolink.value +"]"+ form.charname.value +"[/url][/code]<br><strong>Rango: <span>"+ form.charrank.value +"</span></strong><br>[code][url="+ form.prolink.value +"]"+ form.charname.value +"[/url][/code]<br><strong>Clase Social: <span>"+ form.charsoc.value +"</span></strong><br>[code][url="+ form.prolink.value +"]"+ form.charname.value +"[/url][/code]<br><strong>Apellido:</strong><br>[code]"+ form.charapel.value +"[/code]<br><strong>Familia "+ form.charapel.value +":</strong><br>[code]"+ form.charfam.value +"[/code]";
            // Ahora se insertará todo lo que hayamos metido en el formulario
            form.message.value = txt_message;
            jQuery("#hidden").find("input[name='auth[]']").each(function (index) {
                if (index == 0) auth1 = jQuery(this).attr("value");
                if (index == 1) auth2 = jQuery(this).attr("value");
            });
            jQuery("input#auth1").attr("value", auth1);
            jQuery("input#auth2").attr("value", auth2);            
            jQuery("input#lt1").attr("value", jQuery("#hidden").find("input[name='lt']").attr('value'));
            jQuery("input#mt").attr("value", jQuery("#hidden").find("input[name='t']").attr('value'));
        }
