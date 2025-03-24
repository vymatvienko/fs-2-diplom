@extends('layouts.client.base')

@section('content')
<main>
    @foreach ($movies as $movie)
    <section class="movie">
        <div class="movie__info">
            <div class="movie__poster">
                <img class="movie__poster-image"
                    src="{{ $movie->poster ? $movie->poster : asset('client/i/poster2.jpg') }}"
                    alt="{{ $movie->title }}">
            </div>
            <div class="movie__description">
                <h2 class="movie__title">{{ $movie->title }}</h2>
                <p class="movie__synopsis">{{ $movie->description }}</p>
                <p class="movie__data">
                    <span class="movie__data-duration">{{ $movie->duration }} минут</span>
                    <span class="movie__data-origin">{{ $movie->country }}</span>
                </p>
            </div>
        </div>

        @if($movie->seances->isNotEmpty())
        <!-- Проверяем, есть ли сеансы -->
        @foreach ($movie->seances->groupBy('hall_id') as $hallId => $seances)
        <div class="movie-seances__hall">
            <h3 class="movie-seances__hall-title">Зал {{ $seances->first()->hall->name }}</h3>
            <ul class="movie-seances__list">
                @foreach ($seances as $seance)
                <li class="movie-seances__time-block">
                    <a class="movie-seances__time" href="{{ route('booking', ['seance' => $seance->id]) }}">
                        {{ \Carbon\Carbon::parse($seance->start_time)->format('H:i') }}
                    </a>
                </li>
                @endforeach
            </ul>
        </div>
        @endforeach
        @endif

    </section>
    @endforeach
</main>
@endsection