document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand(); // Расширяем апку на весь экран

    // --- НАЧАЛЬНЫЕ ДАННЫЕ (ДЛЯ СИМУЛЯЦИИ) ---
    // В реальном приложении эти данные будут приходить с бэкенда
    const state = {
        balance: 0.0,
        referrals: 0,
        hasCompletedSubTask: false
    };

    // --- ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ DOM ---
    const views = document.querySelectorAll('.view');
    const mainMenu = document.getElementById('main-menu');
    
    // Элементы для отображения данных
    const mainBalance = document.getElementById('main-balance');
    const profileUsername = document.getElementById('profile-username');
    const profileId = document.getElementById('profile-id');
    const referralsCount = document.getElementById('referrals-count');
    const getGoldBalance = document.getElementById('get-gold-balance');
    const refLinkInput = document.getElementById('ref-link');
    const withdrawStatus = document.getElementById('withdraw-status');
    const taskStatus = document.getElementById('task-status');

    // Кнопки
    const profileBtn = document.getElementById('profile-btn');
    const getGoldBtn = document.getElementById('get-gold-btn');
    const withdrawBtn = document.getElementById('withdraw-btn');
    const tasksBtn = document.getElementById('tasks-btn');
    const backButtons = document.querySelectorAll('.back-button');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const checkSubBtn = document.getElementById('check-sub-btn');

    // --- ФУНКЦИИ ---

    // Функция для переключения экранов
    function showView(viewId) {
        views.forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    }

    // Функция для обновления всех балансов на экране
    function updateAllBalances() {
        const fixedBalance = state.balance.toFixed(1);
        mainBalance.textContent = fixedBalance;
        getGoldBalance.textContent = fixedBalance;
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

    // Кнопка "Профиль"
    profileBtn.addEventListener('click', () => {
        // Берем данные пользователя из Telegram
        const user = tg.initDataUnsafe.user;
        if (user) {
            profileUsername.textContent = user.username ? `@${user.username}` : user.first_name;
            profileId.textContent = user.id;
        }
        showView('profile-view');
    });

    // Кнопка "Получить голду"
    getGoldBtn.addEventListener('click', () => {
        referralsCount.textContent = state.referrals;
        // Генерируем реферальную ссылку
        const botUsername = "YOUR_BOT_NAME_HERE"; // !!! ЗАМЕНИТЕ НА ЮЗЕРНЕЙМ ВАШЕГО БОТА
        const userId = tg.initDataUnsafe.user.id;
        refLinkInput.value = `https://t.me/${botUsername}?start=${userId}`;
        showView('get-gold-view');
    });

    // Кнопка "Вывести голду"
    withdrawBtn.addEventListener('click', () => {
        if (state.balance < 100) {
            withdrawStatus.textContent = '❌ Ваш баланс должен быть минимум 100 GOLD для вывода.';
            withdrawStatus.style.color = 'var(--red-color)';
        } else {
            withdrawStatus.textContent = '✅ Ваш баланс позволяет совершить вывод. Форма вывода появится здесь.';
            withdrawStatus.style.color = 'var(--green-color)';
            // Здесь будет логика для формы вывода
        }
        showView('withdraw-view');
    });
    
    // Кнопка "Задания"
    tasksBtn.addEventListener('click', () => {
        showView('tasks-view');
    });

    // Кнопка "Проверить подписку" (СИМУЛЯЦИЯ)
    checkSubBtn.addEventListener('click', () => {
        if (state.hasCompletedSubTask) {
            taskStatus.textContent = "Вы уже выполнили это задание.";
            taskStatus.style.color = "var(--text-color)";
            return;
        }

        taskStatus.textContent = "Проверяем подписку...";
        taskStatus.style.color = "var(--accent-color)";
        
        // Симуляция запроса на бэкенд
        setTimeout(() => {
            // В реальном приложении здесь будет ответ от сервера
            const isSubscribed = true; // Предположим, что сервер ответил "да"
            
            if (isSubscribed) {
                state.balance += 5.0;
                state.hasCompletedSubTask = true;
                updateAllBalances();
                taskStatus.textContent = "✅ Подписка подтверждена! Начислено 5.0 GOLD.";
                taskStatus.style.color = "var(--green-color)";
                checkSubBtn.style.display = 'none'; // Прячем кнопку после выполнения
            } else {
                taskStatus.textContent = "❌ Подписка не найдена. Попробуйте снова.";
                taskStatus.style.color = "var(--red-color)";
            }
        }, 2000); // Задержка в 2 секунды для имитации проверки
    });

    // Кнопка "Копировать ссылку"
    copyLinkBtn.addEventListener('click', () => {
        refLinkInput.select();
        document.execCommand('copy');
        tg.showAlert('Ссылка скопирована!');
    });

    // Обработка всех кнопок "Назад"
    backButtons.forEach(button => {
        button.addEventListener('click', () => showView('main-menu'));
    });
    
    // --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАПУСКЕ ---
    updateAllBalances();
});