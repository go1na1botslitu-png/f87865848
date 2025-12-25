document.addEventListener('DOMContentLoaded', function() {
	createSnowflakes();
	
	const elements = document.querySelectorAll('.greeting-box > *');
	elements.forEach((element, index) => {
		element.style.opacity = '0';
		element.style.transform = 'translateY(20px)';
		element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
		
		setTimeout(() => {
			element.style.opacity = '1';
			element.style.transform = 'translateY(0)';
		}, 100);
	});
	
	initGallery();
	initQuiz();
	initMemeGenerator();
});

function createSnowflakes() {
	const snowContainer = document.getElementById('snow-container');
	const snowflakeCount = 200;
	
	for (let i = 0; i < snowflakeCount; i++) {
		const snowflake = document.createElement('div');
		snowflake.classList.add('snow');
		
		const size = Math.random() * 8 + 2;
		snowflake.style.width = `${size}px`;
		snowflake.style.height = `${size}px`;
		
		snowflake.style.opacity = Math.random() * 0.7 + 0.3;
		
		snowflake.style.left = `${Math.random() * 100}vw`;
		
		const randomX = (Math.random() - 0.5) * 100;
		snowflake.style.setProperty('--random-x', `${randomX}px`);
		
		const duration = Math.random() * 20 + 10;
		
		const delay = Math.random() * 5;
		
		snowflake.style.animation = `fall ${duration}s linear ${delay}s infinite`;
		
		const flickerDelay = Math.random() * 5;
		snowflake.style.animation += `, flicker ${Math.random() * 3 + 2}s ease-in-out ${flickerDelay}s infinite alternate`;
		
		snowContainer.appendChild(snowflake);
	}
}

const style = document.createElement('style');
style.textContent = `
	@keyframes flicker {
		0%, 100% { opacity: var(--opacity); }
		50% { opacity: calc(var(--opacity) * 0.5); }
	}
`;
document.head.appendChild(style);

function initGallery() {
	const slides = document.querySelectorAll('.gallery-slide');
	const prevButton = document.querySelector('.gallery-nav.prev');
	const nextButton = document.querySelector('.gallery-nav.next');
	const gallerySlides = document.querySelector('.gallery-slides');
	const galleryContainer = document.querySelector('.gallery-container');
	let currentSlide = 0;
	const totalSlides = slides.length;
	let touchStartX = 0;
	let touchEndX = 0;
	let autoSlideInterval = null;
	let interactionTimer = null;
	const AUTO_SLIDE_INTERVAL = 5000;
	const INTERACTION_TIMEOUT = 10000;

	const isMobile = window.matchMedia('(max-width: 768px)').matches;

	function startAutoSlide() {
		if (isMobile) return;
		
		clearInterval(autoSlideInterval);
		autoSlideInterval = setInterval(() => {
			currentSlide = (currentSlide + 1) % totalSlides;
			showSlide(currentSlide);
		}, AUTO_SLIDE_INTERVAL);
	}

	function stopAutoSlide() {
		clearInterval(autoSlideInterval);
	}

	function resetInteractionTimer() {
		if (isMobile) return;
		
		clearTimeout(interactionTimer);
		interactionTimer = setTimeout(() => {
			startAutoSlide();
		}, INTERACTION_TIMEOUT);
	}

	function handleUserInteraction() {
		if (isMobile) return;
		stopAutoSlide();
		resetInteractionTimer();
	}

	function showSlide(index) {
		slides.forEach(slide => {
			slide.classList.remove('active');
		});
		slides[index].classList.add('active');
		currentSlide = index;
		
		if (isMobile) {
			gallerySlides.scrollTo({
				left: index * gallerySlides.offsetWidth,
				behavior: 'smooth'
			});
		}
	}

	prevButton.addEventListener('click', () => {
		currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
		showSlide(currentSlide);
		handleUserInteraction();
	});

	nextButton.addEventListener('click', () => {
		currentSlide = (currentSlide + 1) % totalSlides;
		showSlide(currentSlide);
		handleUserInteraction();
	});

	gallerySlides.addEventListener('touchstart', (e) => {
		touchStartX = e.changedTouches[0].screenX;
	});

	gallerySlides.addEventListener('touchend', (e) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	});

	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;
		
		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				currentSlide = (currentSlide + 1) % totalSlides;
			} else {
				currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
			}
			showSlide(currentSlide);
		}
	}

	if (!isMobile) {
		startAutoSlide();
	}

	if (!isMobile) {
		galleryContainer.addEventListener('mouseenter', () => {
			stopAutoSlide();
		});

		galleryContainer.addEventListener('mouseleave', () => {
			if (!interactionTimer) {
				startAutoSlide();
			}
		});
	}

	const galleryElements = document.querySelectorAll('.gallery-container > *');
	galleryElements.forEach((element, index) => {
		element.style.opacity = '0';
		element.style.transform = 'translateY(30px)';
		element.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
		setTimeout(() => {
			element.style.opacity = '1';
			element.style.transform = 'translateY(0)';
		}, 500);
	});

	window.addEventListener('beforeunload', () => {
		clearInterval(autoSlideInterval);
		clearTimeout(interactionTimer);
	});

	showSlide(currentSlide);
	
	if (isMobile) {
		prevButton.style.display = 'none';
		nextButton.style.display = 'none';
	}
}

