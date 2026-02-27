document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('examForm');

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Собираем данные из полей формы с предварительной проверкой существования элементов
        const examinerInput = document.getElementById('examiner');
        const candidateNameInput = document.getElementById('candidateName');
        const candidateCIDInput = document.getElementById('candidateCID');

        if (!examinerInput || !candidateNameInput || !candidateCIDInput) {
            console.error('Один из элементов формы не найден');
            alert('Произошла ошибка: элементы формы недоступны');
            return;
        }

        const examiner = examinerInput.value.trim();
        const candidateName = candidateNameInput.value.trim();
        const candidateCID = candidateCIDInput.value.trim();

        // Валидация полей
        if (!examiner) {
            alert('Пожалуйста, укажите, кто принимал экзамен (Имя Фамилия | CID)');
            examinerInput.focus();
            return;
        }

        if (!candidateName) {
            alert('Пожалуйста, заполните имя кандидата');
            candidateNameInput.focus();
            return;
        }

        if (!candidateCID) {
            alert('Пожалуйста, заполните CID кандидата');
            candidateCIDInput.focus();
            return;
        }

        // Формируем строку «Имя Фамилия | CID» для кандидата
        const candidate = `${candidateName} | ${candidateCID}`;

        // Собираем выбранные экзамены (чекбоксы)
        const exams = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            exams.push(checkbox.value);
        });

        if (exams.length === 0) {
            alert('Пожалуйста, выберите хотя бы один экзамен');
            return;
        }

        // Получаем результат (радио‑кнопка)
        const result = document.querySelector('input[name="result"]:checked');
        if (!result) {
            alert('Пожалуйста, выберите результат экзамена!');
            return;
        }

        // Экранирование данных для защиты от специальных символов
        function escapeMarkdown(text) {
            return text.replace(/([_*\[\]()~`+=|{}.!-])/g, '\$1');
        }
        const examinerSafe = escapeMarkdown(examiner);
        const candidateSafe = escapeMarkdown(candidate);

        // 2. Формируем Embed для Discord
        const embed = {
            content: '<@&1412079127951048805> <@&1412081593727717438>', // упоминания ролей
            embeds: [
                {
                    title: '📊 ОТЧЁТ ОБ ЭКЗАМЕНЕ — Hospital Academy',
                    color: 0x00AE86, // Зелёный цвет — более читаемый
                    fields: [
                        {
                            name: '🔹 Кто принимал:',
                            value: `> ${examinerSafe}`,
                            inline: false
                },
                {
                    name: '🔹 У кого принимали:',
            value: `> ${candidateSafe}`,
            inline: false
        },
        {
            name: '🔹 Пройденные экзамены:',
            value: exams.map(exam => `> ${escapeMarkdown(exam)}`).join('\n'),
            inline: false
        },
        {
            name: '🔹 Результат:',
            value: `> **${result.value}**`,
            inline: false
        }
            ],
            footer: {
                text: 'Отчёт сформирован автоматически'
            },
            timestamp: new Date().toISOString() // текущее время
        }
    ];

        // 3. Отправляем в Discord
        sendToDiscord(embed, examiner);
    });
});

// Функция отправки в Discord
function sendToDiscord(payload, examiner) {
    // ВАЖНО: замените URL на корректный
    const webhookURL = 'https://discord.com/api/webhooks/1475920270492565665/Jvw_ng5hLZqbp9ZPCwDrohTrtDuvHpDYQbq-8VgqEnfCmsUNR8brbpuohb20U9QRwiN8';

    // Индикация загрузки
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
    }

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            // 4. Успешная отправка: сбрасываем форму и обновляем статистику
            alert('Отчёт успешно отправлен в Discord!');
            document.getElementById('examForm').reset();

            // Увеличиваем счётчик для экзаменатора
            if (typeof incrementStat === 'function') {
                incrementStat(examiner, 'exam');
            } else {
                console.warn('Функция incrementStat не найдена!');
            }
        } else {
            // Ошибка отправки
            response.text().then(text => {
                console.error('Ошибка Discord API:', text);
                alert(`Ошибка отправки отчёта. Статус: ${response.status}`);
            });
        }
    })
    .catch(error => {
        // Ошибка сети/CORS
        console.error('Критическая ошибка:', error);
        alert('Не удалось отправить отчёт. Проверьте интернет‑соединение и URL вебхука.');
    })
    .finally(() => {
        // Сброс состояния кнопки
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить отчёт в Discord';
        }
    });
}


