document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.page-nav__day').forEach(day => {
        day.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = day.getAttribute('href');
        });
    });
});

async function loadSeances(selectedDate) {
    if (!movie.seances || movie.seances.length === 0) {
        console.warn(`Фильм "${movie.title}" не имеет сеансов.`);
        return;
    }

    try {
        const response = await fetch(`/api/seances?date=${selectedDate}`);
        const seances = await response.json();

        const mainContainer = document.querySelector('main');
        mainContainer.innerHTML = "";

        if (seances.length === 0) {
            mainContainer.innerHTML = "<p class='no-seances'>Нет сеансов на выбранную дату.</p>";
            return;
        }

        seances.forEach(movie => {
            const section = document.createElement("section");
            section.classList.add("movie");

            section.innerHTML = `
                <div class="movie__info">
                    <div class="movie__poster">
                        <img class="movie__poster-image"
                            src="${movie.poster ? movie.poster : '/client/i/poster2.jpg'}"
                            alt="${movie.title}">
                    </div>
                    <div class="movie__description">
                        <h2 class="movie__title">${movie.title}</h2>
                        <p class="movie__synopsis">${movie.description}</p>
                        <p class="movie__data">
                            <span class="movie__data-duration">${movie.duration} минут</span>
                            <span class="movie__data-origin">${movie.country}</span>
                        </p>
                    </div>
                </div>
            `;

            movie.seances.forEach(hall => {
                const hallDiv = document.createElement("div");
                hallDiv.classList.add("movie-seances__hall");
                hallDiv.innerHTML = `<h3 class="movie-seances__hall-title">Зал ${hall.name}</h3>
                                     <ul class="movie-seances__list"></ul>`;
                const list = hallDiv.querySelector(".movie-seances__list");

                hall.seances.forEach(seance => {
                    const li = document.createElement("li");
                    li.classList.add("movie-seances__time-block");
                    li.innerHTML = `<a class="movie-seances__time" href="javascript:void(0);">
                        ${seance.start_time}
                    </a>`;
                    list.appendChild(li);
                });

                section.appendChild(hallDiv);
            });

            mainContainer.appendChild(section);
        });

    } catch (error) {
        console.error("Ошибка загрузки сеансов:", error);
    }
}

document.querySelector(".page-header__title").addEventListener("click", function () {
    window.location.href = "/"; // Замените "/" на нужный URL
});

