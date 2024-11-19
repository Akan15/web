// Скрипт для открытия модального окна по клику на значок аккаунта
document.getElementById('account-icon').addEventListener('click', function() {
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

// Функция для входа
function validateLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginError = document.getElementById('loginError');
    let isValid = true;

    // Сброс сообщений об ошибках
    loginError.textContent = "";

    // Проверка на пустые поля
    if (!username) {
        loginError.textContent = "Username is required.";
        isValid = false;
    } else if (!password) {
        loginError.textContent = "Password is required.";
        isValid = false;
    } else {
        const users = JSON.parse(localStorage.getItem('users')) || {
            "admin": "admin123",
            "user": "user123",
            "guest": "guest123"
        };

        if (!users[username]) {
            loginError.textContent = "Username not found. Please register.";
            isValid = false;
        } else if (users[username] !== password) {
            loginError.textContent = "Invalid password.";
            isValid = false;
        }
    }

    if (isValid) {
        alert(`Welcome, ${username}!`);
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        loginModal.hide();

        // Сохранить текущего пользователя в localStorage
        localStorage.setItem('currentUser', username);

        // Поменять кнопку Login на Logout
        toggleLoginLogout(true);
    }

    return isValid;
}

// Функция для регистрации нового пользователя
function registerNewUser() {
    const username = prompt("Enter a new username:");
    const password = prompt("Enter a new password:");

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[username]) {
            alert("User already exists. Please choose a different username.");
            return;
        }

        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert(`User ${username} registered successfully!`);
    } else {
        alert("Registration canceled or invalid input.");
    }
}

// Функция для выхода из аккаунта
function logoutUser() {
    // Удалить текущего пользователя из localStorage
    localStorage.removeItem('currentUser');

    // Очистить поля ввода имени пользователя и пароля
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    // Поменять кнопку Logout на Login
    toggleLoginLogout(false);

    // Показать уведомление о выходе
    alert('You have been logged out.');
}

// Функция переключения кнопок Login и Logout
function toggleLoginLogout(isLoggedIn) {
    const loginButton = document.querySelector('#loginForm button[type="submit"]:first-child');
    const logoutButton = document.querySelector('#loginForm button[type="submit"]:last-child');

    if (isLoggedIn) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
}

// Привязка событий к кнопкам
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Проверяем, какая кнопка была нажата
    const submitButton = document.activeElement;
    if (submitButton.textContent === 'Login') {
        validateLogin();
    } else if (submitButton.textContent === 'Logout') {
        logoutUser();
    }
});

// Обработчик для кнопки регистрации
document.getElementById('registerBtn').addEventListener('click', registerNewUser);

// Проверка текущего пользователя при загрузке страницы
window.addEventListener('load', function () {
    const currentUser = localStorage.getItem('currentUser');
    toggleLoginLogout(!!currentUser); // Переключение кнопок в зависимости от статуса пользователя
});




// Функция валидации формы контактов
function validateForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    let isValid = true;

    document.getElementById('nameError').textContent = name ? '' : 'Name is required.';
    document.getElementById('emailError').textContent = email ? '' : 'Email is required.';
    document.getElementById('messageError').textContent = message ? '' : 'Message is required.';

    if (!name || !email || !message) {
        isValid = false;
    }

    return isValid;
}



// Восстанавливаем фильтр при загрузке страницы
window.addEventListener('load', function() {
    const savedFilter = localStorage.getItem('carFilter') || 'all';
    filterCars(savedFilter);
});

// Массив цветов
const colors = ['#DC143C', '#FF8C00', '#FFFFFF', '#006400', '#00008B'];
let currentColorIndex = 0;

// Функция для смены цвета фона
function changeBackgroundColor() {
    document.body.style.backgroundColor = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length; // Цикл цветов
    localStorage.setItem('backgroundColor', colors[currentColorIndex]);
}



// Функция для переключения светлой и тёмной темы
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.modal-content').classList.toggle('dark-mode');
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : '';
    localStorage.setItem('theme', currentTheme);
}

// Устанавливаем цвет и тему при загрузке страницы
window.addEventListener('load', () => {
    const savedColor = localStorage.getItem('backgroundColor');
    const savedTheme = localStorage.getItem('theme');

    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
    }

    if (savedTheme) {
        document.body.classList.add(savedTheme);
        document.querySelector('.modal-content').classList.add(savedTheme);
    }
});

// Привязываем обработчики к кнопкам
document.getElementById('changeColorBtn').addEventListener('click', changeBackgroundColor);
document.getElementById('toggleThemeBtn').addEventListener('click', toggleTheme);





////////////////////////////////////////////////////////////////////
// Filter cars based on category
document.getElementById('categoryFilter').addEventListener('change', function() {
    const category = this.value;
    const cars = document.querySelectorAll('.car-card');
    cars.forEach(car => {
        car.style.display = (category === 'all' || car.getAttribute('data-category') === category) ? 'block' : 'none';
    });
});

