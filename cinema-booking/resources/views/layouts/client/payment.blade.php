<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Оплата билетов</title>
    <link rel="stylesheet" href="{{ asset('client/css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('client/css/styles.css') }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&subset=cyrillic,cyrillic-ext,latin-ext" rel="stylesheet">
</head>
<body>
    <header class="page-header">
        <h1 class="page-header__title">Идём<span>в</span>кино</h1>
    </header>
    <main>
        <section class="ticket">
            <header class="ticket__check">
                <h2 class="ticket__check-title">Вы выбрали билеты:</h2>
            </header>
            <div class="ticket__info-wrapper">
                <p class="ticket__info">На фильм: <span class="ticket__details ticket__title">{{ $seance->movie->title }}</span></p>
                <p class="ticket__info">В зале: <span class="ticket__details ticket__hall">{{ $seance->hall->name }}</span></p>
                <p class="ticket__info">Начало сеанса: <span class="ticket__details ticket__start">{{ \Carbon\Carbon::parse($seance->start_time)->format('d.m.Y H:i') }}</span></p>
                <!-- Если нужны дополнительные данные, их можно вывести здесь -->
                <button id="pay-button" class="acceptin-button">Получить код бронирования</button>
                <div id="qr-code" style="display: none;"></div>
                
                <p class="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту.
                    Покажите QR-код нашему контроллеру у входа в зал.</p>
                <p class="ticket__hint">Приятного просмотра!</p>
            </div>
        </section>
    </main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const seanceId = {{ $seance->id }}; // Здесь мы передаем id сеанса
            const payButton = document.getElementById("pay-button");

            if (payButton) {
                payButton.addEventListener("click", function() {
                    const qrCodeContainer = document.getElementById("qr-code");
                    // Кодируем данные в URL или используем ссылку
                    const qrData = `https://example.com/seance/${seanceId}`;
                    qrCodeContainer.innerHTML = "";
                    new QRCode(qrCodeContainer, {
                        text: qrData,
                        width: 128,
                        height: 128
                    });
                    payButton.style.display = "none";
                    qrCodeContainer.style.display = "block";
                });
            }
        });

    </script>

</body>
</html>
