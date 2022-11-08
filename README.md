# Проект Movies-explorer-api
---
Дипломный проект (серверная часть)

## О проекте

Проект Movies-explorer это сайт с регистрацией и авторизацией пользователей для поиска фильмов и сохранения их в избранном. В этом репозитории реализован API проекта.

## Роуты для пользователей:

- GET /users/me — возвращает информацию о пользователе;
- PATCH /users/me — обновляет информацию о пользователе.

## Роуты для фильмов:
- GET /movies — возвращает все фильмы из BeatFilms;
- POST /movies — создаёт фильм с переданными в теле запроса country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU и nameEN;
- DELETE /movies/:movieId — удаляет фильм по _id.

## Технологии
+ JavaScript:
  + Промисы (Promise)
  + Асинхронность и оптимизация
  + Rest API
+ Node.js
+ Express
+ MongoDB
+ Сelebrate
+ Winston

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и фильма   
`/models` — папка с файлами описания схем пользователя и фильма  
`/errors` – папка с описанием ошибок.

## Инструкция по установке
Клонировать репозиторий
``` 
git clone https://github.com/anna-baranova/movies-explorer-api.git
```

Перейти в папку проекта
```
cd movies-explorer-api
```

Установить зависимости
```
npm install
```

Запустить сервер  
```
npm run start
```

Запустить сервер с hot-reload
```
npm run dev
```

## Адрес домена сервера

`https://api.movie-search.nomoredomains.work/`
