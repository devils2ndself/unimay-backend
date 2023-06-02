# Unimay Media

This project is the backend (REST API) for the Unimay Media website.

## Setting up SQL database

The server requires an SQL database for operating.

Make sure you have a `.env` file in the project root directotry with MySQL database information:

```
DB_DATABASE=database
DB_HOST=host
DB_USER=user
DB_PASSWORD=password
```

If the SQL database in use is not MySQL, make sure to add the following line:

```
DB_DIALECT=postgres
```

`postgres` is an example out of these possible dialects: `mysql`, `postgres`, `sqlite`, `db2`, `mariadb`, `mssql`.

Before running the server, make sure that `database` (or schema) from `.env` exists in the database.

The server will automatically create tables on first run.

## Downloading NPM packages

Regular option:

```
npm install
```

Production mode:

```
npm install --omit=dev
```

## Running the server

To run the development mode, run the following:

```
npm run dev
```

To run server in production mode, run the following:

```
npm start
```

## Response

### Structure

-   Success

    ```
    {
        "status": "ok",
        "message": "{{ optional, usually on status 201 }}",
        "data": {{ null / object / array }}
    }
    ```

-   Error

    ```
    {
        "status": "error",
        "error": {
            "code": {{ HTTP status code }},
            "message": "{{ meaningful error message }}"
        }
    }
    ```

### Endpoints

-   Titles

    -   GET - All: `/api/titles`
    -   GET - By Id: `/api/titles/:id`
    -   GET - Image by Id: `/api/titles/:id/image`
    -   POST: `/api/titles`
    -   DELETE: `/api/titles/:id`
    -   PUT: `/api/titles/:id`

-   Players

    -   GET - All: `/api/players`
    -   POST - By title and Id: `/api/titles/:titleId/players/:id`
    -   PUT - By title and Id: `/api/titles/:titleId/players/:id`
    -   DELETE - Title is not needed: `/api/players/:id`

    _Note_: `embedLink` refers to the `src` attribute of `iframe`

-   Genres

    -   GET - All: `/api/genres`
    -   POST: `/api/genres`
    -   PUT: `/api/genres/:id`
    -   DELETE: `/api/genres/:id`

## Request structure

Requests should be of type `multipart/form-data` (or JavaScript's `FormData`).

Field names for the schema can be found in the Database Design section below.

# System Design (in Ukrainian)

## Опис проєкту

Сайт виступає візиткою команди Unimay Media, яка дає можливість ознайомитись з проєктами команди, її членами, та знайти інформацію з приводу партнерства/фідбеку.

## Функціональні вимоги - що система робить

-   Вебсайт мусить мати секцію з проєктами команди
    -   Інформація та медіа проєктів додаються/оновлюються/видаляються модераторами
    -   Система має підтримувати пошук проєктів за назвою та навігацію по проєктах за жанром/типом
    -   Кожен проєкт мусить мати медіа-плеєр у форматі HTML, який буде вставлено безпосередньо у сторінку під час генерації, та графічне зображення
-   Вебсайт повинен мати секцію з інформацією про команду та її учасників
    -   Записи про учасників команди мусять мати графічне зображення та опцію редагування, додавання та видалення інформації
    -   Контактна інформація команди мусить мати опцію редаугвання, наряду з посиланнями та описом
-   На вебсайті має бути секція "Послуги" з інформацією про комерційну діяльність або партнерство
    -   Опис/ціна послуг можуть бути змінені модератором
-   Система мусить мати Систему Керування Контентом, можливість користування якою є тільки у авторизованих користувачів

## Нефункціональні вимоги - якою повинна бути система

-   Проєкт має бути у форматі вебсайту, доступного, як з ПК, так і з мобільного пристрою
-   Контент і написи вебсайту повинні бути українською мовою
-   Усі відео та аудіо-матеріали показані на сайті мають бути взяті з ресурсів у інтернеті у відкритому доступі
-   Сумарний обсяг бази даних не повинен перевищувати 1.8 гігабайтів.

## Масштаб проєкту

Вебсайт служить місцем для знаходження медіа у озвучці команди та інформації про команду.

-   Відвідувачі зможуть дивитися медіа у озвучці команди на сайті
-   Потенційні партнери/клієнти зможуть знайти усю інформацію про послуги та контактні дані команди

Масштаб проєкту не включає в себе функціонал для перемов або безпосередньої купівлі/продажу послуг, але надає контактні дані для з'єднання з командою.

Команда повинна буде регулювати контент вручну, і тільки вона відповідальна за те, що тільки необхідний контент поститься на вебсайті.

## Потенційні проблеми та ризики

-   Можливість реєстрації/логіну для звийчайних користувачів?
-   Обмеженність медіа-контенту плеєрами з підтримкою вставлення як `<iframe>`
-   Збереження графічних зображень для тайтлів та фотографій учасників - де і як?

## Технології які будуть використані

-   Technologies
    -   Front-end: React on Vite
    -   Back-end: Express.js
    -   DB: MySQL
-   Hosting
    -   Front-end: TBD (plan: [ukraine.com.ua](https://www.ukraine.com.ua/uk/))
    -   Back-end: AWS EC2 - t3.nano/t3.micro
    -   DB: front-end hosting

## Бюджет (у USD)

_2022/04/13_  
1 USD ($) ~ 37 UAH (₴)

-   Front-end + MySQL: ₴2100/year ~ $56/year
-   Domain: ₴600-1000 ~ $15-25
-   Back-end - AWS EC2: ~$35/year

Усього: ~$100-120/year

## Дизайн бази даних

![image](https://github.com/devils2ndself/unimay-backend/assets/71770433/d1535f25-7f0e-4d1e-ae36-e34ab7836e3f)

## [Архітектура](https://lucid.app/lucidchart/a0421e16-3de9-40a8-bfce-df7b7dd06143/edit?viewport_loc=-128%2C6%2C2016%2C968%2C0_0&invitationId=inv_03b17de1-7521-4256-883e-050b2b2b2d2a)

![image](https://github.com/devils2ndself/unimay-backend/assets/71770433/c485a921-0e1b-41d7-b9fe-6b14593b1777)
