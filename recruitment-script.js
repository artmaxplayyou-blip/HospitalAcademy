document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recruitmentForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Сбор данных формы
        const data = {
            announcementType: document.getElementById('announcementType').value,
            interviewLeader: document.getElementById('interviewLeader').value,
            recruitmentDate: document.getElementById('recruitmentDate').value,
            recruitmentTime: document.getElementById('recruitmentTime').value,
            haStaff: document.getElementById('haStaff').value,
            accepted: []
        };

        // Собираем принятых кандидатов
        document.querySelectorAll('.accepted-item').forEach(item => {
            const name = item.querySelector('input:nth-child(1)').value.trim();
            const cid = item.querySelector('input:nth-child(2)').value.trim();
            if (name && cid) {
                data.accepted.push(`${name} | ${cid}`);
            }
        });

        if (data.accepted.length === 0) {
            alert('Добавьте хотя бы одного принятого кандидата!');
            return;
        }

        sendToDiscord(data, data.interviewLeader);
    });

    // Кнопка добавления нового кандидата
    document.getElementById('addAcceptedBtn').addEventListener('click', function() {
        const list = document.getElementById('acceptedList');
        const item = document.createElement('div');
        item.className = 'accepted-item';
        item.innerHTML = `
            <input type="text" placeholder="Имя Фамилия" required>
            <input type="text" placeholder="CID" required>
            <button type="button" class="removeBtn">×</button>
        `;
        list.appendChild(item);

        item.querySelector('.removeBtn').addEventListener('click', () => item.remove());
    });
});

function sendToDiscord(data, interviewLeader) {
    const webhookURL = 'https://discord.com/api/webhooks/1421610953195126826/uttYXOW4MSm8OcLxtvJfsowpZh2hSueFMwqP1oFXmepN5tJcaTAl-9uUw_vNh15GmrRu';

    const typeLabels = {
        'hall': 'Набор в холле',
        'electronic': 'Электронные заявки'
    };
    const announcementLabel = typeLabels[data.announcementType] || 'Не указано';

    const payload = {
        content: '<@&1412079127951048805> <@&1412081593727717438>',
        embeds: [{
            title: '📋 ОТЧЁТ О НАБОРЕ — Hospital Academy',
            color: 16777215,
            fields: [
                { name: '🔹 Тип объявления:', value: announcementLabel, inline: false },
                { name: '🔹 Главный по собеседованию:', value: data.interviewLeader, inline: false },
                {
                    name: '🔹 Время проведения:',
                    value: `${data.recruitmentDate} в ${data.recruitmentTime}`,
                    inline: false
                },
                { name: '🔹 Сотрудники HA:', value: data.haStaff || 'Не указаны', inline: false },
                {
                    name: '🔹 Принятые кандидаты:',
                    value: data.accepted.map(candidate => `> ${candidate}`).join('\n'),
                    inline: false
                }
            ],
            footer: { text: '' },
            timestamp: new Date().toISOString()
        }]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert('Отчёт успешно отправлен!');
            document.getElementById('recruitmentForm').reset();
            if (typeof incrementStat === 'function') {
                incrementStat(interviewLeader, 'recruitment');
            }
        } else {
            response.text().then(text => {
                console.error('Ошибка Discord:', text);
                alert(`Ошибка отправки: ${response.status}`);
            });
        }
    })
    .catch(error => {
        console.error('Сетевая ошибка:', error);
        alert('Проверьте подключение к интернету!');
    });
}
