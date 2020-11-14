RESTful API - Notes

1. Заполнить .env файл в /note

2. Запустить командой "docker-compose up"

4. Зарегистрировать пользователя, получить JWT (
    При запросе к notes необходимо вложить JWT в Header->Authorization->"Bearer JWT".
    - http://localhost:8080/auth/auth0/login (auth0)
    - http://localhost:8080/auth/register (jwt)
    - Поля {
        - email: string
        - name: string
        - password: string
    }

5. Создать note
    - http://localhost:3000/note/ (POST)
    - Поля {
        - content: string (max length 1000)
    }

6. Изменить note по id
    - http://localhost:3000/note/:id (PUT)
    - Поля {
        - content: string (max length 1000)
    }

7. Найти note по id
    - http://localhost:3000/note/:id (GET)
    
8. Найти все купоны 
    - http://localhost:3000/note/ (GET)

9. Создать (Активировать) общую ссылку на note
    - http://localhost:3000/note/shared (POST)
        - Поля {
        - noteId: number
    }
9. Дизактивировать общую ссылку на note
    - http://localhost:3000/note/shared/disabled (PUT)
        - Поля {
        - noteId: number
    }
10. Общая ссылка на note
    - http://localhost:3000/note/shared/:id (GET)