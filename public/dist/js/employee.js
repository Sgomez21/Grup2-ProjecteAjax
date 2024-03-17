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
        /*EDITAR*/
        const rowEDIT = document.createElement('th');
        rowEDIT.classList.add('edit_p');
        rowEDIT.textContent = "EDIT";
        row.appendChild(rowEDIT);

        /*Borrar*/
        const rowIcon = document.createElement('th');
        rowIcon.classList.add('delete_p');
        rowIcon.textContent = "DELETE";
        row.appendChild(rowIcon);

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
            /*edit*/
            const editfila = document.createElement('td');
            const editboton = document.createElement('button');
            const editicono = document.createElement('i');
            editboton.classList.add('edit_button');
            editicono.classList.add('fas', 'fa-edit', 'iconoEdit');
            editboton.addEventListener('click', function (event) {
                const editrow = event.target.closest('tr');
                const editid = editrow.cells[0].textContent;
                $('#employeeModalEdit').modal('show');
                SeeditEmployee(editid);
            })
            editfila.appendChild(editboton);
            editboton.appendChild(editicono);
            fila.appendChild(editfila);
            /*Borrar*/
            const borrarfila = document.createElement('td');
            const borrarboton = document.createElement('button');
            const borraricono = document.createElement('i');
            borrarboton.classList.add('delete_button');
            borraricono.classList.add('fas', 'fa-trash', 'iconopapelera');
            borrarboton.addEventListener('click', function (event) {
                const row = event.target.closest('tr');
                const id = row.cells[0].textContent;
                if (confirm('¿Estás seguro de que quieres eliminar estos datos?')) {
                    fetch(`/employee/${id}`, {
                        method: 'DELETE',
                    })
                        .then(response => {
                            if (response.ok) {
                                alert('Los datos han sido eliminados exitosamente.');
                                row.remove();
                            } else {
                                alert('Hubo un problema al intentar eliminar los datos.');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Hubo un problema al intentar eliminar los datos.');
                        });
                }
            });
            borrarfila.appendChild(borrarboton);
            borrarboton.appendChild(borraricono);
            fila.appendChild(borrarfila);

            tablaCuerpo.appendChild(fila);
        });
        const selectReportsTo = document.getElementById('reports_to');
        const jefes = data.filter(employee => employee.title !== 'Sales Rep');
        jefes.forEach(jefe => {
            const option = document.createElement('option');
            option.textContent = `${jefe.first_name} ${jefe.last_name}`;
            option.value = jefe.employee_id;
            selectReportsTo.appendChild(option);
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
    let hire_date = document.getElementById('hire_date').value;
    hire_date = hire_date == '' ? null : hire_date;
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


function SeeditEmployee(id) {
    fetch(`/employee/${id}`)
        .then(response => response.json())
        .then(data => {
            const employeeData = data[0];
            document.getElementById('edit_employeeIdInput').value = employeeData.employee_id;
            document.getElementById('edit_lastName').value = employeeData.last_name;
            document.getElementById('edit_firstName').value = employeeData.first_name;
            document.getElementById('edit_title').value = employeeData.title;
            document.getElementById('edit_reports_to').value = employeeData.reports_to;
            document.getElementById('edit_birth_date').value = employeeData.birth_date;
            document.getElementById('edit_hire_date').value = employeeData.hire_date;
            document.getElementById('edit_address').value = employeeData.address;
            document.getElementById('edit_city').value = employeeData.city;
            document.getElementById('edit_state').value = employeeData.state;
            document.getElementById('edit_country').value = employeeData.country;
            document.getElementById('edit_postal_code').value = employeeData.postal_code;
            document.getElementById('edit_phone').value = employeeData.phone;
            document.getElementById('edit_fax').value = employeeData.fax;
            document.getElementById('edit_email').value = employeeData.email;
            $('#employeeModalEdit').modal('show');
        })
        .catch(error => console.error('Error al obtener datos del empleado:', error));
}

function editEmployee() {
    const id = document.getElementById('edit_employeeIdInput').value;
    const lastName = document.getElementById('edit_lastName').value;
    const firstName = document.getElementById('edit_firstName').value;
    const title = document.getElementById('edit_title').value;
    const reports_to = document.getElementById('edit_reports_to').value;
    const birth_date = document.getElementById('edit_birth_date').value;
    const hire_date = document.getElementById('edit_hire_date').value;
    const address = document.getElementById('edit_address').value;
    const city = document.getElementById('edit_city').value;
    const state = document.getElementById('edit_state').value;
    const country = document.getElementById('edit_country').value;
    const postal_code = document.getElementById('edit_postal_code').value;
    const phone = document.getElementById('edit_phone').value;
    const fax = document.getElementById('edit_fax').value;
    const email = document.getElementById('edit_email').value;

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

    fetch(`/employee/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Employee updated:', data);
            // Puedes agregar aquí la lógica para cerrar el modal si lo deseas
            // $('#employeeModalEdit').modal('hide');
            alert('Employee updated successfully');
        })
        .catch(error => {
            console.error('Error updating employee:', error);
            alert('Error updating employee');
        });
}