// Обработка кликов по звездам для рейтинга
document.querySelectorAll('.rating').forEach(rating => {
    const stars = rating.querySelectorAll('.star');
    const ratingValueDisplay = rating.querySelector('.rating-value');

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const selectedValue = this.getAttribute('data-value');

            // Снимаем выделение со всех звезд
            stars.forEach(star => star.classList.remove('selected'));

            // Выделяем звезды до выбранной включительно
            for (let i = 0; i < selectedValue; i++) {
                stars[i].classList.add('selected');
            }

            // Обновляем числовое значение рейтинга
            ratingValueDisplay.textContent = `${selectedValue}/5`;
        });
    });
});

// Переключение видимости дополнительного контента
document.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', () => {
        const extraContent = button.nextElementSibling;
        if (extraContent.style.display === 'none' || extraContent.style.display === '') {
            extraContent.style.display = 'block';
            button.textContent = 'Скрыть';
        } else {
            extraContent.style.display = 'none';
            button.textContent = 'Подробнее';
        }
    });
});

//подписки

document.getElementById('subscriptionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Получаем значения полей
    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value;
    const cardOwner = document.getElementById('cardOwner').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const subscriptionType = document.getElementById('subscriptionType').value;

    // Валидация: проверяем, что все поля заполнены
    if (!name || !password || !cardOwner || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill out all required fields.');
        return;
    }

    // Валидация: проверка длины пароля
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // Валидация: номер карты должен содержать 16 цифр
    const cardNumberPattern = /^\d{16}$/;
    if (!cardNumberPattern.test(cardNumber)) {
        alert('Please enter a valid 16-digit card number.');
        return;
    }

    // Валидация: CVV должен содержать 3 цифры
    const cvvPattern = /^\d{3}$/;
    if (!cvvPattern.test(cvv)) {
        alert('Please enter a valid 3-digit CVV.');
        return;
    }

    // Валидация: срок действия карты должен быть в формате MM/YY
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDatePattern.test(expiryDate)) {
        alert('Please enter a valid expiry date in MM/YY format.');
        return;
    }

    // Если все проверки пройдены, отображаем сообщение об успешной подписке
    alert(`Thank you for subscribing, ${name}! Your ${subscriptionType} subscription is now active.`);

    // Закрываем модальное окно подписки
    const subscriptionModal = bootstrap.Modal.getInstance(document.getElementById('subscriptionModal'));
    subscriptionModal.hide();
});

// Обновляем цену при изменении типа подписки
document.getElementById('subscriptionType').addEventListener('change', function() {
    const subscriptionType = this.value;
    let price = '';

    switch (subscriptionType) {
        case 'monthly':
            price = '$500';
            break;
        case 'annual':
            price = '$1000';
            break;
        case 'fiveYears':
            price = '$10000';
            break;
    }

    document.getElementById('priceDisplay').value = price;
});

// Устанавливаем цену при загрузке страницы
window.addEventListener('load', () => {
    document.getElementById('subscriptionType').dispatchEvent(new Event('change'));
});

document.getElementById('subscribeButton').addEventListener('click', function() {
    alert('Thank you for subscribing!');
});


// Функция фильтрации по категории и бренду
function filterCars() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const selectedBrand = document.getElementById('brandFilter').value;

    document.querySelectorAll('.car-card').forEach(car => {
        const carCategory = car.getAttribute('data-category');
        const carBrand = car.getAttribute('data-brand');

        // Проверка условий фильтрации
        const categoryMatch = (selectedCategory === 'all' || carCategory === selectedCategory);
        const brandMatch = (selectedBrand === 'all' || carBrand === selectedBrand);

        // Показываем или скрываем карточки, если совпадают оба условия
        car.style.display = (categoryMatch && brandMatch) ? 'block' : 'none';
    });
}

// Привязка функции фильтрации к изменениям в выпадающих списках
document.getElementById('categoryFilter').addEventListener('change', filterCars);
document.getElementById('brandFilter').addEventListener('change', filterCars);







/////////////////////////////////////////////////////////////
// Function to update the current date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const formattedDate = now.toLocaleString('ru-KZ', options);
    document.getElementById('current-date-time').innerText = formattedDate;
}

window.onload = function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Load theme preference from localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        document.body.className = storedTheme;
    }
};

// Display the current time when button is clicked
document.getElementById('showTimeButton').addEventListener('click', function() {
    const currentTime = new Date().toLocaleTimeString();
    document.getElementById('current-time-display').innerText = `Current Time: ${currentTime}`;
});

// Keyboard event to show time on pressing Enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const currentTime = new Date().toLocaleTimeString();
        document.getElementById('current-time-display').innerText = `Current Time: ${currentTime}`;
    }
});

// Accordion functionality
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        const accordionItem = button.parentElement;
        const accordionContent = accordionItem.querySelector('.accordion-content');

        if (accordionItem.classList.contains('active')) {
            accordionContent.style.display = 'none';
            accordionItem.classList.remove('active');
        } else {
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                activeItem.querySelector('.accordion-content').style.display = 'none';
                activeItem.classList.remove('active');
            });
            accordionContent.style.display = 'block';
            accordionItem.classList.add('active');
        }
    });
});