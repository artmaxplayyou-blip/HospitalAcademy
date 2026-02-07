document.getElementById('weeklyReportForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Сбор данных
    const data = {
        member: document.getElementById('member').value.trim(),
        dependencyScreenshots: document.getElementById('dependencyScreenshots').value
            .trim().split('\n').filter(link => link.trim() !== ''),
        mpGmpScreenshots: document.getElementById('mpGmpScreenshots').value
            .trim().split('\n').filter(link => link.trim() !== ''),
        armyRecruitmentScreenshots: document.getElementById('armyRecruitmentScreenshots').value
            .trim().split('\n').filter(link => link.trim() !== ''),
        resuscitationScreenshots: document.getElementById('resuscitationScreenshots').value
            .trim().split('\n').filter(link => link.trim() !== ''),
        hallPostScreenshots: document.getElementById('hallPostScreenshots').value
            .trim().split('\n').filter(link => link.trim() !== '')
    };

    if (!data.member) {
        alert('Укажите имя и CID участника!');
        return;
    }

    // Формирование Embed
    const embed = {
        title: 'Еженедельный отчёт отдела Hospital Academy',
        color: 0x999999,
        fields: [
            { name: 'Имя и Фамилия | CID', value: data.member, inline: false },
            {
                name: 'Зависимость (Скриншоты помощи)',
                value: data.dependencyScreenshots.length
                    ? data.dependencyScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Участие в МП/ГМП (начало и конец)',
                value: data.mpGmpScreenshots.length
                    ? data.mpGmpScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Участие в наборе Армии (начало и конец)',
                value: data.armyRecruitmentScreenshots.length
                    ? data.armyRecruitmentScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Реанимация людей/госслужащих',
                value: data.resuscitationScreenshots.length
                    ? data.resuscitationScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            },
            {
                name: 'Пост в Холле 1 час+ (скриншоты каждые 20 минут)',
                value: data.hallPostScreenshots.length
                    ? data.hallPostScreenshots.join('\n')
                    : 'Нет данных',
                inline: false
            }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'Hospital Academy | Еженедельный отчёт' }
    };

    try {
        const response = await fetch('https://discord.com/api/webhooks/1432858037835665639/Q5G6uC6QYZ_wVzMPPliEPAy5BJpcjx0lGTxlupAI8pOVVlYA1oXN2j-zhFlzykpJQQS0', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: '<@&1412079127951048805> <@&1412081593727717438>',
                embeds: [embed]
            })
        });

        if (response.ok) {
            alert('Отчёт успешно отправлен в Discord!');
            document.getElementById('weeklyReportForm').reset();


            // Обновление счётчиков
            if (data.dependencyScreenshots.length && typeof incrementStat === 'function') {
                incrementStat(data.member, 'dependency');
            }
            if (data.mpGmpScreenshots.length && typeof incrementStat === 'function') {
                incrementStat(data.member, 'mpGmp');
            }
            if (data.armyRecruitmentScreenshots.length && typeof incrementStat === 'function') {
                incrementStat(data.member, 'armyRecruitment');
            }
            if (data.resuscitationScreenshots.length && typeof incrementStat === 'function') {
                incrementStat(data.member, 'resuscitation');
            }
            if (data.hallPostScreenshots.length && typeof incrementStat === 'function') {
                incrementStat(data.member, 'hallPost');
            }
        } else {
            const errorText = await response.text();
            console.error('Ошибка отправки:', errorText);
            alert('Ошибка отправки отчёта. Проверьте URL вебхука.');
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
        alert('Не удалось отправить отчёт. Проверьте подключение к интернету.');
    }
});
