// Пароль для доступа
const CORRECT_PASSWORD = 'HAMA707';

// Проверяем пароль
function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    if (password === CORRECT_PASSWORD) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('tableSection').style.display = 'block';
        updateTable(); // Обновляем таблицу сразу после входа
    } else {
        alert('Неверный пароль!');
    }
}

// Объект для хранения статистики
const staffStats = {
    'Alexei Chernov | CJE4': {
        recruitment: 0,
        exam: 0,
        dependency: 0,
        mpGmp: 0,
        armyRecruitment: 0,
        resuscitation: 0,
        hallPost: 0
    },
    'Dany Tsoi | 94XQ': {
        recruitment: 0,
        exam: 0,
        dependency: 0,
        mpGmp: 0,
        armyRecruitment: 0,
        resuscitation: 0,
        hallPost: 0
    },
    'Maksim Hartford | CQ18': {
        recruitment: 0,
        exam: 0,
        dependency: 0,
        mpGmp: 0,
        armyRecruitment: 0,
        resuscitation: 0,
        hallPost: 0
    },
    'Bax Bonart | 8BJ4': {
        recruitment: 0,
        exam: 0,
        dependency: 0,
        mpGmp: 0,
        armyRecruitment: 0,
        resuscitation: 0,
        hallPost: 0
    }
};

// Обновляем таблицу
function updateTable() {
    const tableBody = document.querySelector('#staffTable tbody');
    if (!tableBody) {
        console.error('Таблица не найдена!');
        return;
    }

    tableBody.innerHTML = ''; // Очищаем содержимое

    Object.keys(staffStats).forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member}</td>
            <td>${staffStats[member].recruitment}</td>
            <td>${staffStats[member].exam}</td>
            <td>${staffStats[member].dependency}</td>
            <td>${staffStats[member].mpGmp}</td>
            <td>${staffStats[member].armyRecruitment}</td>
            <td>${staffStats[member].resuscitation}</td>
            <td>${staffStats[member].hallPost}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Очищаем отчёты и отправляем в Discord
function clearReports() {
    let message = '**Архив отчётов Hith Staff HA**\n\n';
    
    Object.keys(staffStats).forEach(member => {
        message += `**${member}**\n`;
        message += `- Отчёт о наборе: ${staffStats[member].recruitment}\n`;
        message += `- Отчёт об экзамене: ${staffStats[member].exam}\n`;
        message += `- Вылечено зависимостей: ${staffStats[member].dependency}\n`;
        message += `- Участие в МП/ГМП: ${staffStats[member].mpGmp}\n`;
        message += `- Участие в наборе Армии: ${staffStats[member].armyRecruitment}\n`;
        message += `- Реанимация: ${staffStats[member].resuscitation}\n`;
        message += `- Пост в Холле: ${staffStats[member].hallPost}\n\n`;
    });

    fetch('https://discord.com/api/webhooks/ВАШ_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
    })
    .then(response => {
        if (response.ok) {
            alert('Архив отправлен в Discord! Таблица очищена.');
            Object.keys(staffStats).forEach(member => {
                Object.keys(staffStats[member]).forEach(key => {
                    staffStats[member][key] = 0;
                });
            });
            updateTable();
        } else {
            alert('Ошибка отправки в Discord. Проверьте URL вебхука.');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка сети. Проверьте подключение.');
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateTable();
});

// Функция увеличения счётчика
function incrementStat(member, reportType) {
    if (staffStats[member] && staffStats[member][reportType] !== undefined) {
        staffStats[member][reportType]++;
        console.log(`Счётчик обновлён: ${member}, ${reportType} = ${staffStats[member][reportType]}`);
        updateTable();
    } else {
        console.warn(`Не найден участник или тип отчёта: ${member}, ${reportType}`);
    }
}
