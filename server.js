const inquirer = require('inquirer');
const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
        user: "postgres",
        password: "password",
        host: "127.0.0.1",
        database: "employee_manager",
    },
    console.log("Connected to Employee_Manager DB")
);

pool.connect();
userInput();

function userInput() {
    const questions = [{
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: [
            'View All Departments', 
            'View All Roles', 
            'View All Employees', 
            'Add a Department', 
            'Add a Role', 
            'Add an Employee', 
            'Update an Employee Role'
        ],
    }];

inquirer.prompt(questions)
.then((data) => {
    switch (data.options) {
        case 'View All Departments':
            viewDepartments();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee Role':
            updateEmployeeRole();
            break;
    }
})
};

function viewDepartments() {
    let query = `
SELECT department.name AS "Department", department.id AS "Dept ID"
FROM department;`;
    pool.query(query, function (err, { rows }) {
        console.table(rows);
        if (err) {
            console.log('error', err.message);
        }
        userInput();
    });
};

function viewRoles() {
    let query = `
SELECT roles.id AS "role ID", roles.title, roles.salary, department.name AS "department"
FROM department
INNER JOIN roles on roles.department_id = department.id;`;
    pool.query(query, function (err, { rows }) {
        console.table(rows);
        if (err) { 
            console.log('error', err.message);
        }
        userInput();
    });
};

function viewEmployees() {
    let query = `
SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, employee.manager_id 
FROM department 
INNER JOIN roles ON roles.department_id = department.id 
INNER JOIN employee ON employee.role_id = roles.id;`
    pool.query(query, function (err, { rows }) {
        console.table(rows);
        if (err) {
            console.log('error', err.message);
        }
        userInput();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'Enter new Department name:',
        },
    ])
    .then((response) => {
        let query = `
INSERT INTO department (name) 
VALUES ($1);`;
        console.table(response);
        pool.query(query, [response.deptName], (err, res) => {
            if (err) {
                console.log('error on dept add', err.message);
            }
            userInput();
        });
    });
};

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter new Role:',
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter Salary:',
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'Enter Department ID:',
        },
    ])
    .then((response) => {
        let query = `
INSERT INTO roles (title, salary, department_id) 
VALUES ($1, $2, $3);`;
        console.table(response);
        pool.query(query, [response.roleTitle, response.roleSalary, response.roleDepartment], (err, res) => {
            if (err) {
                console.log('error on role add', err.message);
            }
            userInput();
        });
    });
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter First Name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter Last Name:',
        },
        {
            type: 'input',
            name: 'empRole',
            message: 'Enter Role ID:',
        },
        {
            type: 'input',
            name: 'manager',
            message: 'Enter Manager ID:',
        },
    ])
    .then((response) => {
        let query = `
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ($1, $2, $3, $4);`;
        console.table(response);
        pool.query(query, [response.firstName, response.lastName, response.empRole, response.manager], (err, res) => {
            if (err) {
                console.log(`error on employee add`, err.message);
            }
            userInput();
        });
    })
};

function updateEmployeeRole() {
    let empList = `
SELECT employee.id AS "Emp ID", employee.first_name, employee.last_name, roles.id AS "Role ID", roles.title 
FROM employee, roles, department 
WHERE department.id = roles.department_id AND roles.id = employee.role_id;`;
    pool.query(empList, (err, res) => {
        console.log(res.rows);
        if (err) {
            console.log(`error on update employee call`, err.message);
        }
        let employees = [];
        res.rows.forEach((employee) => {employees.push(`${employee.first_name} ${employee.last_name}`)});
        console.log(employees);

        let roleList = `SELECT roles.id, roles.title FROM roles`;
        pool.query(roleList, (err, res) => {
            console.log(res.rows);
            if (err) {
                console.log(`error`, err.message);
            }
            let rolesArr = [];
            res.rows.forEach((role) => {rolesArr.push(role.title);});

        inquirer.prompt([
            {
                type: 'list',
                name: 'empSelect',
                message: 'Choose employee to update:',
                choices: employees,
            },
            {
                type: 'list',
                name: 'roleSelect',
                message: 'Choose new Role:',
                choices: rolesArr,
            }
        ])
        .then((response) => {
            console.log(response);
            let updatedTitleId = '';
            let empId = '';
            res.rows.forEach((role) => {
                console.log(role.title);
                console.log(role.id);
                if (response.roleSelect === role.title) {
                    updatedTitleId = role.id;
                    console.log(updatedTitleId);
                }
            });
            res.rows.forEach((employee) => {
                if (response.empSelect == `${employee.first_name} ${employee.last_name}`) {
                    empId = employee.id;
                    console.log(empId);
                }
            });
            let query = `
UPDATE employee 
SET role_id = ($1) 
WHERE id = ($2);`;
            pool.query(query, [updatedTitleId, empId]), (err, res) => {
                console.log(res);
                if (err) {
                    console.log(`error on employee update`, err.message);
                }
                userInput();
            }
        })
    })
    })

};
