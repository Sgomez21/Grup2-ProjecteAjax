fetch('/employee')
    .then(respone => response.json())
    .then(data => {
        const tablaempleado = document.querySelector('#employee tbody');
        tablaempleado.innerHTML = '';

        data.array.forEach(element => {
            const row = document.createElement('tr');
            row.innerHTML=`
            <td>${employee.employee_id}</td>
            <td>${employee.last_name}</td>
            <td>${employee.first_name}</td>
            <td>${employee.title}</td>
            <td>${employee.reports_to}</td>
            <td>${employee.birth_date}</td>
            <td>${employee.hire_date}</td>
            <td>${employee.address}</td>
            <td>${employee.city}</td>
            <td>${employee.state}</td>
            <td>${employee.country}</td>
            <td>${employee.postal_code}</td>
            <td>${employee.phone}</td>
            <td>${employee.fax}</td>
            <td>${employee.email}</td>
            `;
            tablaempleado.appendChild(row);
        });
    })
    .catch(error => console.error('Error encontrar empleados'))