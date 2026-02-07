document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('examForm');

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Собираем данные из полей формы
        const examiner = document.getElementById('examiner').value.trim();
        const candidateName = document.getElementById('candidateName').value.trim();
        const candidateCID = document.getElementById('candidateCID').value.trim();

        // Формируем строку "Имя Фамилия | CID"
        const candidate = `${candidateName} | ${candidateCID}`;

        // Собираем выбранные экзамены (чекбоксы)
        const exams = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            exams.push(checkbox.value);
        });

        // Получаем результат (радио-кнопка)
        const result = document.querySelector('input[name="result"]:checked');
        if (!result) {
            alert('Пожалуйста, выберите результат экзамена!');
            return;
        }

        // 2. Формируем Embed для Discord
        const embed = {
            content: '<@&1412079127951048805> <@&1412081593727717438>', // упоминания ролей
            embeds: [
                {
                    title: '📊 ОТЧЁТ ОБ ЭКЗАМЕНЕ — Hospital Academy',
                    color: 0xFFFFFF, // белый цвет левой полосы
                    fields: [
                        {
                            name: '🔹 Кто принимал:',
                            value: `> ${examiner}`,
                            inline: false
                        },
                        {
                            name: '🔹 У кого принимали:',
                            value: `> ${candidate}`,
                            inline: false
                        },
                        {
                            name: '🔹 Сданные экзамены:',
                            value: exams.length > 0
                                ? exams.map(exam => `> ${exam}`).join('\n')
                                : '> Не выбрано',
                            inline: false
                        },
                        {
                            name: '🔹 Результат:',
                            value: `> **${result.value}**`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: ''
                    },
                    timestamp: new Date().toISOString() // текущее время
                }
            ]
        };

        // 3. Отправляем в Discord
        sendToDiscord(embed, examiner);
    });
});

// Функция отправки в Discord
function sendToDiscord(payload, examiner) {
    // ВАЖНО: замените URL на корректный (без лишних символов)
    const webhookURL = 'https://discord.com/api/webhooks/1421632469441970246/u5uI3yfJA21TOvsJkpw_wi6tRWVICMDnDs4IGVrfb9Lzde-6mg6-PNBt5LUOX_hsTuOw';


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
        alert('Не удалось отправить отчёт. Проверьте интернет-соединение и URL вебхука.');
    });
}
