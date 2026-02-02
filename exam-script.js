document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('examForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Собираем данные
        const examinerName = document.getElementById('examinerName').value;
        const examinerCID = document.getElementById('examinerCID').value;
        const examiner = `${examinerName} | ${examinerCID}`;

        const candidateName = document.getElementById('candidateName').value;
        const candidateCID = document.getElementById('candidateCID').value;
        const candidate = `${candidateName} | ${candidateCID}`;

        const exams = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            exams.push(checkbox.value);
        });

        const result = document.querySelector('input[name="result"]:checked').value;

        // Формируем Embed для Discord
        const embed = {
            content: `<@&1412079127951048805> <@&1412081593727717438>`, // упоминания ролей
            embeds: [
                {
                    title: '📊 ОТЧЁТ ОБ ЭКЗАМЕНЕ — Hospital Academy',
                    color: 0xFFFFFF, // белый цвет левой вертикальной полосы
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
                            value: `> **${result}**`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: ''
                    },
                    timestamp: new Date().toISOString() // текущая дата и время
                }
            ]
        };

        sendToDiscord(embed);
    });
});

function sendToDiscord(payload) {
    const webhookURL = 'https://discord.com/api/webhooks/1421632469441970246/u5uI3yfJA21TOvsJkpw_wi6tRWVICMDnDs4IGVrfb9Lzde-6mg6-PNBt5LUOX_hsTuOw'; // ваш URL

    fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert('Отчёт успешно отправлен в Discord!');
            document.getElementById('examForm').reset();
        } else {
            alert('Ошибка при отправке отчёта. Проверьте Webhook.');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка сети. Проверьте подключение.');
    });
}


