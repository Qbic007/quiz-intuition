async function initialize() {
    const matches = {
        "Создатель данного квиза": "Сергей",
        "Увлекается живописью и рисует пейзажи": "Александр",
        "Проводит лекции по физике в университете": "Ирина",
        "Любит готовить различные блюда и экспериментировать на кухне": "Мария",
        "Играет на пианино и участвует в конкурсах": "Анна",
        "Занимается спортом и ведет активный образ жизни": "Дмитрий",
        "Пишет стихи и участвует в литературных конкурсах": "Елена",
        "Работает в IT и разрабатывает приложения": "Олег",
        "Путешествует по миру и изучает новые культуры": "Наталья",
        "Собирает коллекции старинных монет и занимается нумизматикой": "Виктор"
    };
    
    // Arrays for names and professions
    const names = Object.keys(matches).sort((a, b) => 0.5 - Math.random());
    const professions = Object.values(matches).sort((a, b) => 0.5 - Math.random());

    const namesColumn = document.getElementById('namesColumn');
    const professionsColumn = document.getElementById('professionsColumn');

    // Function to create option elements
    function createOptions(column, options, isProfession = false) {
        options.forEach(option => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = option;
            if (isProfession) {
                div.setAttribute('data-profession', option);
                div.classList.add('disabled');
                div.classList.add('name');
            } else {
                div.classList.add('left');
            }
            column.appendChild(div);
        });
    }

    // Create options for names and professions
    createOptions(namesColumn, names);
    createOptions(professionsColumn, professions, true);

    let selectedName = null;

    namesColumn.addEventListener('click', function (e) {
        if (e.target.classList.contains('option')) {
            // Set selected name and highlight
            if (selectedName) {
                selectedName.classList.remove('selected');
            }
            selectedName = e.target;
            selectedName.classList.add('selected');

            // Disable other names
            Array.from(namesColumn.getElementsByClassName('option')).forEach(option => {
                if (option !== selectedName) {
                    option.classList.add('disabled');
                }
            });

            // Enable professions
            Array.from(professionsColumn.getElementsByClassName('option')).forEach(option => {
                option.classList.remove('disabled');
            });
        }
    });

    professionsColumn.addEventListener('click', function (e) {
        if (e.target.classList.contains('option')) {
            // Highlight selected profession
            e.target.classList.add('selected');

            // Check for correctness
            const correctProfession = matches[selectedName.textContent];
            const chosenProfession = e.target.getAttribute('data-profession');
            const isMatch = correctProfession === chosenProfession;

            if (isMatch) {
                selectedName.classList.add('correct');
                e.target.classList.add('correct');
                
                // Анимированно перемещаем элементы наверх
                moveToTop(selectedName, namesColumn);
                moveToTop(e.target, professionsColumn);
                
                // Отключаем профессии сразу для правильного ответа
                Array.from(professionsColumn.getElementsByClassName('option')).forEach(option => {
                    option.classList.add('disabled');
                });
                
                // Сбрасываем выделение
                selectedName = null;
                
                // Включаем все неправильные варианты обратно
                Array.from(namesColumn.getElementsByClassName('option')).forEach(option => {
                    if (!option.classList.contains('correct')) {
                        option.classList.remove('disabled');
                    }
                });
            } else {
                // При неправильном совпадении добавляем класс 'incorrect'
                selectedName.classList.add('incorrect');
                e.target.classList.add('incorrect');
                
                // Убираем класс 'incorrect' через полсекунды и возвращаем исходное состояние
                setTimeout(() => {
                    selectedName.classList.remove('incorrect', 'selected');
                    e.target.classList.remove('incorrect', 'selected');
                    
                    // Отключаем профессии после анимации
                    Array.from(professionsColumn.getElementsByClassName('option')).forEach(option => {
                        option.classList.add('disabled');
                    });
                    
                    // Сбрасываем выделение
                    selectedName = null;
                    
                    // Включаем все неправильные варианты обратно
                    Array.from(namesColumn.getElementsByClassName('option')).forEach(option => {
                        if (!option.classList.contains('correct')) {
                            option.classList.remove('disabled');
                        }
                    });
                }, 500);
            }
        }
    });

    function moveToTop(element, column) {
        // Получаем все карточки в колонке
        const cards = Array.from(column.getElementsByClassName('option'));
        const cardHeight = element.offsetHeight + 10; // Высота карточки + margin
        
        // Находим индекс текущей карточки
        const currentIndex = cards.indexOf(element);
        
        // Добавляем класс для анимации всем карточкам выше текущей
        cards.forEach((card, index) => {
            if (index < currentIndex) {
                // Карточки выше выбранной сдвигаем вниз на одну позицию
                card.style.transform = `translateY(${cardHeight}px)`;
            }
        });
        
        // Форсируем reflow для начала анимации
        element.offsetHeight;
        
        // Перемещаем выбранную карточку наверх
        element.style.transform = `translateY(${-currentIndex * cardHeight}px)`;
        
        // После завершения анимации восстанавливаем порядок в DOM
        setTimeout(() => {
            // Перемещаем элемент в начало без анимации
            element.style.transition = 'none';
            cards.forEach(card => {
                if (card !== element) {
                    card.style.transition = 'none';
                }
            });
            
            // Форсируем reflow
            element.offsetHeight;
            
            // Сбрасываем трансформации и перемещаем элемент
            element.style.transform = '';
            cards.forEach(card => {
                if (card !== element) {
                    card.style.transform = '';
                }
            });
            column.insertBefore(element, column.firstChild);
            
            // Восстанавливаем анимацию
            requestAnimationFrame(() => {
                element.style.transition = '';
                cards.forEach(card => {
                    if (card !== element) {
                        card.style.transition = '';
                    }
                });
            });
        }, 1000);
    }
}

// Initialize the quiz
initialize();