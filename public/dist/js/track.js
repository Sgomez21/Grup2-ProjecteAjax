fetch('/track')
    .then(response => response.json())
    .then(data => {
        const tablaEmpleado = document.querySelector('#example1 thead');
        const titulos = Object.keys(data[0]); // Obtener los nombres de las propiedades del primer elemento del array

        const row = document.createElement('tr');
        titulos.forEach(titulo => {
            const th = document.createElement('th');
            th.textContent = titulo.toUpperCase().replace('_', ' '); // Añadir el título como texto del th, y convertir el texto en mayúsculas
            row.appendChild(th);
        });
        tablaEmpleado.appendChild(row);

        // Agregar las filas de datos
        const tablaCuerpo = document.querySelector('#example1 tbody');
        data.forEach(element => {
            const fila = document.createElement('tr');
            titulos.forEach(titulo => {
                const td = document.createElement('td');
                td.textContent = element[titulo];
                fila.appendChild(td);
            });
            tablaCuerpo.appendChild(fila);
        });

        document.getElementById('button_add').addEventListener('click', function() {
            $('#employeeModal').modal('show');
        });
    })
    .catch(error => console.error('Error encontrar las bandas:', error));
