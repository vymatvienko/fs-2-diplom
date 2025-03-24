@extends('layouts.client.base')

@section('content')
<main>
    <section class="buying">
        <div class="buying__info">
            <div class="buying__info-description">
                <h2 id="info-title" class="buying__info-title">{{ $seance->movie->title }}</h2>
                <p id="info-start" class="buying__info-start">Начало сеанса:
                    {{ \Carbon\Carbon::parse($seance->start_time)->format('d.m.Y H:i') }}</p>
                <p id="info-hall" class="buying__info-hall">Зал {{ $seance->hall->name }}</p>
                <p class="buying__info-price" id="total-price">Итоговая цена: 0 руб.</p>
            </div>
        </div>
        <div class="buying-scheme">
            <div id="hall-layout"></div>
        </div>
        <button id="book-tickets" class="acceptin-button">Забронировать</button>
    </section>
    <script src="{{ asset('client/js/book.js') }}"></script>
    <input type="hidden" id="info-seance-id" value="{{ $seance->id }}">
</main>
@endsection