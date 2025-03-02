const headers = Array.from(document.querySelectorAll('.conf-step__header'));
headers.forEach(header => header.addEventListener('click', () => {
  header.classList.toggle('conf-step__header_closed');
  header.classList.toggle('conf-step__header_opened');
}));

document.addEventListener("DOMContentLoaded", function () {
  const hallsContainer = document.getElementById("halls-container");
  if (!hallsContainer) {
      console.error("Ошибка: контейнер для залов (halls-container) не найден.");
      return;
  }

  // Функция загрузки залов
  function loadHalls() {
    fetch("/halls")
        .then(response => response.json())
        .then(data => {
            hallsContainer.innerHTML = ""; // Очищаем контейнер перед вставкой
            data.forEach(hall => {
                const hallElement = document.createElement("li");
                hallElement.classList.add("conf-step__list-item");
                hallElement.dataset.id = hall.id;
                hallElement.innerHTML = `
                    <span class="hall-name">${hall.name}</span>
                    <button class="conf-step__button conf-step__button-trash" data-id="${hall.id}">🗑</button>
                `;
                hallsContainer.appendChild(hallElement);
            });
        })
        .catch(error => console.error("Ошибка при загрузке залов:", error));
}

  loadHalls(); // Загружаем залы при старте
  
  // Форма создания зала
    const createHallBtn = document.getElementById("create-hall");
    if (!createHallBtn) {
        console.error("Кнопка создания зала (create-hall-btn) не найдена!");
        return;
    }

    createHallBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("hall-name");

        if (!nameInput) {
            console.error("Один из инпутов не найден!");
            return;
        }

        const name = nameInput.value.trim();
        const capacity = 10;

        fetch("/halls", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ name, capacity })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Зал создан:", data);
            loadHalls(); // Перезагрузить список залов
        })
        .catch(async error => {
            let text = await error.text();
            console.error("Ошибка при создании зала:", text);
        });
        
    });

    hallsContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("conf-step__button-trash")) {
            let hallId = event.target.getAttribute("data-id");

            if (confirm("Вы уверены, что хотите удалить этот зал?")) {
                fetch(`/halls/${hallId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Ошибка при удалении зала");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Зал удалён:", data);
                    loadHalls(); // Перезагружаем список после удаления
                })
                .catch(error => console.error("Ошибка:", error));
            }
        }
    });

    loadHalls(); // Загружаем залы при загрузке страницы

    
    
        

});
