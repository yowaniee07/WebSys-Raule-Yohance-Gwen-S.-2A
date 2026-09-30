function updateTitle() {
    let now = new Date();
    let timeString = now.toLocaleTimeString();
    document.getElementById("heading").innerText =
        `Current Time: ${timeString}`;
}
updateTitle();

setInterval(updateTitle, 1000);

let themeButton = document.getElementById("themeToggle");

themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});


if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

document.getElementById("addTask").addEventListener("click", function() {

    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    let newTask = document.createElement("li");

    newTask.innerText = taskText;


    let removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.classList.add("removeTask");

    newTask.appendChild(removeButton);

    document.getElementById("taskList").appendChild(newTask);

    taskInput.value = "";
});

document.getElementById("taskList").addEventListener("click", function(event) {

    if (event.target.classList.contains("removeTask")) {
        event.target.parentElement.remove();
    }

});

document.addEventListener("keydown", function(event) {

    if (event.key.toLowerCase() === "b") {
        document.body.style.backgroundColor = "blue";
    }

});

document.getElementById("contactForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let email = document.getElementById("email").value;
    let modal = document.getElementById("modal");
    let modalMessage = document.getElementById("modalMessage");


    if (!email.includes("@")) {

        modalMessage.innerText =
            "Invalid email format! Please enter an email containing @.";

    } else {

        modalMessage.innerText =
            "Form Submitted Successfully!";

    }

    modal.style.display = "block";

});

document.getElementById("closeModal").addEventListener("click", function() {

    document.getElementById("modal").style.display = "none";

});


