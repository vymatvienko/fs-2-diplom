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
    // await loadHalls();
    await loadMovies();
    await loadSeances();

    document.getElementById("date-picker").addEventListener("change", function (event) {
        loadSeances(event.target.value);
    });
    
});

// Загрузка залов
async function loadHalls() {
    const response = await fetch("/api/halls");
    const halls = await response.json();

    const hallSelect = document.getElementById("seance-hall");
    hallSelect.innerHTML = ""; // Очищаем перед добавлением

    halls.forEach(hall => {
        const option = document.createElement("option");
        option.value = hall.id;
        option.textContent = hall.name;
        option.setAttribute("data-standard-price", hall.standard_price ?? 0);  // ✅ Добавляем цены
        option.setAttribute("data-vip-price", hall.vip_price ?? 0);            // ✅ Добавляем цены
        hallSelect.appendChild(option);
    });
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
    const hallSelect = document.getElementById("seance-hall");
    const hallId = hallSelect.value;
    const movieId = document.getElementById("seance-movie").value;
    const startTime = document.getElementById("seance-time").value;
    const date = document.getElementById("date-picker").value;

    // Проверяем, получаем ли цены
    // const standardPrice = hallSelect.options[hallSelect.selectedIndex].dataset.standardPrice;
    // const vipPrice = hallSelect.options[hallSelect.selectedIndex].dataset.vipPrice;

    const selectedOption = hallSelect.options[hallSelect.selectedIndex];
    const standardPrice = selectedOption.getAttribute("data-standard-price") ?? 0;
    const vipPrice = selectedOption.getAttribute("data-vip-price") ?? 0;


    console.log("hallId:", hallId);
    console.log("standardPrice:", standardPrice);
    console.log("vipPrice:", vipPrice);

    if (!hallId || !movieId || !startTime || !date) {
        alert("Выберите зал, фильм и укажите время и дату!");
        return;
    }

    try {
        const response = await fetch("/api/seances", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                hall_id: hallId,
                movie_id: movieId,
                start_time: startTime,
                date: date,
                standard_price: standardPrice ?? 0,  // ✅ Подставляем 0, если пусто
                vip_price: vipPrice ?? 0              // ✅ Подставляем 0, если пусто
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Ошибка при добавлении сеанса");
        }

        alert("Сеанс успешно добавлен!");
        await loadSeances();
    } catch (error) {
        console.error("Ошибка добавления сеанса:", error);
        alert("Ошибка при добавлении сеанса!");
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

async function loadSeances(selectedDate = null) {
    try {
        const response = await fetch("/api/seances");
        const seances = await response.json();
        const seanceContainer = document.querySelector(".conf-step__seances");
        seanceContainer.innerHTML = "";

        const halls = {};

        // Группируем сеансы по залам, фильтруя по дате
        seances.forEach(seance => {
            if (!selectedDate || seance.date === selectedDate) { // Фильтр по дате
                if (!halls[seance.hall.id]) {
                    halls[seance.hall.id] = {
                        name: seance.hall.name,
                        seances: []
                    };
                }
                halls[seance.hall.id].seances.push(seance);
            }
        });

        // Рисуем залы и сеансы
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
                movieElement.style.backgroundColor = getFixedColor(seance.movie.id);

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
        await loadSeances(document.getElementById("date-picker").value); // Перезагружаем с выбранной датой
    } catch (error) {
        console.error("Ошибка удаления сеанса:", error);
    }
}


document.getElementById("add-movie").addEventListener("click", async () => {
    const title = document.getElementById("movie-title").value.trim();
    const duration = document.getElementById("movie-duration").value.trim();
    const description = document.getElementById("movie-description").value.trim();

    if (!title || !duration) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    const requestData = {
        title: title,
        duration: Number(duration),
        description: description
    };

    try {
        const response = await fetch("/api/movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            alert("Фильм успешно добавлен!");
            document.getElementById("movie-title").value = "";
            document.getElementById("movie-duration").value = "";
            document.getElementById("movie-description").value = "";
        } else {
            const errorData = await response.json();
            alert("Ошибка: " + errorData.error);
        }
    } catch (error) {
        console.error("Ошибка при добавлении фильма:", error);
        alert("Ошибка при добавлении фильма!");
    }
});