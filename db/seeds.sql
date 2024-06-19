INSERT INTO department (name) VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (department_id, title, salary) VALUES
(1, 'Sales Lead', 100000),
(1, 'Salesperson', 80000),
(2, 'Lead Engineer', 150000),
(2, 'Software Engineer', 120000),
(3, 'Account Manager', 160000),
(3, 'Accountant', 125000),
(4, 'Legal Team Lead', 250000),
(4, 'Lawyer', 190000);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Gary', 'Oak', 2, 1),
('Eric', 'Kellogg', 3, NULL),
('Chris', 'Bridges', 4, 3),
('Mike', 'Shinoda', 5, NULL),
('Auggie', 'Doggie', 6, 5),
('Bo', 'Pelini', 7, NULL),
('Ron', 'Swanson', 8, 7);
