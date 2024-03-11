fetch('/employee')
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
    .catch(error => console.error('Error encontrar empleados:', error));

document.getElementById('button_add').addEventListener('click', function () {
    $('#employeeModal').modal('show');
});

function saveEmployee() {
    const id = document.getElementById('id').value;
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const title = document.getElementById('title').value;
    const reports_to = document.getElementById('reports_to').value;
    const birth_date = document.getElementById('birth_date').value;
    const hire_date = document.getElementById('hire_date').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const country = document.getElementById('country').value;
    const postal_code = document.getElementById('postal_code').value;
    const phone = document.getElementById('phone').value;
    const fax = document.getElementById('fax').value;
    const email = document.getElementById('email').value;

    const data = {
        id,
        lastName,
        firstName,
        title,
        reports_to,
        birth_date,
        hire_date,
        address,
        city,
        state,
        country,
        postal_code,
        phone,
        fax,
        email
    };

    fetch('/employee', {
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
