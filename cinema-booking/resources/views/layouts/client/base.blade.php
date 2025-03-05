<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ИдёмВКино</title>
    <link rel="stylesheet" href="{{ asset('client/css/normalize.css') }}">
    <link rel="stylesheet" href="{{ asset('client/css/styles.css') }}">
    <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&amp;subset=cyrillic,cyrillic-ext,latin-ext"
        rel="stylesheet">
</head>

<body>
    <header class="page-header">
        <h1 class="page-header__title">Идём<span>в</span>кино</h1>
    </header>

    <nav class="page-nav">
        @foreach ($dates as $date)
        <a class="page-nav__day {{ $date->is_today ? 'page-nav__day_today' : '' }} {{ $date->is_selected ? 'page-nav__day_chosen' : '' }}"
            href="{{ route('index', ['date' => $date->formatted]) }}">
            <span class="page-nav__day-week">{{ $date->day_name }}</span>
            <span class="page-nav__day-number">{{ $date->day_number }}</span>
        </a>
        @endforeach
    </nav>



    @yield('content')

    <script src="{{ asset('client/js/scripts.js') }}"></script>
</body>

</html>