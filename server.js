const input = require('./public/input');
const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
        user: "postgres",
        host: "127.0.0.1",
        database: "employee_manager",
    },
    console.log("Connected to Employee_Manager DB")
);
pool.connect();

app.get(`/api/view-departments`, ({ body }, res) => {
    pool.query(`
SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, employee.manager_id 
FROM department 
INNER JOIN roles ON roles.department_id = department.id 
INNER JOIN employee ON employee.role_id = roles.id`, 
function (err, { rows }) {
    console.log(rows);
    if (err) res.status(500).json({ error: err.message });

    res.json({
        message: "success",
        data: rows,
    });
});
});

app.get(`/api/view-roles`)
app.get(`/api/view-employees`)

app.post(`/api/add-department`)
app.post(`/api/add-role`)
app.post(`/api/add-employee`)

app.put(`/api/update-employee/:id`)


// Kicks off Inquirer from input.js
input.userInput();