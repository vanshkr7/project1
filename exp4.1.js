const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let employees = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];
let nextId = 3;

function showMenu() {
  console.log('\n--- Employee Management System ---');
  console.log('1. List all employees');
  console.log('2. Add a new employee');
  console.log('3. Remove an employee');
  console.log('4. Exit');
  rl.question('Please choose an option: ', handleMenuChoice);
}

function handleMenuChoice(choice) {
  switch (choice.trim()) {
    case '1':
      listEmployees();
      break;
    case '2':
      addEmployee();
      break;
    case '3':
      removeEmployee();
      break;
    case '4':
      exitApp();
      break;
    default:
      console.log('Invalid choice. Please try again.');
      showMenu();
      break;
  }
}

function listEmployees() {
  console.log('\n--- Employee List ---');
  if (employees.length === 0) {
    console.log('No employees found.');
  } else {
    employees.forEach(emp => {
      console.log(`ID: ${emp.id}, Name: ${emp.name}`);
    });
  }
  showMenu();
}

function addEmployee() {
  rl.question('Enter the new employee\'s name: ', (name) => {
    const newEmployee = { id: nextId++, name: name };
    employees.push(newEmployee);
    console.log(`✅ Employee "${name}" added successfully!`);
    showMenu();
  });
}

function removeEmployee() {
  rl.question('Enter the ID of the employee to remove: ', (idStr) => {
    const id = parseInt(idStr, 10);
    const index = employees.findIndex(emp => emp.id === id);

    if (index !== -1) {
      const removedEmployee = employees.splice(index, 1);
      console.log(`🗑️ Employee "${removedEmployee[0].name}" (ID: ${id}) removed successfully.`);
    } else {
      console.log(`❌ Error: Employee with ID ${id} not found.`);
    }
    showMenu();
  });
}

function exitApp() {
  console.log('Goodbye! 👋');
  rl.close();
}

console.log('Welcome to the CLI Employee Management System!');
showMenu();
