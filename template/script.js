// Espera a que el contenido de la página esté completamente cargado antes de ejecutar
// el código.
document.addEventListener("DOMContentLoaded", () => {

    // Referencias a elementos del formulario y botones en el DOM.
    const form = document.getElementById("personaForm");  // Formulario para crear o actualizar una persona.
    //const updateBtn = document.getElementById("updateBtn"); // Botón para actualizar personas.
    const tableBody = document.querySelector("#personaTable tbody"); // Cuerpo de la tabla donde se muestran las personas.

    // Llama a la función para obtener y mostrar las personas cuando la página se carga.
    fetchPersonas();

    let isEditing = false; // Bandera que indica si el usuario está en modo edición.
    let actualCedula = null; // Almacena la cédula de la persona que se está editando.

    // Obtiene la lista de personas de la API.
    function fetchPersonas() {
        fetch("/api/obtener")
            .then((response) => response.json())
            .then((data) => renderPersonas(data.data)) // Llama a renderPersonas para mostrar los datos en la tabla.
            .catch((error) => console.error("Error fetching personas:", error)); // Muestra un error en la consola si falla la solicitud.
    }

    // Renderiza las personas en la tabla.
    function renderPersonas(personas) {
        tableBody.innerHTML = ""; // Limpia la tabla antes de agregar los datos.
        personas.forEach((persona) => {
            // Crea una fila para cada persona.
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${persona.cedula}</td>
            <td>${persona.nombre}</td>
            <td>${persona.celular}</td>
            <td>${persona.email}</td>
            <td>${persona.fecha}</td>
            <td class="actions">
                <button class="button-edt" onclick="editPersona('${persona.cedula}')">Editar</button>
                <button class="button-del" onclick="deletePersona('${persona.cedula}')">Eliminar</button>
            </td>`;
            tableBody.appendChild(row); // Agrega la fila a la tabla.
        });
    }

    // Maneja el evento de envío del formulario.
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado del formulario.

        // Obtiene los datos ingresados en el formulario.
        const cedula = form.cedula.value;
        const nombre = form.nombre.value;
        const celular = form.celular.value;
        const email = form.email.value;
        const fecha = form.fecha.value;


        const personaData = { cedula, nombre, celular, email, fecha }; // Datos de la persona en un objeto.

        if (isEditing) {
            // Si está en modo edición, actualiza la persona con la cédula actual.
            updatePersona(actualCedula, personaData);
        } else {
            // Si no está en modo edición, crea una nueva persona.
            createPersona(personaData);
        }

    });

    // Función para Agregar un nuvo registro a Persona.
    function createPersona(persona) {
        fetch("/api/guardar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(persona),
        })
            .then(fetchPersonas) // Refresca la lista de personas después de crear una nueva.
            .catch((error) => console.error("Error creating persona:", error));
    }

    // Función para editar una persona. Obtiene los datos de una persona usando 
    //su cédula y los muestra en el formulario.
    window.editPersona = (cedula) => {
        isEditing = true; // Cambia a modo edición.
        actualCedula = cedula; // Almacena la cédula de la persona que se está editando.

        // Solicita los datos de la persona usando la API.
        fetch(`/api/obtener/${cedula}`)
            .then(() => {
                const row = Array.from(document.querySelectorAll('#personaTable tbody tr'))
                    .find(tr => tr.cells[0].textContent === cedula);

                document.getElementById('cedula').value = row.cells[0].textContent;
                document.getElementById('nombre').value = row.cells[1].textContent;
                document.getElementById('celular').value = row.cells[2].textContent;
                document.getElementById('email').value = row.cells[3].textContent;
                document.getElementById('fecha').value = row.cells[4].textContent;

                actualCedula = cedula;  // Establece el cedula actual
                document.getElementById('submitBtn').style.display = 'inline';

            })
            .catch((error) => console.error("Error al obtener datos de la persona:", error))
    };

    // Función para actualizar una persona.
    function updatePersona(cedula, updatedData) {
        isEditing = false;
        fetch(`/api/actualizar/${cedula}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        })
            .then(() => {
                fetchFormularios(); // Refresca la lista de personas.
                resetForm(); // Resetea el formulario.
            })
            .catch((error) => console.error("Error updating persona:", error));
    }

    window.deletePersona = (cedula) => {
        fetch(`/api/eliminar/${cedula}`, { method: "DELETE" })
            .then(fetchPersonas)
            .catch((error) => console.error("Error Al borrar el registro", error));
    };

    function resetForm() {
        form.reset();
        isEditing = false;
        actualCedula = null;
    }

});