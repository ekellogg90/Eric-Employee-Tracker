// const inquirer = require('inquirer');
// const express = require('express');
// const { Pool } = require('pg');
// const PORT = process.env.PORT || 3001;
// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// const pool = new Pool(
//     {
//         user: "postgres",
//         password: "password",
//         host: "127.0.0.1",
//         database: "employee_manager",
//     },
//     console.log("Connected to Employee_Manager DB")
// );

// function userInput() {
//     const questions = [{
//         type: 'list',
//         name: 'options',
//         message: 'What would you like to do?',
//         choices: [
//             'View All Departments', 
//             'View All Roles', 
//             'View All Employees', 
//             'Add a Department', 
//             'Add a Role', 
//             'Add an Employee', 
//             'Update an Employee Role'
//         ],
//     }];

// inquirer.prompt(questions)
// .then((data) => {
//     let selection = '';
//     switch (data.options) {
//         case 'View All Departments':
//             //selection = 'TODO show formatted table of dept names and ids';
//             pool.connect();
//             app.get(`/api/view-roles`, ({ body }, res) => {
//                 pool.query(`
//             SELECT roles.id AS "role ID", roles.title, roles.salary, department.name AS "department"
//             FROM department
//             INNER JOIN roles on roles.department_id = department.id;`, 
//             function (err, { rows }) {
//                     console.log(rows);
//                     if (err) res.status(500).json({ error: err.message });
            
//                     res.json({
//                         message: "success",
//                         data: rows,
//                     });
//                 });
//             });
//             //console.log(selection);
//             break;
//         case 'View All Roles':
//             selection = 'TODO show job title, role id, dept role belongs to, and salary';
//             break;
//         case 'View All Employees':
//             selection = 'TODO formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to';
//             break;
//         case 'Add a Department':
//             selection = 'prompted to enter the name of the department and that department is added to the database';
//             break;
//         case 'Add a Role':
//             selection = 'prompted to enter the name, salary, and department for the role and that role is added to the database';
//             break;
//         case 'Add an Employee':
//             selection = 'prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database';
//             break;
//         case 'Update an Employee Role':
//             selection = 'prompted to select an employee to update and their new role and this information is updated in the database';
//             break;
//     }
// })
// };

// // app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// // })

// module.exports = userInput;