function initQuiz() {
	const modal = document.getElementById('quiz-modal');
	const quizSteps = document.querySelectorAll('.quiz-step');
	const options = document.querySelectorAll('.quiz-option');
	const nextBtn = document.getElementById('next-btn');
	const prevBtn = document.getElementById('prev-btn');
	const progressFill = document.getElementById('progress-fill');
	const progressText = document.getElementById('progress-text');
	const resultSection = document.getElementById('quiz-result');
	const mainContent = document.getElementById('main-content');
	
	let currentStep = 0;
	const answers = [null, null, null];
	const totalSteps = 3;
	
	const roles = {
		'handyman-toast-tree': {
			title: 'Семейный Мастер!',
			icon: '🔧👑',
			description: 'Ты можешь починить все что угодно и произнести самый душевный тост. Твоя миссия — поддерживать уют в доме и создавать праздничную атмосферу. Зажигать елку с особым мастерством и теплом.',
			cringe: 25,
			spirit: 95
		},
		'handyman-toast-midnight': {
			title: 'Мастер Праздника!',
			icon: '🔧🕛',
			description: 'Ты встречаешь бой курантов с особым мастерством и произносишь незабываемые тосты. Твоя миссия — создавать магию новогодней ночи. Чинить сломанные украшения прямо перед полуночью.',
			cringe: 30,
			spirit: 90
		},
		'handyman-toast-gifts': {
			title: 'Мастер Сюрпризов!',
			icon: '🔧🎁',
			description: 'Ты не только даришь лучшие подарки, но и умеешь их идеально упаковать. Твоя миссия — делать каждое вручение подарка незабываемым событием. Мастерить уникальные упаковки своими руками.',
			cringe: 20,
			spirit: 88
		},
		'handyman-toast-table': {
			title: 'Мастер Застолья!',
			icon: '🔧🍽️',
			description: 'Ты создаешь идеальную праздничную атмосферу за столом. Твоя миссия — чтобы каждый гость чувствовал себя особенным. Быстро чинить случайно сломанные столовые приборы.',
			cringe: 22,
			spirit: 92
		},
		'cook-games-tree': {
			title: 'Шеф-Игрок!',
			icon: '👨‍🍳🎮',
			description: 'Ты готовишь кулинарные шедевры и организуешь самые веселые игры. Твоя миссия — объединять семью через еду и развлечения. Придумывать новогодние игры с кулинарным уклоном.',
			cringe: 18,
			spirit: 94
		},
		'cook-games-midnight': {
			title: 'Кулинарный Волшебник!',
			icon: '👨‍🍳✨',
			description: 'Твои блюда появляются как по волшебству к бойку курантов. Твоя миссия — создавать магию вкуса в новогоднюю ночь. Организовывать кулинарные конкурсы во время праздника.',
			cringe: 24,
			spirit: 89
		},
		'cook-games-gifts': {
			title: 'Шеф-ДедМороз!',
			icon: '👨‍🍳🎅',
			description: 'Ты даришь подарки, которые всегда приходятся по вкусу, в прямом смысле. Твоя миссия — удивлять вкусными сюрпризами. Готовить съедобные подарки для каждого члена семьи.',
			cringe: 26,
			spirit: 87
		},
		'cook-games-table': {
			title: 'Мастер Праздничного Стола!',
			icon: '👨‍🍳🏆',
			description: 'Твой стол — настоящее произведение искусства и центр праздника. Твоя миссия — создавать незабываемые гастрономические впечатления. Придумывать тематические блюда для каждого праздника.',
			cringe: 20,
			spirit: 91
		},
		'storyteller-dance-tree': {
			title: 'Танцующий Рассказчик!',
			icon: '📖💃',
			description: 'Ты рассказываешь самые интересные истории и зажигательно танцуешь. Твоя миссия — развлекать и объединять семью через истории и танцы. Сочинять новогодние истории под музыку.',
			cringe: 28,
			spirit: 86
		},
		'storyteller-dance-midnight': {
			title: 'Полуночный Сказитель!',
			icon: '📖🌌',
			description: 'Твои истории становятся особенно волшебными в новогоднюю ночь. Твоя миссия — создавать магию слова в самый важный момент года. Танцевать и рассказывать истории одновременно.',
			cringe: 32,
			spirit: 84
		},
		'storyteller-dance-gifts': {
			title: 'Сказочный Дарящий!',
			icon: '📖🎁',
			description: 'Ты даришь подарки с целой историей о каждом из них. Твоя миссия — делать каждый подарок особенным через историю. Сочинять легенды о происхождении подарков.',
			cringe: 34,
			spirit: 82
		},
		'storyteller-dance-table': {
			title: 'Застольный Летописец!',
			icon: '📖🍽️',
			description: 'Ты превращаешь каждое застолье в увлекательное путешествие по историям. Твоя миссия — создавать культурную программу праздника. Рассказывать истории о происхождении блюд.',
			cringe: 30,
			spirit: 80
		},
		'organizer-relax-tree': {
			title: 'Организатор Уюта!',
			icon: '🎯🛋️',
			description: 'Ты создаешь идеальную праздничную атмосферу для отдыха с семьей. Твоя миссия — чтобы каждый чувствовал себя комфортно и расслабленно. Организовывать уютные посиделки у елки.',
			cringe: 35,
			spirit: 88
		},
		'organizer-relax-midnight': {
			title: 'Мастер Полуночи!',
			icon: '🎯🌠',
			description: 'Ты планируешь встречу Нового года до мельчайших деталей. Твоя миссия — создать идеальную новогоднюю ночь для семьи. Организовывать сюрпризы к бойку курантов.',
			cringe: 38,
			spirit: 86
		},
		'organizer-relax-gifts': {
			title: 'Организатор Сюрпризов!',
			icon: '🎯🎊',
			description: 'Ты продумываешь вручение подарков как настоящее шоу. Твоя миссия — делать каждый подарок незабываемым событием. Создавать интригу вокруг подарков.',
			cringe: 40,
			spirit: 84
		},
		'organizer-relax-table': {
			title: 'Директор Застолья!',
			icon: '🎯👨‍✈️',
			description: 'Твой праздничный стол — образец организации и вкуса. Твоя миссия — чтобы все блюда подавались в идеальном порядке. Составлять меню с учетом предпочтений каждого гостя.',
			cringe: 36,
			spirit: 85
		}
	};
	
	prevBtn.style.display = 'none';
	nextBtn.style.display = 'none';
	modal.style.display = 'flex';
	updateProgress();

	prevBtn.style.order = '1';
	nextBtn.style.order = '2';
	
	options.forEach(option => {
		option.addEventListener('click', function() {
			const step = this.closest('.quiz-step');
			const stepIndex = parseInt(step.id.split('-')[1]) - 1;
			const value = this.dataset.value;
			
			answers[stepIndex] = value;
			
			const stepOptions = step.querySelectorAll('.quiz-option');
			stepOptions.forEach(opt => {
				opt.style.background = '';
				opt.style.borderColor = '';
			});
			
			this.style.background = 'rgba(255, 182, 193, 0.3)';
			this.style.borderColor = '#FFB6C1';
			
			nextBtn.style.display = 'flex';
			
			if (stepIndex === totalSteps - 1) {
				nextBtn.innerHTML = '<img src="right-arrow_2.png" alt="Вперед" width="24" height="24">';
			}
		});
	});
	
	nextBtn.addEventListener('click', function() {
		if (currentStep < totalSteps - 1) {
			if (answers[currentStep] !== null) {
				quizSteps[currentStep].classList.remove('active');
				currentStep++;
				quizSteps[currentStep].classList.add('active');
				
				updateProgress();
				
				if (currentStep > 0) {
					prevBtn.style.display = 'flex';
				}
				
				if (answers[currentStep] !== null) {
					nextBtn.style.display = 'flex';
				} else {
					nextBtn.style.display = 'none';
				}
			} else {
				showNotification('Пожалуйста, выберите вариант ответа!');
			}
		} else {
			if (answers[currentStep] !== null) {
				showResult();
			} else {
				showNotification('Пожалуйста, выберите вариант ответа!');
			}
		}
	});
	
	prevBtn.addEventListener('click', function() {
		if (currentStep > 0) {
			quizSteps[currentStep].classList.remove('active');
			currentStep--;
			quizSteps[currentStep].classList.add('active');
			
			updateProgress();
			
			if (currentStep === 0) {
				prevBtn.style.display = 'none';
			}
			
			if (answers[currentStep] !== null) {
				nextBtn.style.display = 'flex';
			} else {
				nextBtn.style.display = 'none';
			}
		}
	});
	
	function updateProgress() {
		const progress = ((currentStep + 1) / totalSteps) * 100;
		progressFill.style.width = `${progress}%`;
		progressText.textContent = `Вопрос ${currentStep + 1} из ${totalSteps}`;
	}
	
	function showResult() {
		modal.style.display = 'none';
		
		const roleKey = `${answers[0]}-${answers[1]}-${answers[2]}`;
		
		let role;
		if (roles[roleKey]) {
			role = roles[roleKey];
		} else {
			const keys = Object.keys(roles);
			const randomKey = keys[Math.floor(Math.random() * keys.length)];
			role = roles[randomKey];
		}
		
		document.getElementById('result-title').textContent = `Вы — ${role.title}`;
		document.getElementById('result-icon').textContent = role.icon;
		
		const description = document.querySelector('.result-description');
		description.innerHTML = `
			<p><strong>Ваша сверхспособность:</strong> ${role.description.split('. ')[0]}.</p>
			<p><strong>Ваша миссия:</strong> ${role.description.split('. ')[1]}.</p>
			<p><strong>Секретное умение:</strong> ${role.description.split('. ')[2]}</p>
		`;
		
		setTimeout(() => {
			document.getElementById('cringe-level').style.width = `${role.cringe}%`;
			document.getElementById('spirit-level').style.width = `${role.spirit}%`;
		}, 500);
		
		resultSection.classList.remove('hidden');
		mainContent.classList.remove('hidden');
		
		resultSection.style.opacity = '0';
		resultSection.style.transform = 'translateY(30px)';
		resultSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
		
		setTimeout(() => {
			resultSection.style.opacity = '1';
			resultSection.style.transform = 'translateY(0)';
		}, 100);
	}
	
	function showNotification(message) {
		const notification = document.createElement('div');
		notification.className = 'notification';
		notification.textContent = message;
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: rgba(255, 182, 193, 0.9);
			color: white;
			padding: 15px 25px;
			border-radius: 10px;
			z-index: 1001;
			animation: slideIn 0.3s ease;
		`;
		
		document.body.appendChild(notification);
		
		setTimeout(() => {
			notification.style.animation = 'slideOut 0.3s ease';
			setTimeout(() => {
				document.body.removeChild(notification);
			}, 300);
		}, 3000);
		
		const notificationStyle = document.createElement('style');
		notificationStyle.textContent = `
			@keyframes slideIn {
				from { transform: translateX(100%); opacity: 0; }
				to { transform: translateX(0); opacity: 1; }
			}
			@keyframes slideOut {
				from { transform: translateX(0); opacity: 1; }
				to { transform: translateX(100%); opacity: 0; }
			}
		`;
		document.head.appendChild(notificationStyle);
	}
}

function initMemeGenerator() {
	const memeGenerator = document.querySelector('.meme-generator-container');
	if (!memeGenerator) return;
	
	memeGenerator.style.opacity = '0';
	memeGenerator.style.transform = 'translateY(30px)';
	memeGenerator.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
	
	setTimeout(() => {
		memeGenerator.style.opacity = '1';
		memeGenerator.style.transform = 'translateY(0)';
	}, 300);
	
	const imageOptions = document.querySelectorAll('.image-option:not(.custom-image)');
	const customImageOption = document.querySelector('.custom-image');
	const customImageUpload = document.getElementById('custom-image-upload');
	const topTextInput = document.getElementById('top-text');
	const bottomTextInput = document.getElementById('bottom-text');
	const randomTextBtn = document.getElementById('random-text');
	const memeImage = document.getElementById('meme-image');
	const previewTopText = document.getElementById('preview-top-text');
	const previewBottomText = document.getElementById('preview-bottom-text');
	const newMemeBtn = document.getElementById('new-meme');
	const topCharCount = topTextInput.nextElementSibling;
	const bottomCharCount = bottomTextInput.nextElementSibling;
	
	const randomTopTexts = [
		"С НОВЫМ ГОДОМ ПАПА!",
		"2026 С ТОБОЙ",
		"ЛУЧШИЙ ПАПА НА СВЕТЕ",
		"СЕМЬЯ ТВОЯ ОПОРА",
		"СПАСИБО ЗА ВСЁ",
		"ТЫ НАШ ГЕРОЙ",
		"С НОВЫМ СЧАСТЬЕМ",
		"ЛЮБИМ ТЕБЯ БЕСКОНЕЧНО",
		"ТВОЯ МУДРОСТЬ - НАШЕ БОГАТСТВО",
		"САМЫЙ СИЛЬНЫЙ ПАПА"
	];
	
	const randomBottomTexts = [
		"МЫ ТОБОЙ ГОРДИМСЯ!",
		"НОВЫЙ ГОД С ЛУЧШИМ ПАПОЙ",
		"СПАСИБО ЗА ЗАБОТУ",
		"ТЫ НАША КРЕПОСТЬ",
		"СЕМЬЯ ЛЮБИТ ТЕБЯ",
		"ТВОЯ УЛЫБКА - НАШЕ СЧАСТЬЕ",
		"ВМЕСТЕ В 2026 ГОД",
		"САМЫЙ ДОРОГОЙ ЧЕЛОВЕК",
		"НАША ОПОРА И ПОДДЕРЖКА",
		"СПАСИБО ЗА ТВОЮ ЛЮБОВЬ"
	];
	
	let currentImage = '';
	let currentTopText = '';
	let currentBottomText = '';
	
	updateCharCount(topTextInput, topCharCount);
	updateCharCount(bottomTextInput, bottomCharCount);
	
	imageOptions.forEach(option => {
		option.addEventListener('click', function() {
			imageOptions.forEach(opt => opt.classList.remove('active'));
			customImageOption.classList.remove('active');
			
			this.classList.add('active');
			
			const imageName = this.dataset.image;
			currentImage = imageName;
			memeImage.style.backgroundImage = `url(${imageName})`;
		});
	});
	
	customImageOption.addEventListener('click', function() {
		customImageUpload.click();
	});
	
	customImageUpload.addEventListener('change', function(e) {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();
			
			reader.onload = function(event) {
				imageOptions.forEach(opt => opt.classList.remove('active'));
				customImageOption.classList.add('active');
				
				currentImage = event.target.result;
				memeImage.style.backgroundImage = `url(${event.target.result})`;
			};
			
			reader.readAsDataURL(file);
		}
	});
	
	topTextInput.addEventListener('input', function() {
		currentTopText = this.value;
		previewTopText.textContent = currentTopText.toUpperCase();
		updateCharCount(this, topCharCount);
	});
	
	bottomTextInput.addEventListener('input', function() {
		currentBottomText = this.value;
		previewBottomText.textContent = currentBottomText.toUpperCase();
		updateCharCount(this, bottomCharCount);
	});
	
	randomTextBtn.addEventListener('click', function() {
		const randomTop = randomTopTexts[Math.floor(Math.random() * randomTopTexts.length)];
		const randomBottom = randomBottomTexts[Math.floor(Math.random() * randomBottomTexts.length)];
		
		topTextInput.value = randomTop;
		bottomTextInput.value = randomBottom;
		
		currentTopText = randomTop;
		currentBottomText = randomBottom;
		
		previewTopText.textContent = currentTopText.toUpperCase();
		previewBottomText.textContent = currentBottomText.toUpperCase();
		
		updateCharCount(topTextInput, topCharCount);
		updateCharCount(bottomTextInput, bottomCharCount);
		
		this.style.transform = 'scale(0.95)';
		setTimeout(() => {
			this.style.transform = 'scale(1)';
		}, 150);
	});
	
	newMemeBtn.addEventListener('click', function() {
		imageOptions.forEach(opt => opt.classList.remove('active'));
		customImageOption.classList.remove('active');
		customImageUpload.value = '';
		
		topTextInput.value = '';
		bottomTextInput.value = '';
		
		currentImage = '';
		currentTopText = '';
		currentBottomText = '';
		
		memeImage.style.backgroundImage = '';
		previewTopText.textContent = '';
		previewBottomText.textContent = '';
		
		updateCharCount(topTextInput, topCharCount);
		updateCharCount(bottomTextInput, bottomCharCount);
		
		this.style.transform = 'scale(0.95)';
		setTimeout(() => {
			this.style.transform = 'scale(1)';
		}, 150);
		
		showMemeNotification('Готово! Создавайте новый мем!');
	});
	
	function updateCharCount(input, counter) {
		const count = input.value.length;
		const max = input.maxLength;
		counter.textContent = `${count}/${max}`;
		
		if (count > max * 0.8) {
			counter.style.color = '#FFB6C1';
		} else {
			counter.style.color = 'rgba(255, 255, 255, 0.7)';
		}
	}
	
	function showMemeNotification(message) {
		const existingNotification = document.querySelector('.meme-notification');
		if (existingNotification) {
			existingNotification.remove();
		}
		
		const notification = document.createElement('div');
		notification.className = 'meme-notification';
		notification.textContent = message;
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			left: 50%;
			transform: translateX(-50%) translateY(-100%);
			background: rgba(255, 182, 193, 0.9);
			color: #1b2735;
			padding: 15px 30px;
			border-radius: 10px;
			z-index: 1001;
			font-weight: 600;
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
			animation: memeNotificationSlideIn 0.3s ease forwards;
			max-width: 90%;
			text-align: center;
		`;
		
		document.body.appendChild(notification);
		
		const style = document.createElement('style');
		style.textContent = `
			@keyframes memeNotificationSlideIn {
				from {
					transform: translateX(-50%) translateY(-100%);
					opacity: 0;
				}
				to {
					transform: translateX(-50%) translateY(0);
					opacity: 1;
				}
			}
			@keyframes memeNotificationSlideOut {
				from {
					transform: translateX(-50%) translateY(0);
					opacity: 1;
				}
				to {
					transform: translateX(-50%) translateY(-100%);
					opacity: 0;
				}
			}
		`;
		document.head.appendChild(style);
		
		setTimeout(() => {
			notification.style.animation = 'memeNotificationSlideOut 0.3s ease forwards';
			setTimeout(() => {
				notification.remove();
				style.remove();
			}, 300);
		}, 3000);
	}
	
	if (imageOptions.length > 0) {
		imageOptions[0].click();
	}
}