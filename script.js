// it manages the task application such that they are maintained even after reloading the page
// adding, editing, deleting, undo and marking tasks

//runs js script only after html is fully loaded. 

document.addEventListener("DOMContentLoaded", function () {
    //retrieving and storing tasks from localstorage(array format)
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    //linking html elements
    const taskList = document.getElementById("taskList");//container for displaying tasks
    const addTaskBtn = document.getElementById("addTask");//"add task" button
    const taskName = document.getElementById("taskName");//input field for task name
    const taskDesc = document.getElementById("taskDesc");//input name for task description
    
    // Filter buttons
    const showAllBtn = document.getElementById("showAll");
    const showPendingBtn = document.getElementById("showPending");
    const showCompletedBtn = document.getElementById("showCompleted");
    
    //function to add a new task
    function addTask() {
        if (taskName.value.trim() === "") {
            alert("Task name cannot be empty!");// shows error if task name is empty
            return;
        }

        // creation of new task
        const newTask = {
            id: Date.now(), //generates a unique id using current timestamp- for all tasks to be unique
            name: taskName.value.trim(), //task name
            desc: taskDesc.value.trim(),// task description
            completed: false // initially, when the task is not completed
        };

        //add new task to initialised array
        tasks.push(newTask);
        //save updated task to localStorage
        saveTasks();
        //re-render task list to show updated tasks
        renderTasks();
        //clearing input fields after adding tasks
        taskName.value = "";
        taskDesc.value = "";
    }

    //function to display tasks- all, pending, done
    function renderTasks(filter = "all") {
        taskList.innerHTML = "";

        // Apply filters for all, done, or pending tasks
        let filteredTasks = tasks.filter(task => {
            if (filter === "all") return true;
            if (filter === "done") return task.completed;
            if (filter === "pending") return !task.completed;
            return false; // Just in case of unexpected issues
        });

        //apply filters of all, done, pending
        filteredTasks.forEach(task => {
                // new list item for each task
                const li = document.createElement("li");
                li.classList.add("task");// join class for the styling
                if (task.completed) li.classList.add("completed");// add class if completed

                // structure defination(name, description and action button
                
                li.innerHTML = `
                    <span>${task.name} - ${task.desc}</span>
                    <div>
                        <button class="toggleTask">${task.completed ? "↩" : "✔"}</button>
                        <button class="editTask">✏</button>
                        <button class="deleteTask">🗑</button>
                    </div>
                `;

                //appending new item to task list
                taskList.appendChild(li);

                //adding event listeners
                li.querySelector(".toggleTask").addEventListener("click", () => toggleTask(task.id));
                li.querySelector(".editTask").addEventListener("click", () => editTask(task.id));
                li.querySelector(".deleteTask").addEventListener("click", () => deleteTask(task.id));
            });
    }

    // function for making toggle button (done/undo)
    function toggleTask(id) {
        //find task status by id and change status
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        //save and implement changes
        saveTasks();
        renderTasks();
    }

    //function to edit tasks
    function editTask(id) {
        //drop box to update details
        tasks = tasks.map(task => {
            if (task.id === id) {
                const newName = prompt("Edit Task Name:", task.name) || task.name;
                const newDesc = prompt("Edit Task Description:", task.desc) || task.desc;
                return { ...task, name: newName, desc: newDesc };
            }
            return task;
        });
        // save and re-render
        saveTasks();
        renderTasks();
    }

    //function to delete task
    function deleteTask(id) {
        // matching the id and removing it from the array
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(); // save and render
        renderTasks();
    }

    //function to save tasks to localstorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    //event listners for task filtering
    showAllBtn.addEventListener("click", () => renderTasks("all"));
    showPendingBtn.addEventListener("click", () => renderTasks("pending"));
    showCompletedBtn.addEventListener("click", () => renderTasks("done"));

    // when add task button is clicked, the "add task" will be called
    addTaskBtn.addEventListener("click", addTask);

    //render tasks on reloading(loads saved tasks from localstorage)
    renderTasks();
});
