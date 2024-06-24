-- -- View Employee Query
-- SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, employee.manager_id
-- FROM department
-- INNER JOIN roles ON roles.department_id = department.id
-- INNER JOIN employee ON employee.role_id = roles.id;


-- -- View Department Query
-- SELECT department.name AS "Department", department.id AS "Dept ID"
-- FROM department;


-- -- View Roles Query (Job Title, role ID, dept role belongs to, salary)
-- SELECT roles.id AS "role ID", roles.title, roles.salary, department.name AS "department"
-- FROM department
-- INNER JOIN roles on roles.department_id = department.id;


-- -- Add Department Query
-- INSERT INTO department (name) VALUES ($1);


-- -- Add Role Query
-- INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3);


-- -- Add Emp Query
-- INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);

SELECT employee.id AS "Emp ID", employee.first_name, employee.last_name, roles.id AS "Role ID", roles.title 
FROM employee, roles, department 
WHERE department.id = roles.department_id AND roles.id = employee.role_id;
