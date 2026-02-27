// exam-script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('examForm');
    if (!form) {
        console.error('Форма с id "examForm" не найдена!');
        return;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 1. Проверяем наличие всех полей
        const examinerInput = document.getElementById('examiner');
        const candidateNameInput = document.getElementById('candidateName');
        const candidateCIDInput = document.getElementById('candidateCID');

        if (!examinerInput || !candidateNameInput || !candidateCIDInput) {
            console.error('Один из элементов формы не найден', {
                examiner: !!examinerInput,
                candidateName: !!candidateNameInput,
                candidateCID: !!candidateCIDInput
            });
            alert('Ошибка: не все поля формы доступны. Проверьте консоль.');
            return;
        }

        const examiner = examinerInput.value.trim();
        const candidateName = candidateNameInput.value.trim();
        const candidateCID = candidateCIDInput.value.trim();

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

        // Формируем строку кандидата
        const candidate = `${candidateName} | ${candidateCID}`;

        // 2. Собираем выбранные экзамены
        const exams = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            exams.push(checkbox.value);
        });

        if (exams.length === 0) {
            alert('Пожалуйста, выберите хотя бы один экзамен');
            return;
        }

        // 3. Результат экзамена
        const result = document.querySelector('input[name="result"]:checked');
        if (!result) {
            alert('Пожалуйста, выберите результат экзамена!');
            return;
        }

        // 4. Экранирование Markdown-символов (для безопасности)
        const escapeMarkdown = (text) => text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');

        const examinerSafe = escapeMarkdown(examiner);
        const candidateSafe = escapeMarkdown(candidate);
        const examsSafe = exams.map(exam => escapeMarkdown(exam));
        const resultSafe = escapeMarkdown(result.value);

        // 5. Проверка длины полей (ограничение Discord: 1024 символа)
        const examsText = examsSafe.map(exam => `> ${exam}`).join('\n');
        if (examsText.length > 1024) {
            alert('Слишком много экзаменов! Сократите список.');
            return;
        }

        // 6. Формируем payload для Discord Webhook
        const payload = {
            content: '<@&1412079127951048805> <@&1412081593727717438>', // упоминания ролей
            embeds: [
                {
                    title: '📊 ОТЧЁТ ОБ ЭКЗАМЕНЕ — Hospital Academy',
                    color: 0x00AE86, // цвет в десятичном формате (можно и 0x00AE86)
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
                            value: examsText,
                            inline: false
                        },
                        {
                            name: '🔹 Результат:',
                            value: `> **${resultSafe}**`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: 'Отчёт сформирован автоматически'
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        // 7. Отправка в Discord
        await sendToDiscord(payload, examiner);
    });
});

// Функция отправки (теперь асинхронная, с улучшенной обработкой)
async function sendToDiscord(payload, examiner) {
    const webhookURL = 'https://discord.com/api/webhooks/1475920270492565665/Jvw_ng5hLZqbp9ZPCwDrohTrtDuvHpDYQbq-8VgqEnfCmsUNR8brbpuohb20U9QRwiN8';
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn ? submitBtn.textContent : '';

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Отправка...';
        }

        console.log('Отправляемый payload:', JSON.stringify(payload, null, 2)); // отладка

        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('✅ Отчёт успешно отправлен в Discord!');
            document.getElementById('examForm').reset();

            // Если есть функция статистики – вызываем
            if (typeof incrementStat === 'function') {
                incrementStat(examiner, 'exam');
            } else {
                console.warn('Функция incrementStat не определена');
            }
        } else {
            // Пытаемся получить текст ошибки от Discord
            const errorText = await response.text();
            console.error('Ошибка Discord API:', response.status, errorText);
            alert(`❌ Ошибка отправки. Код: ${response.status}\nПроверьте консоль (F12) для деталей.`);
        }
    } catch (error) {
        console.error('Критическая ошибка при отправке:', error);
        alert('❌ Не удалось отправить отчёт. Возможно, проблемы с сетью или CORS.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || 'Отправить отчёт в Discord';
        }
    }
}
