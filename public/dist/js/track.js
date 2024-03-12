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
    })
    .catch(error => console.error('Error encontrar las bandas:', error));

document.getElementById('button_add').addEventListener('click', function () {
    $('#trackModal').modal('show');
})

function saveTrack() {
    const id = document.getElementById('add_id').value;
    const name = document.getElementById('add_name').value;
    const album = document.getElementById('add_album').value;
    const media = document.getElementById('add_media').value;
    const genre = document.getElementById('add_genre').value;
    const composer = document.getElementById('add_composer').value;
    const milliseconds = document.getElementById('add_milliseconds').value;
    const byte = document.getElementById('add_byte').value;
    const unite_price = document.getElementById('add_unite_price').value;

    const data = {
        id,
        name,
        album,
        media,
        genre,
        composer,
        milliseconds,
        byte,
        unite_price
    };

    fetch('/track', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message != undefined) {
                console.log('Success:', data);
                alert('The user has been added successfully');
            } else {
                console.error('Error:', data.error);
                alert("The user could not be added");
            }
        })
}
// ------------------------------------------------------------Editar------------------------------------------------------------

document.getElementById('button_edit').addEventListener('click', function() {
    $('#editModal').modal('show');
});

function searchData() {
    let track_id = document.getElementById('trackIdInput').value.trim();

    if (track_id === "") {
        alert('Please insert an ID');
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
            if (data.length > 0) {
                // Actualizar los valores en el modal con los datos del track
                document.getElementById('edit_name').value = data[0].name;
                document.getElementById('edit_album').value = data[0].album;
                document.getElementById('edit_media').value = data[0].media;
                document.getElementById('edit_genre').value = data[0].genre;
                document.getElementById('edit_composer').value = data[0].composer;
                document.getElementById('edit_milliseconds').value = data[0].milliseconds;
                document.getElementById('edit_byte').value = data[0].bytes;
                document.getElementById('edit_unite_price').value = data[0].unit_price;

                // Muestra el modal después de cargar los datos
                $('#editModal').modal('show');
            } else {
                alert('No data found for the provided ID.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error fetching data. Please try again.");
        });
}
