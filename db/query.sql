-- -- View Employee Query
-- SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, employee.manager_id
-- FROM department
-- INNER JOIN roles ON roles.department_id = department.id
-- INNER JOIN employee ON employee.role_id = roles.id;


-- -- View Department Query
-- SELECT department.name AS "Department", department.id AS "Dept ID"
-- FROM department;


-- View Roles Query (Job Title, role ID, dept role belongs to, salary)
SELECT roles.id AS "role ID", roles.title, roles.salary, department.name AS "department"
FROM department
INNER JOIN roles on roles.department_id = department.id;
