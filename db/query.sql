SELECT employee.id, employee.first_name, employee.last_name, 
roles.title, department.name AS department, roles.salary, employee.manager_id
FROM department
INNER JOIN roles ON roles.department_id = department.id
INNER JOIN employee ON employee.role_id = roles.id
