document.addEventListener("DOMContentLoaded", function () {
    fetch("/halls")
        .then(response => response.json())
        .then(data => {
            const hallList = document.getElementById("halls-price-lists");
            hallList.innerHTML = ""; // Очищаем перед вставкой

            data.forEach((hall, index) => {
                const hallItem = document.createElement("li");
                hallItem.innerHTML = `
                    <input type="radio" class="conf-step__radio" name="prices-hall" value="${hall.id}" ${index === 0 ? "checked" : ""}>
                    <span class="conf-step__selector">${hall.name}</span>
                `;
                hallList.appendChild(hallItem);
            });

            if (data.length > 0) {
                loadPrices(data[0].id); // Загружаем цены для первого зала
            }
        })
        .catch(error => console.error("Ошибка загрузки залов:", error));
});


function loadPrices(hallId) {
    fetch(`/halls/${hallId}/prices`)
        .then(response => response.json())
        .then(data => {
            document.querySelector(".conf-step__legend input[placeholder='0']").value = data.standard || 0;
            document.querySelector(".conf-step__legend input[value='350']").value = data.vip || 0;
        })
        .catch(error => console.error("Ошибка загрузки цен:", error));
}

// Обработчик выбора зала
document.addEventListener("change", function (event) {
    if (event.target.name === "prices-hall") {
        loadPrices(event.target.value);
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const createPriceHallBtn = document.getElementById("create-pricehall");
    if (!createPriceHallBtn) {
        console.error("Кнопка создания зала (create-hall-btn) не найдена!");
        return;
    }

    createPriceHallBtn.addEventListener("click", function () {
        const hallId = document.querySelector("input[name='prices-hall']:checked").value;
        const standardPrice = document.querySelector(".conf-step__legend input[placeholder='0']").value;
        const vipPrice = document.querySelector(".conf-step__legend input[value='350']").value;
        
        fetch(`/halls/${hallId}/prices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ standard: standardPrice, vip: vipPrice })
        })
        .then(response => response.json())
        .then(data => alert("Цены сохранены!"))
        .catch(error => console.error("Ошибка сохранения цен:", error));
    });
});


document.querySelector(".conf-step__button-regular").addEventListener("click", function () {
    const selectedHall = document.querySelector("input[name='prices-hall']:checked").value;
    loadPrices(selectedHall);
});
