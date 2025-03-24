let currentHallData = null;

// document.addEventListener("DOMContentLoaded", () => {
//     loadHalls();
// });

document.addEventListener("DOMContentLoaded", async () => {
    await loadHallData(document.querySelector("input[name='chairs-hall']:checked")?.value);
});


// async function loadHalls() {
//     console.log("Функция loadHalls вызвана!");
// }

async function loadHalls() {
    console.log("www");
    const response = await fetch("/api/halls");
    const halls = await response.json();

    const hallList = document.querySelector("#halls-price-list");
    hallList.innerHTML = "";

    halls.forEach(hall => {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="radio" class="conf-step__radio" name="chairs-hall" value="${hall.id}">
            <span class="conf-step__selector">${hall.name}</span>
        `;
        hallList.appendChild(li);
    });


    // Выбираем первый зал по умолчанию и загружаем его данные
    if (halls.length > 0) {
        hallList.querySelector("input").checked = true;
        loadHallData(halls[0].id);
    }
}

document.querySelector("#halls-price-list").addEventListener("change", (event) => {
    const hallId = event.target.value;
    loadHallData(hallId);
});

async function loadHallData(hallId) {
    const response = await fetch(`/api/halls/${hallId}/layout`);
    const data = await response.json();

   
    // Сохраняем текущие данные
    data.hallId = hallId; 
    currentHallData = data;

    // Обновляем поля на странице
    document.getElementById("rows-count").value = data.rows;
    document.getElementById("seats-count").value = data.seats;

    console.log("Загруженный layout:", data.layout);
    if (!Array.isArray(data.layout)) {
        data.layout = Array(10).fill(Array(8).fill("standard"));
    }

    console.log("Загруженный layout:", data.layout);
    renderHallLayout(data.layout);
}


function renderHallLayout(layout) {
    const hallWrapper = document.querySelector("#hall-layout");
    hallWrapper.innerHTML = ""; // Очищаем предыдущее содержимое
    
    console.log(layout)

    layout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("conf-step__row");
        

        row.forEach(seatType => {
            const seat = document.createElement("span");
            seat.classList.add("conf-step__chair");

            if (seatType === "standard") seat.classList.add("conf-step__chair_standart");
            if (seatType === "vip") seat.classList.add("conf-step__chair_vip");
            if (seatType === "disabled") seat.classList.add("conf-step__chair_disabled");

            // Добавляем обработчик клика для изменения типа кресла
            seat.addEventListener("click", () => {
                toggleSeatType(seat);
            });

            rowDiv.appendChild(seat);
        });

        hallWrapper.appendChild(rowDiv);
    });
}


function toggleSeatType(seat) {
    if (seat.classList.contains("conf-step__chair_standart")) {
        seat.classList.remove("conf-step__chair_standart");
        seat.classList.add("conf-step__chair_vip");
    } else if (seat.classList.contains("conf-step__chair_vip")) {
        seat.classList.remove("conf-step__chair_vip");
        seat.classList.add("conf-step__chair_disabled");
    } else if (seat.classList.contains("conf-step__chair_disabled")) {
        seat.classList.remove("conf-step__chair_disabled");
        seat.classList.add("conf-step__chair_standart");
    }
}

document.getElementById("update-rows-seats").addEventListener("click", async () => {
    const hallId = document.querySelector("input[name='chairs-hall']:checked").value;
    const rows = Number(document.getElementById("rows-count").value);
    const seats = Number(document.getElementById("seats-count").value);

    const response = await fetch(`/api/halls/${hallId}/update-seats`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ rows, seats })
    });

    location.reload();

    if (response.ok) {
        alert("Количество рядов и мест обновлено!");
    } else {
        alert("Ошибка обновления!");
    }
});


document.getElementById("save-conf-hall").addEventListener("click", async () => {
    if (!currentHallData) {
        alert("Ошибка: данные зала не загружены!");
        return;
    }

    const hallId = currentHallData.hallId; // Теперь ID точно есть
    const rows = currentHallData.rows;
    const seats = currentHallData.seats;
    const standardPrice = currentHallData.standard_price;
    const vipPrice = currentHallData.vip_price;

    // Считываем текущую раскладку мест из DOM
    const layout = [];
    document.querySelectorAll(".conf-step__row").forEach(row => {
        const rowLayout = [];
        row.querySelectorAll(".conf-step__chair").forEach(seat => {
            if (seat.classList.contains("conf-step__chair_standart")) rowLayout.push("standard");
            if (seat.classList.contains("conf-step__chair_vip")) rowLayout.push("vip");
            if (seat.classList.contains("conf-step__chair_disabled")) rowLayout.push("disabled");
        });
        layout.push(rowLayout);
    });

    const requestData = {
        rows: Number(rows),
        seats: Number(seats),
        layout: layout,
        standard_price: Number(standardPrice),
        vip_price: Number(vipPrice),
    };

    console.log("Сохранение зала:", requestData.rows);

    const response = await fetch(`/api/halls/${hallId}/layout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify(requestData),
    });

    if (response.ok) {
        alert("Сохранено успешно!");
    } else {
        alert("Ошибка при сохранении!");
    }
});

