async function loadHalls() {
    try {
        const response = await fetch("/api/halls");
        const halls = await response.json();

        // Обновляем список залов в Конфигурации залов
        const hallList = document.querySelector("#halls-price-list");
        if (hallList) {
            hallList.innerHTML = "";
            halls.forEach(hall => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <input type="radio" class="conf-step__radio" name="chairs-hall" value="${hall.id}">
                    <span class="conf-step__selector">${hall.name}</span>
                `;
                hallList.appendChild(li);
            });

            if (halls.length > 0) {
                hallList.querySelector("input").checked = true;
            }
        }

        // Обновляем список залов в Конфигурации цен
        const hallPriceList = document.querySelector("#halls-price-lists");
        if (hallPriceList) {
            hallPriceList.innerHTML = "";
            halls.forEach(hall => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <input type="radio" class="conf-step__radio" name="price-hall" value="${hall.id}">
                    <span class="conf-step__selector">${hall.name}</span>
                `;
                hallPriceList.appendChild(li);
            });

            if (halls.length > 0) {
                hallPriceList.querySelector("input").checked = true;
            }
        }

        // Обновляем список залов в Сетке сеансов
        const hallSelect = document.getElementById("seance-hall");
        if (hallSelect) {
            hallSelect.innerHTML = "";
            halls.forEach(hall => {
                const option = document.createElement("option");
                option.value = hall.id;
                option.textContent = hall.name;
                option.setAttribute("data-standard-price", hall.standard_price ?? 0);
                option.setAttribute("data-vip-price", hall.vip_price ?? 0);
                hallSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Ошибка загрузки залов:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadHalls();
});

document.getElementById("open-sales").addEventListener("click", function () {
    window.location.href = "/"; // Замените "/" на нужный URL главной страницы
});
