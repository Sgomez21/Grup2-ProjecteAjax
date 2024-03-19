fetch('/track')
    .then(response => response.json())
    .then(data => {
        const tablaTitulos = document.querySelector('#example1 thead');
        const titulos = Object.keys(data[0]);
        const row = document.createElement('tr');
        titulos.forEach(titulo => {
            const th = document.createElement('th');
            th.textContent = titulo.toUpperCase().replace('_', ' '); // Añadir el título como texto del th, y convertir el texto en mayúsculas
            row.appendChild(th);
        });
        tablaTitulos.appendChild(row);

        // Agregar las filas de datos
        const tablaCuerpo = document.querySelector('#example1 tbody');
        data.forEach(element => {
            const fila = document.createElement('tr');
            titulos.forEach(titulo => {
                const td = document.createElement('td');
                td.textContent = element[titulo];
                fila.appendChild(td);
            });

            // Añadir botones de editar y eliminar en la nueva columna
            const acciones = document.createElement('td');
// ------------------------------------------------------------Editar------------------------------------------------------------
            // Botón de editar
            const botonEditar = document.createElement('button');
            botonEditar.innerHTML = '<i class="fas fa-edit"></i>';
            botonEditar.addEventListener('click', function() {
                // Obtener los datos de la fila actual
                const data = Array.from(fila.children).map(td => td.textContent);

                // Llenar el modal de edición con los datos de la fila actual
                document.getElementById('edit_id').value = data[0];
                document.getElementById('edit_name').value = data[1]; 
                document.getElementById('edit_album').value = data[2]; 
                document.getElementById('edit_media').value = data[3]; 
                document.getElementById('edit_genre').value = data[4]; 
                document.getElementById('edit_composer').value = data[5]; 
                searchData(data[0]);
                document.getElementById('edit_unite_price').value = data[6]; 

                // Mostrar el modal de edición
                $('#editModal').modal('show');
            });
            acciones.appendChild(botonEditar);
// ------------------------------------------------------------Eliminar------------------------------------------------------------
            // Botón de eliminar
            const botonEliminar = document.createElement('button');
            botonEliminar.innerHTML = '<i class="fas fa-trash"></i>';
            botonEliminar.addEventListener('click', function() {
                // Obtener los datos de la fila actual
                const data = Array.from(fila.children).map(td => td.textContent);

                // Llenar el modal de edición con los datos de la fila actual
                document.getElementById('delete_id').value = data[0];
                document.getElementById('delete_name').value = data[1]; 
                document.getElementById('delete_album').value = data[2]; 
                document.getElementById('delete_media').value = data[3]; 
                document.getElementById('delete_genre').value = data[4]; 
                document.getElementById('delete_composer').value = data[5]; 
                searchDataForDelete(data[0]);
                document.getElementById('delete_unite_price').value = data[6]; 

                // Mostrar el modal de edición
                $('#deleteModal').modal('show');
            });
            acciones.appendChild(botonEliminar);

            fila.appendChild(acciones);
            tablaCuerpo.appendChild(fila);
        });
    })
    .catch(error => console.error('Error encontrar las bandas:', error));




fetch('/album')
    .then(response => response.json())
    .then(albumData => {
        const selectAlbum = document.getElementById('add_album');
        albumData.forEach(album => {
            const option = document.createElement('option');
            option.textContent = album.title;
            option.value = album.album_id;
            selectAlbum.appendChild(option);
        });
    })
    .catch(error => console.error('Error obteniendo datos de álbumes:', error));

fetch('/media_type')
    .then(response => response.json())
    .then(mediaData => {
        const selectmedia = document.getElementById('add_media');
        mediaData.forEach(media => {
            const option = document.createElement('option');
            option.textContent = media.name;
            option.value = media.media_type_id;
            selectmedia.appendChild(option);
        });
    })
    .catch(error => console.error('Error obteniendo datos de media:', error));

fetch('/genre')
    .then(response => response.json())
    .then(genreData => {
        const selectgenre = document.getElementById('add_genre');
        genreData.forEach(genre => {
            const option = document.createElement('option');
            option.textContent = genre.name;
            option.value = genre.genre_id;
            selectgenre.appendChild(option);
        });
    })
    .catch(error => console.error('Error obteniendo datos de genre:', error));

document.getElementById('button_add').addEventListener('click', function () {
    $('#trackModal').modal('show');
})

// ------------------------------------------------------------Añadir------------------------------------------------------------

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
                alert('The track has been added successfully');
            } else {
                console.error('Error:', data.error);
                alert("The track could not be added");
            }
        })
}
// ------------------------------------------------------------Datos Millisecons y Bytes------------------------------------------------------------

function searchData(trackId) {
    fetch(`/track/${trackId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                // Actualizar los valores en el modal con los datos del track
                document.getElementById('edit_milliseconds').value = data[0].milliseconds;
                document.getElementById('edit_byte').value = data[0].bytes;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error fetching data. Please try again.");
        });
}

function searchDataForDelete(trackId) {
    fetch(`/track/${trackId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                // Actualizar los valores en el modal de eliminación con los datos del track
                document.getElementById('delete_milliseconds').value = data[0].milliseconds;
                document.getElementById('delete_byte').value = data[0].bytes;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error fetching data. Please try again.");
        });
}

// ------------------------------------------------------------Editar------------------------------------------------------------

function EditTrack() {
    const id = document.getElementById('edit_id').value;
    const name = document.getElementById('edit_name').value;
    const album = document.getElementById('edit_album').value;
    const media = document.getElementById('edit_media').value;
    const genre = document.getElementById('edit_genre').value;
    const composer = document.getElementById('edit_composer').value;
    const milliseconds = document.getElementById('edit_milliseconds').value;
    const byte = document.getElementById('edit_byte').value;
    const unite_price = document.getElementById('edit_unite_price').value;

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

    fetch(`/track/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    .then(response => response.json())
        .then(data => {
            console.log('Track updated:', data);
            alert('Track updated successfully');
        })
        .catch(error => {
            console.error('Error updating track:', error);
            alert('Error updating track');
        });
    
}


// ------------------------------------------------------------Delete------------------------------------------------------------

function DeleteTrack() {
    const id = document.getElementById('delete_id').value;
    const name = document.getElementById('delete_name').value;
    const album = document.getElementById('delete_album').value;
    const media = document.getElementById('delete_media').value;
    const genre = document.getElementById('delete_genre').value;
    const composer = document.getElementById('delete_composer').value;
    const milliseconds = document.getElementById('delete_milliseconds').value;
    const byte = document.getElementById('delete_byte').value;
    const unite_price = document.getElementById('delete_unite_price').value;

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

    fetch(`/track/${id}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data),
    }) 

    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message != undefined) {
            console.log('Success:', data);
            alert('The track has been deleted successfully');
        } else {
            console.error('Error:', data.error);
            alert("The track could not be deleted");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error deleting track. Please try again.");
    });

}