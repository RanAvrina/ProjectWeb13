document.addEventListener("DOMContentLoaded", function () {

    // ===========================
    // 1. Login check
    // ===========================
    const loggedUser = localStorage.getItem("loggedUser");
    if (!loggedUser) {
        window.location.href = "login.html";
        return;
    }

    const teacherNameSpan = document.getElementById("teacher-name");
    const teacherSubjectSpan = document.getElementById("teacher-subject");

    teacherNameSpan.textContent = " " + loggedUser;
    teacherSubjectSpan.textContent = "Mathematics"; // change if needed

    // ===========================
    // 2. Students + search + dropdown
    // ===========================
    const students = [
        "Adam Cohen",
        "Noa Levi",
        "Daniel Levi",
        "Maya Levi",
        "Omer Ben David"
    ];

    const studentsListEl = document.getElementById("students-list");
    const studentSearchInput = document.getElementById("student-search");
    const selectedStudentSpan = document.getElementById("selected-student");

    function renderStudents(filterText = "") {
        studentsListEl.innerHTML = "";
        const search = filterText.toLowerCase();

        students
            .filter(name => name.toLowerCase().includes(search))
            .forEach(name => {
                const li = document.createElement("li");
                li.textContent = name;

                li.addEventListener("click", () => {
                    selectedStudentSpan.textContent = name;
                });

                studentsListEl.appendChild(li);
            });
    }

    renderStudents();

    studentSearchInput.addEventListener("input", function () {
        renderStudents(studentSearchInput.value);
    });

    // ===========================
    // 3. Upcoming Classes – cards
    // ===========================
    const lessons = [
        { date: "2025-12-09", time: "18:30", name: "Noa Perez",   subject: "Science" },
        { date: "2025-12-10", time: "19:00", name: "Dana Levy",   subject: "English" },
        { date: "2025-12-12", time: "17:00", name: "Yossi Cohen", subject: "Math" },
        { date: "2025-12-14", time: "16:00", name: "Ori Mizrahi", subject: "History" },
        { date: "2025-12-15", time: "18:00", name: "Roni Kedem",  subject: "Language" }
    ];

    lessons.sort((a, b) => new Date(a.date) - new Date(b.date));

    const stack = document.getElementById("stack");

    lessons.forEach((lesson) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-header">
                <div class="title">${lesson.subject} — ${lesson.name}</div>
                <div class="arrow">⬇️</div>
            </div>

            <div class="card-body">
                <div class="row"><span>Date:</span> ${lesson.date}</div>
                <div class="row"><span>Time:</span> ${lesson.time}</div>
                <div class="row"><span>Student:</span> ${lesson.name}</div>
                <div class="row"><span>Subject:</span> ${lesson.subject}</div>
            </div>
        `;

        card.addEventListener("click", () => {
            const isOpen = card.classList.contains("open");

            document.querySelectorAll(".card").forEach(c => c.classList.remove("open"));

            if (!isOpen) card.classList.add("open");
        });

        stack.appendChild(card);
    });

    // ===========================
    // 4. General Notes – Sticky Notes
    // ===========================
    const notesList = document.getElementById("notes-list");
    const noteInput = document.getElementById("new-note-input");
    const addNoteBtn = document.getElementById("add-note-btn");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function renderNotes() {
        notesList.innerHTML = "";

        notes.forEach((note, index) => {
            const li = document.createElement("li");
            li.classList.add("note-item");

            li.innerHTML = `
                <button class="delete-btn" data-index="${index}">✖</button>
                <button class="edit-btn" data-index="${index}">✎</button>
                <div>${note}</div>
            `;

            notesList.appendChild(li);
        });
    }

    renderNotes();

    addNoteBtn.addEventListener("click", function () {
        const text = noteInput.value.trim();
        if (text === "") return;

        notes.push(text);
        localStorage.setItem("notes", JSON.stringify(notes));
        noteInput.value = "";
        renderNotes();
    });

    noteInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            addNoteBtn.click();
        }
    });

    notesList.addEventListener("click", function (e) {
        // Delete
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.getAttribute("data-index");
            notes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            renderNotes();
        }

        // Edit
        if (e.target.classList.contains("edit-btn")) {
            const index = e.target.getAttribute("data-index");
            const currentText = notes[index];

            const newText = prompt("Edit note:", currentText);
            if (newText === null) return;

            const trimmed = newText.trim();
            if (trimmed === "") return;

            notes[index] = trimmed;
            localStorage.setItem("notes", JSON.stringify(notes));
            renderNotes();
        }
    });

    // ===========================
    // 5. Logout
    // ===========================
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedUser");
        window.location.href = "login.html";
    });

});
