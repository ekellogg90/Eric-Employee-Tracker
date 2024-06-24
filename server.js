const input = require('./public/input');
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
        console.log(rows);
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
        console.log(rows);
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
        console.log(rows);
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
        console.log(response);
        pool.query(query, [response.deptName], (err, res) => {
            //console.log(res);
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
            message: 'Enter Department ID:', // TODO change this to just department later?
        },
    ])
    .then((response) => {
        let query = `
INSERT INTO roles (title, salary, department_id) 
VALUES ($1, $2, $3);`; // TODO figure out how to have them insert department name instead of ID?
        console.log(response);
        pool.query(query, [response.roleTitle, response.roleSalary, response.roleDepartment], (err, res) => {
            console.log(res);
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
            message: 'Enter Role ID:',  // TODO change this to role
        },
        {
            type: 'input',
            name: 'manager',
            message: 'Enter Manager ID:', // TODO change this to manager
        },
    ])
    .then((response) => {
        let query = `
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ($1, $2, $3, $4);`;
        console.log(response);
        pool.query(query, [response.firstName, response.lastName, response.empRole, response.manager], (err, res) => {
            console.log(res);
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
        let roles = [];
        res.rows.forEach((employee) => {employees.push(`${employee.first_name} ${employee.last_name}`);});
        console.log(employees);
        res.rows.forEach((roleName) => {roles.push(`${roleName.title}`);});
        console.log(roles);
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
                choices: roles,
            }
        ])
        .then((response) => {
            console.log(response);
            let updatedTitleId = '';
            let empId = '';
            res.rows.forEach((role) => {
                if (response.roleSelect == role.title) {
                    updatedTitleId = role.id;
                }
            });
            res.rows.forEach((employee) => {
                if (response.empSelect == `${employee.first_name} ${employee.last_name}`) {
                    empId = employee.id;
                }
            });
            let query = `
UPDATE employee 
SET (employee.role_id) = ($1) 
WHERE employee.id = ($2);`;
            pool.query(query, [updatedTitleId, empId]), (err, res) => {
                console.log(res);
                if (err) {
                    console.log(`error on employee update`, err.message);
                }
                userInput();
            }
        })
    })

};
