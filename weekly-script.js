document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('recruitmentForm');

form.addEventListener('submit', function(e) {
e.preventDefault();

const data = {
announcementType: document.getElementById('announcementType').value,
interviewLeader: document.getElementById('interviewLeader').value,
recruitmentDate: document.getElementById('recruitmentDate').value,
recruitmentTime: document.getElementById('recruitmentTime').value,
haStaff: document.getElementById('haStaff').value,
accepted: []
};

document.querySelectorAll('.accepted-item').forEach(item => {
const name = item.querySelector('input:nth-child(1)').value;
const cid = item.querySelector('input:nth-child(2)').value;
if (name && cid) data.accepted.push(`${name} | ${cid}`);
});

sendToDiscord(data);
});

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

function sendToDiscord(data) {
const webhookURL = 'https://discord.com/api/webhooks/1421610953195126826/uttYXOW4MSm8OcLxtvJfsowpZh2hSueFMwqP1oFXmepN5tJcaTAl-9uUw_vNh15GmrRu';

// Преобразуем значение типа объявления в читаемый формат
const typeLabels = {
'hall': 'Набор в холле',
'electronic': 'Электронные заявки'
};
const announcementLabel = typeLabels[data.announcementType] || 'Не указано';

const payload = {
content: `<@&1412079127951048805> <@&1412081593727717438>`, // Упоминания ролей в начале
embeds: [
{
title: '📋 ОТЧЁТ О НАБОРЕ — Hospital Academy',
color: 16777215, // Белый цвет левого края
fields: [
{
name: '🔹 Тип объявления:',
value: announcementLabel,
inline: false
},
{
name: '🔹 Главный по собеседованию:',
value: data.interviewLeader,
inline: false
},
{
name: '🔹 Время проведения:',
value: `${data.recruitmentDate} в ${data.recruitmentTime}`,
inline: false
},
{
name: '🔹 Сотрудники HA:',
value: data.haStaff || 'Не указаны',
inline: false
},
{
name: '🔹 Принятые кандидаты:',
value: data.accepted.length > 0
? data.accepted.map(candidate => `> ${candidate}`).join('\n')
: '> Нет принятых кандидатов',
inline: false
}
],
footer: {
text: ''
},
timestamp: new Date().toISOString()
}
]
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
} else {
alert('Ошибка отправки. Проверьте webhook.');
}
})
.catch(error => {
console.error('Ошибка:', error);
alert('Ошибка сети. Проверьте подключение.');
});
}
в этом коде
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
