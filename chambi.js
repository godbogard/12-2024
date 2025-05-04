document.addEventListener("DOMContentLoaded", function () {
      const items = document.querySelectorAll(".chamb-inv2");
      const fixedDescription = document.getElementById("chamb-inv5");

      items.forEach((item) => {
        const tooltipContent = item.querySelector(".chamb-inv3");

        item.addEventListener("mouseenter", function () {
          // Ocultar el texto actual con una transición
          fixedDescription.classList.add("hidden");

          // Esperar a que termine la transición antes de cambiar el contenido
          setTimeout(() => {
            fixedDescription.innerHTML = tooltipContent.innerHTML;
            fixedDescription.classList.remove("hidden"); // Mostrar el nuevo contenido
          }, 300); // Duración de la transición (debe coincidir con CSS)
        });

        item.addEventListener("mouseleave", function () {
          // Ocultar el texto actual con una transición
          fixedDescription.classList.add("hidden");

          // Esperar a que termine la transición antes de restaurar el mensaje predeterminado
          setTimeout(() => {
            fixedDescription.innerHTML = "Pasa el mouse sobre un ítem para ver su descripción.";
            fixedDescription.classList.remove("hidden"); // Mostrar el mensaje predeterminado
          }, 300); // Duración de la transición (debe coincidir con CSS)
        });
      });
    });
