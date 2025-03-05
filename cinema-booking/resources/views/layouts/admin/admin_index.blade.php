<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('admin/css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('admin/css/styles.css') }}">
    <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext"
        rel="stylesheet">
</head>


<body>

    <header class="page-header">
        <h1 class="page-header__title">Идём<span>в</span>кино</h1>
        <span class="page-header__subtitle">Администраторррская</span>
    </header>

    <main class="conf-steps">
        <section class="conf-step">
            <header class="conf-step__header conf-step__header_opened">
                <h2 class="conf-step__title">Управление залами</h2>
            </header>
            <div class="conf-step__wrapper">
                <p class="conf-step__paragraph">Доступные залы:</p>
                <ul class="conf-step__list" id="halls-container">
                </ul>
                <input type="text" id="hall-name" placeholder="Название зала">
                <button id="create-hall" class="conf-step__button conf-step__button-accent">Создать зал</button>
            </div>
        </section>

        <section class="conf-step">
            <header class="conf-step__header conf-step__header_opened">
                <h2 class="conf-step__title">Конфигурация залов</h2>
            </header>
            <div class="conf-step__wrapper">
                <p class="conf-step__paragraph">Выберите зал для конфигурации:</p>
                <ul class="conf-step__selectors-box" id="halls-price-list">
                    <!-- Здесь будет динамически загружаться список залов -->
                </ul>

                <p class="conf-step__paragraph">Укажите количество рядов и мест:</p>
                <div class="conf-step__legend">
                    <label class="conf-step__label">Рядов: <input type="number" id="rows-count" class="conf-step__input"
                            min="1" value="10"></label>
                    <span class="multiplier">x</span>
                    <label class="conf-step__label">Мест: <input type="number" id="seats-count" class="conf-step__input"
                            min="1" value="8"></label>
                    <button class="conf-step__button conf-step__button-accent" id="update-rows-seats">Изменить</button>
                </div>

                <p class="conf-step__paragraph">Настройка типов кресел:</p>
                <div class="conf-step__legend">
                    <span class="conf-step__chair conf-step__chair_standart"></span> — Обычные кресла
                    <span class="conf-step__chair conf-step__chair_vip"></span> — VIP кресла
                    <span class="conf-step__chair conf-step__chair_disabled"></span> — Заблокированные (нет кресла)
                    <p class="conf-step__hint">Кликните по креслу, чтобы изменить его тип</p>
                </div>

                <div class="conf-step__hall">
                    <div class="conf-step__hall-wrapper" id="hall-layout">
                        <!-- Здесь будет отрисовываться схема зала -->
                    </div>
                </div>

                <fieldset class="conf-step__buttons text-center">
                    <button class="conf-step__button conf-step__button-regular" id="cancel">Отмена</button>
                    <button class="conf-step__button conf-step__button-accent" id="save-conf-hall">Сохранить</button>
                </fieldset>
            </div>
        </section>


        <section class="conf-step">
            <header class="conf-step__header conf-step__header_opened">
                <h2 class="conf-step__title">Конфигурация цен</h2>
            </header>
            <div class="conf-step__wrapper">
                <p class="conf-step__paragraph">Выберите зал для конфигурации:</p>
                <ul class="conf-step__selectors-box" id="halls-price-lists"></ul>

                <p class="conf-step__paragraph">Установите цены для типов кресел:</p>
                <div class="conf-step__legend">
                    <label class="conf-step__label">Цена, рублей<input type="text" class="conf-step__input"
                            placeholder="0"></label>
                    за <span class="conf-step__chair conf-step__chair_standart"></span> обычные кресла
                </div>
                <div class="conf-step__legend">
                    <label class="conf-step__label">Цена, рублей<input type="text" class="conf-step__input"
                            placeholder="0" value="350"></label>
                    за <span class="conf-step__chair conf-step__chair_vip"></span> VIP кресла
                </div>

                <fieldset class="conf-step__buttons text-center">
                    <button class="conf-step__button conf-step__button-regular">Отмена</button>
                    <input type="submit" id="create-pricehall" value="Сохранить"
                        class="conf-step__button conf-step__button-accent">
                </fieldset>
            </div>
        </section>

        <section class="conf-step">
            <header class="conf-step__header conf-step__header_opened">
                <h2 class="conf-step__title">Сетка сеансов</h2>
            </header>
            <div class="conf-step__wrapper">

                <!-- Выбор зала и фильма -->
                <p class="conf-step__paragraph">
                    <label>Выберите зал:
                        <select id="seance-hall"></select>
                    </label>
                </p>
                <p class="conf-step__paragraph">
                    <label>Выберите фильм:
                        <select id="seance-movie"></select>
                    </label>
                </p>
                <p class="conf-step__paragraph">
                    <label>Время начала:
                        <input type="time" id="seance-time">
                    </label>
                </p>
                <p class="conf-step__paragraph">
                    <button id="add-seance" class="conf-step__button conf-step__button-accent">Добавить сеанс</button>
                </p>

                <div class="conf-step__add-movie">
                    <h3 class="conf-step__title">Добавить фильм</h3>

                    <div class="conf-step__form-group">
                        <label for="movie-title">Название фильма:</label>
                        <input type="text" id="movie-title" class="conf-step__input conf-step__input-text"
                            placeholder="Введите название">
                    </div>

                    <div class="conf-step__form-group">
                        <label for="movie-duration">Продолжительность (мин):</label>
                        <input type="number" id="movie-duration" class="conf-step__input conf-step__input-number"
                            placeholder="Введите продолжительность">
                    </div>

                    <div class="conf-step__form-group">
                        <label for="movie-description">Описание фильма:</label>
                        <textarea id="movie-description" class="conf-step__input conf-step__textarea" rows="3"
                            placeholder="Введите описание"></textarea>
                    </div>

                    <button id="add-movie" class="conf-step__button conf-step__button-accent">Добавить фильм</button>
                </div>





                Список доступных фильмов
                <div class="conf-step__movies" id="movies-list"></div>

                <!-- Сетка сеансов -->
                <div class="conf-step__seances" id="seances-list"></div>

                <!-- Кнопки -->
                <fieldset class="conf-step__buttons text-center">
                    <button class="conf-step__button conf-step__button-regular">Отмена</button>
                    <input type="submit" value="Сохранить" class="conf-step__button conf-step__button-accent">
                </fieldset>
            </div>
        </section>

        <section class="conf-step">
            <header class="conf-step__header conf-step__header_opened">
                <h2 class="conf-step__title">Открыть продажи</h2>
            </header>
            <div class="conf-step__wrapper text-center">
                <p class="conf-step__paragraph">Всё готово, теперь можно:</p>
                <button class="conf-step__button conf-step__button-accent">Открыть продажу билетов</button>
            </div>
        </section>
    </main>
    <script src="{{ asset('admin/js/accordeon.js') }}"></script>
    <script src="{{ asset('admin/js/sec2.js') }}"></script>
    <script src="{{ asset('admin/js/sec3.js') }}"></script>
    <script src="{{ asset('admin/js/sec4.js') }}"></script>
</body>

</html>