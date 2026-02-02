document.getElementById('weeklyReportForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Собираем данные формы
    const data = {
        fullName: document.getElementById('fullName').value.trim(),
        cid: document.getElementById('cid').value.trim(),
        dependencyScreenshots: document.getElementById('dependencyScreenshots').value
            .trim()
            .split('\n')
            .filter(link => link.trim() !== ''),
        mpGmpScreenshots: document.getElementById('mpGmpScreenshots').value
            .trim()
            .split('\n')
            .filter(link => link.trim() !== ''),
        armyRecruitmentScreenshots: document.getElementById('armyRecruitmentScreenshots').value
            .trim()
            .split('\n')
            .filter(link => link.trim() !== ''),
        resuscitationScreenshots: document.getElementById('resuscitationScreenshots').value
            .trim()
            .split('\n')
            .filter(link => link.trim() !== ''),
        hallPostScreenshots: document.getElementById('hallPostScreenshots').value
            .trim()
            .split('\n')
            .filter(link => link.trim() !== '')
    };

    // Формируем Embed для Discord
    const embed = {
        title: 'Еженедельный отчёт отдела Hospital Academy',
        color: 0x999999, // Светло‑серая линия слева (HEX-код)
        fields: [
            {
                name: 'Имя и Фамилия | CID',
                value: `${data.fullName} | ${data.cid}`,
                inline: false
            },
            {
                name: 'Зависимость (Скриншоты помощи)',
                value: data.dependencyScreenshots.length > 0
                    ? data.dependencyScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Участие в МП/ГМП (начало и конец)',
                value: data.mpGmpScreenshots.length > 0
                    ? data.mpGmpScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Участие в наборе Армии (начало и конец)',
                value: data.armyRecruitmentScreenshots.length > 0
                    ? data.armyRecruitmentScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Реанимация людей/госслужащих',
                value: data.resuscitationScreenshots.length > 0
                    ? data.resuscitationScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Пост в Холле 1 час+ (скриншоты каждые 20 мин)',
                value: data.hallPostScreenshots.length > 0
                    ? data.hallPostScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            }
        ],
        timestamp: new Date().toISOString(), // Время отправки отчёта
        footer: {
            text: 'Hospital Academy | Еженедельный отчёт'
        }
    };

    // Отправляем в Discord через вебхук
    try {
        const response = await fetch('https://discord.com/api/webhooks/1432858037835665639/Q5G6uC6QYZ_wVzMPPliEPAy5BJpcjx0lGTxlupAI8pOVVlYA1oXN2j-zhFlzykpJQQS0', { // Замените на реальный URL вебхука
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (response.ok) {
            alert('Отчёт успешно отправлен в Discord!');
            document.getElementById('weeklyReportForm').reset(); // Очищаем форму
        } else {
            const errorText = await response.text();
            console.error('Ошибка отправки:', errorText);
            alert('Ошибка отправки отчёта. Проверьте URL вебхука.');
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        alert('Не удалось отправить отчёт. Проверьте подключение к интернету.');
    }
});
