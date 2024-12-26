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

            // Blink both elements
            if (isMatch) {
                blinkElement(selectedName, 'correct');
                blinkElement(e.target, 'correct');
            } else {
                blinkElement(selectedName, 'incorrect', true);
                blinkElement(e.target, 'incorrect', true);
            }

            // After the blinking, handle match results
            setTimeout(() => {
                // Disable professions
                Array.from(professionsColumn.getElementsByClassName('option')).forEach(option => {
                    option.classList.add('disabled');
                });
              
                if (isMatch) {
                    // Move to the top and set as correct
                    selectedName.classList.add('correct');
                    e.target.classList.add('correct');
                    moveToTop(selectedName, namesColumn);
                    moveToTop(e.target, professionsColumn);
                } else {
                    // Reset colors for incorrect match
                    selectedName.classList.remove('selected');
                    e.target.classList.remove('selected');
                }

                // Reset selections
                selectedName = null;

                // Re-enable all options
                Array.from(namesColumn.getElementsByClassName('option')).forEach(option => {
                    if (!option.classList.contains('correct')) {
                        option.classList.remove('disabled');
                    }
                });
            }, 1000); // Wait for 1 second for the blinking effect
        }
    });

    function blinkElement(element, state, isIncorrect = false) {
        const blinkDuration = isIncorrect ? 1000 : 1000; // Blink duration for incorrect
        const blinkInterval = isIncorrect ? 300 : 1000; // Frequency for incorrect blinking

        element.classList.add(state);

        const blink = setInterval(() => {
            if (element.classList.contains(state)) {
                element.classList.remove(state);
            } else {
                element.classList.add(state);
            }
        }, blinkInterval);

        setTimeout(() => {
            clearInterval(blink);
            element.classList.remove(state);
        }, blinkDuration);
    }

    function moveToTop(element, column) {
        column.insertBefore(element, column.firstChild);
    }
}

// Initialize the quiz
initialize();