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


    function openModal() {
        document.getElementById('button_edit').addEventListener('click', function() {
            $('#editModal').modal('show');
        })        
    }

    function searchData() {
        let track_id = document.getElementById('trackIdInput').value;

        if (track_id == " ") {
            alert('Please insert an id');
            return;
        }

        fetch(`/track/${track_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
          // Actualizar los valores en el modal con los datos del track
          document.getElementById('name').value = data[0].name;
          document.getElementById('album').value = data[0].album;
          document.getElementById('media').value = data[0].media;
          document.getElementById('genre').value = data[0].genre;
          document.getElementById('composer').value = data[0].composer;
          document.getElementById('milliseconds').value = data[0].milliseconds;
          document.getElementById('byte').value = data[0].bytes;
          document.getElementById('unite_price').value = data[0].unit_price;
        })
        .catch(error => {
          console.error('Error:', error);
          console.log("No ha funcionado")
        });
    }
