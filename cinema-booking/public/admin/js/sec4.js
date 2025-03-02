document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/movies")
        .then(response => response.json())
        .then(movies => {
            const movieContainer = document.querySelector(".conf-step__movies");
            movieContainer.innerHTML = ""; // Очищаем старые данные

            movies.forEach(movie => {
                const movieElement = document.createElement("div");
                movieElement.classList.add("conf-step__movie");
                movieElement.innerHTML = `
                    <img class="conf-step__movie-poster" alt="poster" src="${movie.poster}">
                    <h3 class="conf-step__movie-title">${movie.title}</h3>
                    <p class="conf-step__movie-duration">${movie.duration} минут</p>
                `;
                movieContainer.appendChild(movieElement);
            });
        })
        .catch(error => console.error("Ошибка загрузки фильмов:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/seances")
        .then(response => response.json())
        .then(seances => {
            const seancesContainer = document.querySelector(".conf-step__seances");
            seancesContainer.innerHTML = ""; // Очищаем старые данные

            // Группируем сеансы по залам
            const halls = {};
            seances.forEach(seance => {
                if (!halls[seance.hall.id]) {
                    halls[seance.hall.id] = {
                        name: seance.hall.name,
                        seances: []
                    };
                }
                halls[seance.hall.id].seances.push(seance);
            });

            // Отрисовываем залы и их сеансы
            Object.values(halls).forEach(hall => {
                const hallElement = document.createElement("div");
                hallElement.classList.add("conf-step__seances-hall");
                hallElement.innerHTML = `<h3 class="conf-step__seances-title">${hall.name}</h3>
                                         <div class="conf-step__seances-timeline"></div>`;

                const timeline = hallElement.querySelector(".conf-step__seances-timeline");

                hall.seances.forEach(seance => {
                    const movieElement = document.createElement("div");
                    movieElement.classList.add("conf-step__seances-movie");
                    movieElement.style.width = `${seance.movie.duration / 2}px`; // Масштабируем по времени
                    movieElement.style.backgroundColor = getRandomColor(); // Генерируем случайный цвет
                    movieElement.style.left = `${(parseInt(seance.start_time.split(":")[0]) * 30)}px`; // Смещение по времени

                    movieElement.innerHTML = `
                        <p class="conf-step__seances-movie-title">${seance.movie.title}</p>
                        <p class="conf-step__seances-movie-start">${seance.start_time}</p>
                    `;

                    timeline.appendChild(movieElement);
                });

                seancesContainer.appendChild(hallElement);
            });
        })
        .catch(error => console.error("Ошибка загрузки сеансов:", error));
});

// Функция для генерации случайного цвета
function getRandomColor() {
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff"];
    return colors[Math.floor(Math.random() * colors.length)];
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadHalls();
    await loadMovies();
    await loadSeances();
});

