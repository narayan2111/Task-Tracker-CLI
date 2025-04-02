const fs = require('fs');
const path = require('path');
const tasksFile = path.join(__dirname, 'tasks.json');

function loadTasks() {
    if (!fs.existsSync(tasksFile)) return [];
    return JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
}

function saveTasks(tasks) {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 4));
}

function addTask(description) {
    let tasks = loadTasks();
    let task = {
        id: tasks.length + 1,
        description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${task.id})`);
}

function updateTask(id, newDescription) {
    let tasks = loadTasks();
    let task = tasks.find(t => t.id == id);
    if (!task) return console.log("Task not found");
    task.description = newDescription;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log("Task updated successfully");
}

function deleteTask(id) {
    let tasks = loadTasks().filter(t => t.id != id);
    saveTasks(tasks);
    console.log("Task deleted successfully");
}

function markTask(id, status) {
    let tasks = loadTasks();
    let task = tasks.find(t => t.id == id);
    if (!task) return console.log("Task not found");
    task.status = status;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task marked as ${status}`);
}

function listTasks(filter = null) {
    let tasks = loadTasks();
    if (filter) tasks = tasks.filter(t => t.status === filter);
    tasks.forEach(t => console.log(`[${t.id}] ${t.description} - ${t.status} (Updated: ${t.updatedAt})`));
}

const [,, command, ...args] = process.argv;

switch (command) {
    case 'add':
        addTask(args.join(' '));
        break;
    case 'update':
        updateTask(args[0], args.slice(1).join(' '));
        break;
    case 'delete':
        deleteTask(args[0]);
        break;
    case 'mark-in-progress':
        markTask(args[0], 'in-progress');
        break;
    case 'mark-done':
        markTask(args[0], 'done');
        break;
    case 'list':
        listTasks(args[0]);
        break;
    default:
        console.log("Invalid command");
}
