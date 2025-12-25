// Предустановленные пользователи с уникальным оформлением
const predefinedUsers = [
	{
		firstName: "Инна",
		lastName: "Коваленко",
		hikes: 20,
		altitude: 3600,
		days: 65,
		personalSite: "users/kovalenko/main.html",
		theme: "kovalenko-inna"
	},
	{
		firstName: "Галина",
		lastName: "Коваленко",
		hikes: 24,
		altitude: 3800,
		days: 72,
		personalSite: "users/kovalenkog/main.html",
		theme: "kovalenko-galina"
	},
	{
		firstName: "Игорь",
		lastName: "Стрельников",
		hikes: 30,
		altitude: 4500,
		days: 95,
		personalSite: "users/strelnikovi/main.html",
		theme: "strelnikov-igor"
	},
	{
		firstName: "Иван",
		lastName: "Стрельников",
		hikes: 28,
		altitude: 4200,
		days: 89,
		personalSite: "users/strelnikov/main.html",
		theme: "strelnikov"
	},
	{
		firstName: "Юрий",
		lastName: "Жолнач",
		hikes: 28,
		altitude: 4200,
		days: 89,
		personalSite: "users/zholnach/main.html",
		theme: "zholnach"
	},
	{
		firstName: "Юрий",
		lastName: "Жёлнач",
		hikes: 25,
		altitude: 3900,
		days: 75,
		personalSite: "users/zholnach/main.html",
		theme: "zholnach2"
	},
	{
		firstName: "София",
		lastName: "Ткаченко",
		hikes: 18,
		altitude: 3500,
		days: 60,
		personalSite: "users/tkachenko/main.html",
		theme: "tkachenko"
	},
	{
		firstName: "Евгения",
		lastName: "Чуркина",
		hikes: 22,
		altitude: 4100,
		days: 85,
		personalSite: "users/churkina/main.html",
		theme: "churkina"
	},
	{
		firstName: "Ирина",
		lastName: "Загдай",
		hikes: 19,
		altitude: 3800,
		days: 67,
		personalSite: "users/zagdai/main.html",
		theme: "zagdai"
	},
	{
		firstName: "Иван",
		lastName: "Моисеев",
		hikes: 42,
		altitude: 5100,
		days: 124,
		personalSite: "users/moiseev/main.html",
		theme: "moiseev"
	},
	{
		firstName: "Александр",
		lastName: "Медведев",
		hikes: 15,
		altitude: 3200,
		days: 45,
		personalSite: "users/medvedev/main.html",
		theme: "medvedev"
	},
	{
		firstName: "Александр",
		lastName: "Погребняк",
		hikes: 23,
		altitude: 4600,
		days: 78,
		personalSite: "users/pogrebnyak/main.html",
		theme: "pogrebnyak"
	},
	{
		firstName: "Владимир",
		lastName: "Савченко",
		hikes: 31,
		altitude: 3900,
		days: 112,
		personalSite: "users/savchenko/main.html",
		theme: "savchenko"
	},
	{
		firstName: "Богдан",
		lastName: "Сесь",
		hikes: 17,
		altitude: 3400,
		days: 52,
		personalSite: "users/ses/main.html",
		theme: "ses"
	}
];

// Создание снежинок
function createSnowflakes() {
	const snowContainer = document.getElementById('snow-container');
	const snowflakeCount = 80;
	
	for (let i = 0; i < snowflakeCount; i++) {
		const snowflake = document.createElement('div');
		snowflake.classList.add('snowflake');
		
		const size = Math.random() * 6 + 4;
		snowflake.style.width = `${size}px`;
		snowflake.style.height = `${size}px`;
		
		snowflake.style.left = `${Math.random() * 100}vw`;
		
		const duration = Math.random() * 10 + 10;
		const delay = Math.random() * 10;
		snowflake.style.animationDuration = `${duration}s`;
		snowflake.style.animationDelay = `${delay}s`;
		
		snowflake.style.opacity = Math.random() * 0.7 + 0.3;
		
		snowContainer.appendChild(snowflake);
	}
}

// Инициализация приложения
function initApp() {
	contentContainer = document.getElementById('content-container');
	showLoginForm();
}

// Показать форму входа
function showLoginForm() {
	const template = document.getElementById('login-template');
	contentContainer.innerHTML = template.innerHTML;
	
	// Заполняем список предустановленных пользователей
	const userList = document.getElementById('predefined-users-list');
	userList.innerHTML = '';
	predefinedUsers.forEach(user => {
		const userItem = document.createElement('div');
		userItem.className = 'user-item';
		userItem.textContent = `${user.firstName} ${user.lastName}`;
		userItem.addEventListener('click', () => {
			document.getElementById('login-first-name').value = user.firstName;
			document.getElementById('login-last-name').value = user.lastName;
			// Скрыть сообщение об ошибке, если оно было показано
			document.getElementById('login-error').style.display = 'none';
		});
		userList.appendChild(userItem);
	});
	
	// Обработчик формы входа
	document.getElementById('login-form').addEventListener('submit', function(e) {
		e.preventDefault();
		
		const firstName = document.getElementById('login-first-name').value.trim();
		const lastName = document.getElementById('login-last-name').value.trim();
		
		if (firstName && lastName) {
			// Поиск пользователя в предустановленных
			const user = predefinedUsers.find(user => 
				user.firstName.toLowerCase() === firstName.toLowerCase() && 
				user.lastName.toLowerCase() === lastName.toLowerCase()
			);
			
			if (user) {
				// Немедленное перенаправление на персональный сайт пользователя
				window.location.href = user.personalSite;
			} else {
				// Показать сообщение об ошибке
				document.getElementById('login-error').style.display = 'block';
				// Предложить перейти на страницу "нет аккаунта"
				setTimeout(() => showNoAccountPage(), 2000);
			}
		} else {
			alert('Пожалуйста, заполните все поля формы.');
		}
	});
}

// Показать страницу "нет аккаунта"
function showNoAccountPage() {
	const template = document.getElementById('no-account-template');
	contentContainer.innerHTML = template.innerHTML;
	
	// Обработчик кнопки "Вернуться ко входу"
	document.getElementById('go-to-login').addEventListener('click', function() {
		showLoginForm();
	});
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
	createSnowflakes();
	initApp();
	
	// Обновление снежинок при изменении размера окна
	window.addEventListener('resize', function() {
		const snowContainer = document.getElementById('snow-container');
		snowContainer.innerHTML = '';
		createSnowflakes();
	});
});