// Загрузка залов
async function loadHalls() {
    try {
        const response = await fetch("/api/halls");
        const halls = await response.json();
        const hallSelect = document.getElementById("seance-hall");

        hallSelect.innerHTML = "";
        halls.forEach(hall => {
            const option = document.createElement("option");
            option.value = hall.id;
            option.textContent = hall.name;
            hallSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка загрузки залов:", error);
    }
}

// Загрузка фильмов
async function loadMovies() {
    try {
        const response = await fetch("/api/movies");
        const movies = await response.json();
        const movieSelect = document.getElementById("seance-movie");

        movieSelect.innerHTML = "";
        movies.forEach(movie => {
            const option = document.createElement("option");
            option.value = movie.id;
            option.textContent = movie.title;
            movieSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка загрузки фильмов:", error);
    }
}

document.getElementById("add-seance").addEventListener("click", async function () {
    const hallId = document.getElementById("seance-hall").value;
    const movieId = document.getElementById("seance-movie").value;
    const startTime = document.getElementById("seance-time").value;

    if (!hallId || !movieId || !startTime) {
        alert("Выберите зал, фильм и укажите время!");
        return;
    }

    try {
        const response = await fetch("/api/seances", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ hall_id: hallId, movie_id: movieId, start_time: startTime })
        });

        if (!response.ok) throw new Error("Ошибка при добавлении сеанса");

        await loadSeances();
    } catch (error) {
        console.error("Ошибка добавления сеанса:", error);
    }
});

const movieColors = {}; // Храним цвета для фильмов

function getFixedColor(movieId) {
    if (!movieColors[movieId]) {
        const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff"];
        movieColors[movieId] = colors[Math.floor(Math.random() * colors.length)];
    }
    return movieColors[movieId];
}

async function loadSeances() {
    try {
        const response = await fetch("/api/seances");
        const seances = await response.json();
        const seanceContainer = document.querySelector(".conf-step__seances");
        seanceContainer.innerHTML = "";

        const halls = {};

        // Группируем сеансы по залам
        seances.forEach(seance => {
            if (!halls[seance.hall.id]) {
                halls[seance.hall.id] = {
                    name: seance.hall.name,
                    seances: []
                };
            }
            halls[seance.hall.id].seances.push(seance);
        });

        // Рисуем каждый зал
        Object.values(halls).forEach(hall => {
            const hallElement = document.createElement("div");
            hallElement.classList.add("conf-step__seances-hall");
            hallElement.innerHTML = `<h3 class="conf-step__seances-title">${hall.name}</h3>
                                     <div class="conf-step__seances-timeline"></div>`;

            const timeline = hallElement.querySelector(".conf-step__seances-timeline");

            hall.seances.forEach(seance => {
                const movieElement = document.createElement("div");
                movieElement.classList.add("conf-step__seances-movie");

                // Расчет позиции на шкале
                const startTime = seance.start_time.split(":");
                const startHour = parseInt(startTime[0]);
                const startMin = parseInt(startTime[1]);

                const duration = seance.movie.duration;
                const width = (duration / 2) + "px";  // Масштаб 2 пикселя за минуту

                const left = ((startHour * 60 + startMin) / 2) + "px";

                movieElement.style.width = width;
                movieElement.style.left = left;
                movieElement.style.backgroundColor = getFixedColor(seance.movie.id); // Используем фиксированный цвет

                movieElement.innerHTML = `
                    <p class="conf-step__seances-movie-title">${seance.movie.title}</p>
                    <p class="conf-step__seances-movie-start">${seance.start_time}</p>
                    <button class="delete-seance" data-id="${seance.id}">❌</button>
                `;

                timeline.appendChild(movieElement);
            });

            seanceContainer.appendChild(hallElement);
        });

        // Навешиваем обработчики на кнопки удаления
        document.querySelectorAll(".delete-seance").forEach(button => {
            button.addEventListener("click", deleteSeance);
        });

    } catch (error) {
        console.error("Ошибка загрузки сеансов:", error);
    }
}


// Функция для удаления сеанса
async function deleteSeance(event) {
    const seanceId = event.target.dataset.id;
    try {
        await fetch(`/api/seances/${seanceId}`, { method: "DELETE" });
        await loadSeances();  // Перезагружаем список
    } catch (error) {
        console.error("Ошибка удаления сеанса:", error);
    }
}

document.getElementById("add-movie").addEventListener("click", async function () {
    const title = document.getElementById("movie-title").value.trim();
    const duration = parseInt(document.getElementById("movie-duration").value.trim());

    body: JSON.stringify({ title, duration: parseInt(duration) })

    if (!title || isNaN(duration) || duration <= 0) {
        alert("Введите корректные данные!");
        return;
    }

    try {
        const response = await fetch("/api/movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, duration })
        });

        if (!response.ok) throw new Error("Ошибка при добавлении фильма");

        document.getElementById("movie-title").value = "";
        document.getElementById("movie-duration").value = "";

        await loadMovies(); // Перезагружаем список фильмов
    } catch (error) {
        console.error("Ошибка добавления фильма:", error);
    }
});
