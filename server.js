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

};

function addRole() {

};

function addEmployee() {

};

function updateEmployeeRole() {

};

// app.post(`/api/add-department`)
// app.post(`/api/add-role`)
// app.post(`/api/add-employee`)

// app.put(`/api/update-employee/:id`)
