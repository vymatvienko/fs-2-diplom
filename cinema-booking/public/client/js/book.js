document.addEventListener("DOMContentLoaded", async () => {
    const seanceId = getSeanceIdFromURL(); // Получаем ID из URL

    const style = document.createElement("style");
    style.innerHTML = `
        .row {
            display: flex;
        }
        .seat {
            width: 30px;
            height: 30px;
            margin: 2px;
            background-color: gray;
            text-align: center;
        }
        .seat.vip {
            background-color: gold;
        }
        .seat.disabled {
            background-color: black;
        }
    `;
    document.head.appendChild(style);

    await loadSeanceLayout(seanceId);
});

async function loadSeanceLayout() {
    const seanceId = getSeanceIdFromURL();

    if (!seanceId) {
        console.error("Seance ID не найден в URL");
        return;
    }

    try {
        const response = await fetch(`/api/seances/${seanceId}/layout`);
        if (!response.ok) {
            throw new Error("Ошибка загрузки данных");
        }

        const data = await response.json();

        renderSeatingLayout(data, data.standard_price, data.vip_price, seanceId);
    } catch (error) {
        console.error("Ошибка загрузки схемы:", error);
    }
}


function renderSeatingLayout(data, standardPrice, vipPrice, seanceId) { // Добавляем параметр seanceId
    const hallWrapper = document.querySelector("#hall-layout");
    let selectedSeats = new Set();

    // Удаляем старую схему, если она есть
    const oldSeating = hallWrapper.querySelector(".buying-scheme__wrapper");
    if (oldSeating) oldSeating.remove();

    // Контейнер для схемы
    const seatingContainer = document.createElement("div");
    seatingContainer.classList.add("buying-scheme__wrapper");

    let foundStandardPrice = null;
    let foundVipPrice = null;

    data.layout.forEach((row, rowIndex) => {
        const rowElement = document.createElement("div");
        rowElement.classList.add("buying-scheme__row");

        row.forEach((seat, seatIndex) => {
            const seatElement = document.createElement("span");
            seatElement.classList.add("buying-scheme__chair");

            // Если место — объект, извлекаем его тип и цену
            let seatType = typeof seat === "object" ? seat.type : seat;
            let seatPrice = typeof seat === "object" ? seat.price : 0;

            if (seatType === "vip") {
                seatElement.classList.add("buying-scheme__chair_vip");
                if (!foundVipPrice) foundVipPrice = seatPrice; // Сохраняем цену VIP
            }
            if (seatType === "standard") {
                seatElement.classList.add("buying-scheme__chair_standart");
                if (!foundStandardPrice) foundStandardPrice = seatPrice; // Сохраняем цену стандартного места
            }
            if (seatType === "disabled" || seatType === "taken") {
                seatElement.classList.add("buying-scheme__chair_disabled");
            }

            rowElement.appendChild(seatElement);

            seatElement.addEventListener("click", function () {
                if (seat === "disabled" || seat === "taken") return;

                if (seatElement.classList.contains("buying-scheme__chair_selected")) {
                    seatElement.classList.remove("buying-scheme__chair_selected");
                    selectedSeats.delete(`${rowIndex}-${seatIndex}`);
                } else {
                    seatElement.classList.add("buying-scheme__chair_selected");
                    selectedSeats.add(`${rowIndex}-${seatIndex}`);
                }
                

                updateTotalPrice(selectedSeats, data.layout, standardPrice, vipPrice);
            });

            rowElement.appendChild(seatElement);
        });

        seatingContainer.appendChild(rowElement);
    });

    hallWrapper.appendChild(seatingContainer);

    let legend = hallWrapper.querySelector(".buying-scheme__legend");
    if (!legend) {
        legend = document.createElement("div");
        legend.classList.add("buying-scheme__legend");
        legend.innerHTML = `
            <div class="col">
                <p class="buying-scheme__legend-price">
                    <span class="buying-scheme__chair buying-scheme__chair_standart"></span> 
                    Свободно (<span class="buying-scheme__legend-value">${foundStandardPrice}</span> руб)
                </p>
                <p class="buying-scheme__legend-price">
                    <span class="buying-scheme__chair buying-scheme__chair_vip"></span> 
                    Свободно VIP (<span class="buying-scheme__legend-value">${foundVipPrice}</span> руб)
                </p>
            </div>
            <div class="col">
                <p class="buying-scheme__legend-price">
                    <span class="buying-scheme__chair buying-scheme__chair_taken"></span> Занято
                </p>
                <p class="buying-scheme__legend-price">
                    <span class="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано
                </p>
            </div>
        `;
        hallWrapper.appendChild(legend);
    }

    console.log("Схема успешно отрисована!");

    document.getElementById("book-tickets").addEventListener("click", async function () {
        if (selectedSeats.size === 0) {
            alert("Выберите хотя бы одно место!");
            return;
        }
    
        const updatedLayout = JSON.parse(JSON.stringify(data.layout));
    
        selectedSeats.forEach(seatKey => {
            const [row, seat] = seatKey.split("-").map(Number);
            updatedLayout[row][seat] = "taken";
        });
    
        console.log(`Бронирование сеанса ${seanceId}, обновленный layout:`, updatedLayout);
    
        try {
            const response = await fetch(`/api/seances/${seanceId}/update-layout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ layout: updatedLayout }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ошибка ответа от сервера:', errorText);
                alert('Ошибка на сервере!');
                return;
            }
    
            const responseData = await response.json();
            console.log('Ответ от сервера:', responseData);
            alert("Бронирование выполнено!");
    
            updateSeatingLayout(updatedLayout);
    
            // Перенаправление на страницу билета
            window.location.href = `/payment/${seanceId}`;
        } catch (error) {
            console.error("Ошибка бронирования:", error);
            alert("Ошибка связи с сервером");
        }
    });
    
    
}


function updateSeatingLayout(newLayout) {
    const seatingContainer = document.querySelector(".buying-scheme__wrapper");

    newLayout.forEach((row, rowIndex) => {
        row.forEach((seat, seatIndex) => {
            const seatElement = seatingContainer.children[rowIndex].children[seatIndex];

            if (seat === "taken") {
                seatElement.classList.remove("buying-scheme__chair_selected");
                seatElement.classList.add("buying-scheme__chair_taken");
            }
        });
    });
}

// Функция расчета итоговой стоимости
function updateTotalPrice(selectedSeats, layout, standardPrice, vipPrice) {
    let totalPrice = 0;

    selectedSeats.forEach(seatKey => {
        const [rowIndex, seatIndex] = seatKey.split("-").map(Number);
        const seat = layout[rowIndex][seatIndex];
        const price = parseInt(seat.price, 10);  
        totalPrice += price;
    });

    totalPrice = Math.round(totalPrice); //или Math.floor(totalPrice), или Math.ceil(totalPrice)

    document.getElementById("total-price").textContent = `Итоговая цена: ${totalPrice} руб.`;
}

// Функция получения ID сеанса
function getSeanceIdFromURL() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

document.addEventListener("DOMContentLoaded", function () {
    const payButton = document.getElementById("pay-button");
    if (payButton) {
        payButton.addEventListener("click", function () {
            const qrCodeContainer = document.getElementById("qr-code");

            // Получаем ID сеанса из URL
            const urlParts = window.location.pathname.split('/');
            const seanceId = urlParts[urlParts.length - 1]; // Последняя часть URL (например, 24)

            // Формируем короткую ссылку
            const bookingUrl = `${window.location.origin}/booking/${seanceId}`;

            // Генерируем QR-код
            qrCodeContainer.innerHTML = "";
            new QRCode(qrCodeContainer, {
                text: bookingUrl,
                width: 128,
                height: 128,
                correctLevel: QRCode.CorrectLevel.L
            });

            // Скрываем кнопку и показываем QR-код
            payButton.style.display = "none";
            qrCodeContainer.style.display = "block";
        });
    } else {
        console.error("Кнопка оплаты не найдена!");
    }
});


