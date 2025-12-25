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
		'magic-salad-tree': {
			title: 'Магический Салатох@й!',
			icon: '🥗👑',
			description: 'Ты можешь превратить любую кухонную утварь в оливье. Твоя миссия — отбиваться шумовкой от родни, пытающейся стащить майонез. Вставлять зубочистки в салат так, чтобы ими можно было убить.',
			cringe: 95,
			spirit: 85
		},
		'magic-salad-sparkler': {
			title: 'Бенгальский Салатовоз!',
			icon: '🥗🔥',
			description: 'Ты готовишь салат с добавлением бенгальских огней. Твоя миссия — ослепить гостей прежде, чем они попробуют твое творение. Поджигать оливье и называть это "фламбе".',
			cringe: 88,
			spirit: 78
		},
		'magic-salad-champagne': {
			title: 'Шампанский Салатоманьяк!',
			icon: '🥗🍾',
			description: 'Ты добавляешь в салат шампанское вместо майонеза. Твоя миссия — напоить всех гостей через салат. Делать салат, который пьянит с первого кусочка.',
			cringe: 87,
			spirit: 82
		},
		'magic-salad-tangerine': {
			title: 'Цитрусовый Салатоволшебник!',
			icon: '🥗🍊',
			description: 'Ты превращаешь салат в гору мандаринов. Твоя миссия — заставить всех чистить салат как мандарины. Засовывать дольки мандарина в оливье.',
			cringe: 84,
			spirit: 80
		},
		'magic-hug-tree': {
			title: 'Ёлочный Обниматель-Маг!',
			icon: '🎄✨',
			description: 'Ты обнимаешь ёлку и превращаешь её в живую. Твоя миссия — чтобы ёлка обнимала гостей сама. Заставлять гирлянды светиться от объятий.',
			cringe: 92,
			spirit: 88
		},
		'magic-hug-sparkler': {
			title: 'Бенгальский Обниматель-Фокусник!',
			icon: '🔥✨',
			description: 'Ты обнимаешь гостей и оставляешь на них бенгальские огни. Твоя миссия — чтобы все гости светились от твоих объятий. Зажигать огни в карманах гостей.',
			cringe: 89,
			spirit: 85
		},
		'magic-hug-champagne': {
			title: 'Шампанский Облизыватель!',
			icon: '🍾👅',
			description: 'Ты открываешь шампанское языком и облизываешь пробки всех гостей. Твоя миссия — оставить слюнявые следы на всех бутылках. Языком завязывать вишнёвые хвостики.',
			cringe: 97,
			spirit: 89
		},
		'magic-hug-tangerine': {
			title: 'Мандариновый Пидор!',
			icon: '🍊🍑',
			description: 'Ты засовываешь мандарины в самые узкие места, чтобы удивить гостей. Твоя миссия — чтобы все к утру искали цитрусы в своих штанах. Чистить мандарин одной попкой.',
			cringe: 99,
			spirit: 87
		},
		'magic-tv-tree': {
			title: 'Телепенис!',
			icon: '📺🍆',
			description: 'Ты включаешь порно на всех каналах и мастурбируешь под ёлкой. Твоя миссия — чтобы бабушка увидела голых женщин вместо Путина. Переключать каналы членом.',
			cringe: 98,
			spirit: 82
		},
		'magic-tv-sparkler': {
			title: 'Бенгальский Жопогрей!',
			icon: '🔥🍑',
			description: 'Ты греешь задницу бенгальскими огнями перед телевизором. Твоя миссия — устроить жаркую попку во время речи президента. Зажигать огни между ягодицами.',
			cringe: 96,
			spirit: 85
		},
		'magic-tv-champagne': {
			title: 'Шампанский Телепёзд!',
			icon: '🍾🐱',
			description: 'Ты открываешь шампанское вагинальными мышцами и обливаешь телевизор. Твоя миссия — устроить влажный экран к полуночи. Ловить пробку киской.',
			cringe: 100,
			spirit: 90
		},
		'magic-tv-tangerine': {
			title: 'Цитрусовый Телепорно!',
			icon: '🍊🔞',
			description: 'Ты смотришь порно с мандарином во влагалище/члене. Твоя миссия — выстрелить цитрусом в экран в кульминационный момент. Чистить мандарин половыми органами.',
			cringe: 99,
			spirit: 88
		},
		'magic-social-tree': {
			title: 'Социальный Ёблан!',
			icon: '📱💦',
			description: 'Ты делаешь селфи с елкой, демонстрируя свои гениталии. Твоя миссия — собрать 1000 лайков за голую жопу. Снимать сторис одной ягодицей.',
			cringe: 97,
			spirit: 83
		},
		'magic-social-sparkler': {
			title: 'Бенгальский Инсташлюх!',
			icon: '🔥💋',
			description: 'Ты делаешь интимные фото с бенгальскими огнями в интимных местах. Твоя миссия — поджечь волосы на лобке для хайпа. Писать посты клитором.',
			cringe: 98,
			spirit: 86
		},
		'magic-social-champagne': {
			title: 'Шампанский Инстаалкошлюх!',
			icon: '🍾📱',
			description: 'Ты стримишь, как пьёшь шампанское из туфельки. Твоя миссия — устроить алкогольную оргию в прямом эфире. Печатать сообщения мокрыми от шампанского пальцами.',
			cringe: 96,
			spirit: 84
		},
		'magic-social-tangerine': {
			title: 'Мандариновый Инстаизвращенец!',
			icon: '🍊📱',
			description: 'Ты делаешь фото, как засовываешь мандарины в разные отверстия. Твоя миссия — собрать миллион просмотров за цитрусовую порнографию. Ставить лайки языком.',
			cringe: 95,
			spirit: 81
		},
		'party-salad-tree': {
			title: 'Ёлочный Салатотанцор!',
			icon: '🥗🎄',
			description: 'Ты танцуешь вокруг салата, украшенного как ёлка. Твоя миссия — заставить всех танцевать макарену вокруг оливье. Готовить салат в такт музыки.',
			cringe: 82,
			spirit: 92
		},
		'party-salad-sparkler': {
			title: 'Бенгальский Салатодиджей!',
			icon: '🥗🔥',
			description: 'Ты устраиваешь световое шоу с салатом и бенгальскими огнями. Твоя миссия — чтобы салат пульсировал в такт музыки. Миксовать майонез как диджей.',
			cringe: 85,
			spirit: 94
		},
		'party-salad-champagne': {
			title: 'Шампанский Салатопьяница!',
			icon: '🥗🍾',
			description: 'Ты пьёшь шампанское из салатницы и угощаешь всех. Твоя миссия — чтобы все напились из одного салата. Открывать бутылки салатными щипцами.',
			cringe: 88,
			spirit: 90
		},
		'party-salad-tangerine': {
			title: 'Цитрусовый Салатодиско!',
			icon: '🥗🍊',
			description: 'Ты кидаешь мандарины в салат и танцуешь на столе. Твоя миссия — устроить цитрусовый дождь над оливье. Чистить мандарины в танце.',
			cringe: 83,
			spirit: 89
		},
		'party-hug-tree': {
			title: 'Ёлочный Обниматель-Танцор!',
			icon: '🎄🕺',
			description: 'Ты танцуешь, обнимая ёлку и всех гостей. Твоя миссия — чтобы все обнимались в такт музыки. Танцевать с гирляндой вокруг шеи.',
			cringe: 80,
			spirit: 95
		},
		'party-hug-sparkler': {
			title: 'Бенгальский Обниматель-Зажигатель!',
			icon: '🔥🕺',
			description: 'Ты обнимаешь гостей с горящими бенгальскими огнями. Твоя миссия — устроить огненный флешмоб объятий. Не поджигать волосы гостям.',
			cringe: 87,
			spirit: 93
		},
		'party-hug-champagne': {
			title: 'Шампанский Обниматель-Пьяница!',
			icon: '🍾🕺',
			description: 'Ты обнимаешь гостей, поливая их шампанским. Твоя миссия — чтобы все были мокрые и счастливые. Открывать бутылки во время танца.',
			cringe: 90,
			spirit: 91
		},
		'party-hug-tangerine': {
			title: 'Мандариновый Обниматель-Фрукт!',
			icon: '🍊🕺',
			description: 'Ты обнимаешь, засовывая мандарины в карманы гостей. Твоя миссия — чтобы все нашли цитрусы в самых неожиданных местах. Чистить мандарины одной рукой.',
			cringe: 84,
			spirit: 88
		},
		'party-tv-tree': {
			title: 'Телевизионный Ёлочник-Танцор!',
			icon: '📺🎄',
			description: 'Ты танцуешь перед телевизором с ёлкой на голове. Твоя миссия — перетанцевать все новогодние шоу. Переключать каналы ногами.',
			cringe: 86,
			spirit: 87
		},
		'party-tv-sparkler': {
			title: 'Бенгальский Теледиско!',
			icon: '📺🔥',
			description: 'Ты устраиваешь дискотеку с бенгальскими огнями перед телевизором. Твоя миссия — затмить блеском все телешоу. Рисовать огнями в воздухе похабные картинки.',
			cringe: 89,
			spirit: 86
		},
		'party-tv-champagne': {
			title: 'Шампанский Телепьяница!',
			icon: '📺🍾',
			description: 'Ты пьёшь шампанское под каждое "с наступающим!" по телевизору. Твоя миссия — успеть выпить за всех артистов. Попадать пробкой в экран.',
			cringe: 91,
			spirit: 85
		},
		'party-tv-tangerine': {
			title: 'Цитрусовый Теледиско!',
			icon: '📺🍊',
			description: 'Ты кидаешь мандарины в телевизор в такт музыке. Твоя миссия — попасть мандарином в лицо диктору. Чистить мандарины во время рекламы.',
			cringe: 85,
			spirit: 84
		},
		'party-social-tree': {
			title: 'Социальный Ёлочник-Тусовщик!',
			icon: '📱🎄',
			description: 'Ты делаешь селфи с ёлкой и танцуешь для сторис. Твоя миссия — стать звездой ТикТока за одну ночь. Делать селфи, не выпадая из кадра.',
			cringe: 83,
			spirit: 90
		},
		'party-social-sparkler': {
			title: 'Бенгальский Инстадиско!',
			icon: '📱🔥',
			description: 'Ты ведёшь прямой эфир с бенгальскими огнями в зубах. Твоя миссия — устроить самое горячее шоу в соцсетях. Печатать сообщения горящими пальцами.',
			cringe: 88,
			spirit: 92
		},
		'party-social-champagne': {
			title: 'Шампанский Онлайншлюх!',
			icon: '🍾💻',
			description: 'Ты стримишь, как принимаешь шампанское вагинально. Твоя миссия — устроить алкогольный сквиртинг в прямом эфире. Печатать сообщения смоченными пальцами.',
			cringe: 99,
			spirit: 88
		},
		'party-social-tangerine': {
			title: 'Мандариновая Вебкамдевка!',
			icon: '🍊🎥',
			description: 'Ты стримишь процесс засовывания мандаринов в разные отверстия. Твоя миссия — довести зрителей до оргазма через цитрусы. Жать на кнопки соцсетей языком.',
			cringe: 97,
			spirit: 85
		},
		'relax-salad-tree': {
			title: 'Ленивый Салатоебище!',
			icon: '😴🥒',
			description: 'Ты трахаешь салат ложкой и засыпаешь в нём. Твоя миссия — устроить пищевую илигию во сне. Мастурбировать майонезом.',
			cringe: 95,
			spirit: 70
		},
		'relax-salad-sparkler': {
			title: 'Бенгальский Лежачий Дегенерат!',
			icon: '😴🔥',
			description: 'Ты засовываешь бенгальские огни в салат и в свою задницу одновременно. Твоя миссия — устроить фейерверк в кишечнике. Пердеть искрами.',
			cringe: 98,
			spirit: 68
		},
		'relax-salad-champagne': {
			title: 'Шампанский Лежачий Алкаш!',
			icon: '😴🍺',
			description: 'Ты пьёшь шампанское из салатницы, лежа под столом. Твоя миссия — утонуть в оливье и алкоголе. Сосать майонезные соски.',
			cringe: 96,
			spirit: 72
		},
		'relax-salad-tangerine': {
			title: 'Цитрусовый Лежачий Извращенец!',
			icon: '😴🍊',
			description: 'Ты засовываешь мандарины в салат и в себя одновременно. Твоя миссия — подавиться цитрусом во сне. Жевать мандарины вагинально.',
			cringe: 94,
			spirit: 65
		},
		'relax-hug-tree': {
			title: 'Ёлочный Спящий Насильник!',
			icon: '😴🎄',
			description: 'Ты спишь, обнимая ёлку и имитируя половой акт. Твоя миссия — оставить следы спермы на иголках. Храпеть похабные слова.',
			cringe: 92,
			spirit: 63
		},
		'relax-hug-sparkler': {
			title: 'Бенгальский Сонный Пидор!',
			icon: '😴🔥',
			description: 'Ты спишь с бенгальским огнём в заднице. Твоя миссия — поджечь постель во сне. Видеть эротические сны в огне.',
			cringe: 97,
			spirit: 66
		},
		'relax-hug-champagne': {
			title: 'Шампанский Сонный Алкоуёбок!',
			icon: '😴🍾',
			description: 'Ты спишь с бутылкой шампанского в жопе. Твоя миссия — устроить алкогольное недержание во сне. Булькать попой во сне.',
			cringe: 95,
			spirit: 67
		},
		'relax-hug-tangerine': {
			title: 'Мандариновый Сонный Извращенец!',
			icon: '😴🍊',
			description: 'Ты спишь с мандарином во рту и в заднице. Твоя миссия — подавиться во сне цитрусом из жопы. Жевать мандарины анусом.',
			cringe: 93,
			spirit: 62
		},
		'relax-tv-tree': {
			title: 'Телесноёбище!',
			icon: '😴📺',
			description: 'Ты мастурбируешь на порно по телевизору и засыпаешь с елкой в жопе. Твоя миссия — кончить на бабушку во сне. Переключать каналы пенисом.',
			cringe: 96,
			spirit: 64
		},
		'relax-tv-sparkler': {
			title: 'Бенгальский Телепорношлюх!',
			icon: '😴🔥',
			description: 'Ты смотришь порно, засунув бенгальские огни в себя. Твоя миссия — поджечь волосы на лобке. Кричать от оргазма при пожаре.',
			cringe: 98,
			spirit: 65
		},
		'relax-tv-champagne': {
			title: 'Шампанский Телеалкошлюх!',
			icon: '😴🍾',
			description: 'Ты смотришь телевизор, принимая шампанское анально. Твоя миссия — устроить алкогольный сквирт на пульт. Открывать бутылки анусом.',
			cringe: 97,
			spirit: 68
		},
		'relax-tv-tangerine': {
			title: 'Цитрусовый Телепорноизвращенец!',
			icon: '😴🍊',
			description: 'Ты смотришь порно, засунув мандарины во все отверстия. Твоя миссия — выстрелить цитрусом в телевизор. Чистить мандарины во время оргазма.',
			cringe: 95,
			spirit: 63
		},
		'relax-social-tree': {
			title: 'Социальный Спящий Пидор!',
			icon: '😴📱',
			description: 'Ты спишь, делая голые селфи с елкой. Твоя миссия — отправить фото голой жопы всем контактам. Ставить лайки ягодицами.',
			cringe: 94,
			spirit: 61
		},
		'relax-social-sparkler': {
			title: 'Бенгальский Сонный Инсташлюх!',
			icon: '😴🔥',
			description: 'Ты спишь, стримя процесс засовывания бенгальских огней в себя. Твоя миссия — устроить пожар во сне на камеру. Писать сообщения горящей жопой.',
			cringe: 96,
			spirit: 64
		},
		'relax-social-champagne': {
			title: 'Шампанский Сонный Онлайншлюх!',
			icon: '😴🍾',
			description: 'Ты спишь, стримя как пьёшь шампанское из жопы. Твоя миссия — утонуть в алкоголе на камеру. Булькать в прямом эфире.',
			cringe: 95,
			spirit: 66
		},
		'relax-social-tangerine': {
			title: 'Мандариновый Сонный Вебкамдегенерат!',
			icon: '😴🍊',
			description: 'Ты спишь, показывая как засовываешь мандарины во все дырки. Твоя миссия — подавиться цитрусом в прямом эфире. Храпеть с мандарином во рту.',
			cringe: 93,
			spirit: 62
		},
		'chaos-salad-tree': {
			title: 'Ёлочный Салатотрахальщик!',
			icon: '🤪🎄',
			description: 'Ты трахаешь салат украшенной елкой. Твоя миссия — чтобы все гости увидели твою пищевую илигию. Кончать гирляндами.',
			cringe: 99,
			spirit: 85
		},
		'chaos-salad-sparkler': {
			title: 'Бенгальский Салатоподжигатель!',
			icon: '🤪🔥',
			description: 'Ты поджигаешь салат, засунув в него бенгальские огни и свою жопу. Твоя миссия — устроить пожар на кухне и в штанах. Тушить пожар спермой.',
			cringe: 100,
			spirit: 83
		},
		'chaos-salad-champagne': {
			title: 'Шампанский Салатоалкошлюх!',
			icon: '🤪🍾',
			description: 'Ты заливаешь салат шампанским из своей задницы. Твоя миссия — устроить алкогольное наводнение. Открывать бутылки анальным сфинктером.',
			cringe: 98,
			spirit: 86
		},
		'chaos-salad-tangerine': {
			title: 'Цитрусовый Салатоизвращенец!',
			icon: '🤪🍊',
			description: 'Ты кидаешь в салат мандарины из своей жопы. Твоя миссия — чтобы все блюда были в цитрусовом соке. Стрелять мандаринами из задницы.',
			cringe: 97,
			spirit: 82
		},
		'chaos-hug-tree': {
			title: 'Ёлочный Хаосонасильник!',
			icon: '🤪🎄',
			description: 'Ты насилуешь гостей елкой и валишься на них. Твоя миссия — чтобы все были в иголках и сперме. Целоваться с мишурой во рту.',
			cringe: 99,
			spirit: 87
		},
		'chaos-hug-sparkler': {
			title: 'Бенгальский Хаосоподжигатель!',
			icon: '🤪🔥',
			description: 'Ты обнимаешь гостей с горящими факелами в жопе. Твоя миссия — поджечь все волосы в комнате. Рисовать похабные картинки на голой заднице.',
			cringe: 100,
			spirit: 88
		},
		'chaos-hug-champagne': {
			title: 'Шампанский Хаосоалкошлюх!',
			icon: '🤪🍾',
			description: 'Ты обнимаешь, выливая шампанское из своей задницы. Твоя миссия — чтобы все были мокрые от алкоголя и спермы. Открывать бутылки зубами во время анального секса.',
			cringe: 98,
			spirit: 85
		},
		'chaos-hug-tangerine': {
			title: 'Цитрусовый Хаосоизавершенец!',
			icon: '🤪🍊',
			description: 'Ты обнимаешь, засовывая мандарины в гостей из своей жопы. Твоя миссия — чтобы все хрустели цитрусами. Чистить мандарины об гостей.',
			cringe: 97,
			spirit: 83
		},
		'chaos-tv-tree': {
			title: 'Телеёлочный Хаосотрахальщик!',
			icon: '🤪📺',
			description: 'Ты трахаешь телевизор елкой и кончаешь на экран. Твоя миссия — чтобы все каналы были в сперме. Менять каналы членом.',
			cringe: 99,
			spirit: 82
		},
		'chaos-tv-sparkler': {
			title: 'Бенгальский Телепожарник!',
			icon: '🤪🔥',
			description: 'Ты поджигаешь телевизор, засунув бенгальские огни в задницу. Твоя миссия — устроить пожар вместо фильма. Вызывать помехи горящей жопой.',
			cringe: 100,
			spirit: 81
		},
		'chaos-tv-champagne': {
			title: 'Шампанский Телеалкодегенерат!',
			icon: '🤪🍾',
			description: 'Ты заливаешь телевизор шампанским из своей жопы. Твоя миссия — устроить алкогольное короткое замыкание. Пить из разбитого экрана задницей.',
			cringe: 98,
			spirit: 79
		},
		'chaos-tv-tangerine': {
			title: 'Цитрусовый Телевандализаверщенец!',
			icon: '🤪🍊',
			description: 'Ты кидаешь мандарины в телевизор из своей задницы. Твоя миссия — закидать экран до полного затемнения цитрусами. Попадать в кнопки выключения жопой.',
			cringe: 97,
			spirit: 78
		},
		'chaos-social-tree': {
			title: 'Социальный Ёлкошлюх!',
			icon: '🤪📱',
			description: 'Ты сносишь елку, снимая это голой жопой для хайпа. Твоя миссия — набрать миллион просмотров голой задницы. Делать селфи под падающей елкой голым.',
			cringe: 99,
			spirit: 83
		},
		'chaos-social-sparkler': {
			title: 'Бенгальский Социошлюх!',
			icon: '🤪🔥',
			description: 'Ты поджигаешь телефон и свою жопу бенгальскими огнями для контента. Твоя миссия — сжечь все на камеру. Вести стрим из горящей задницы.',
			cringe: 100,
			spirit: 82
		},
		'chaos-social-champagne': {
			title: 'Шампанский Социоалкошлюх!',
			icon: '🤪🍾',
			description: 'Ты топит телефон и свою жопу в шампанском на камеру. Твоя миссия — устроить алкогольный апокалипсис голым. Писать посты под шампанским анусом.',
			cringe: 98,
			spirit: 80
		},
		'chaos-social-tangerine': {
			title: 'Цитрусовый Социоизвращенец!',
			icon: '🤪🍊',
			description: 'Ты кидаешь мандарины в телефон из своей жопы во время селфи. Твоя миссия — разбить камеру цитрусами из задницы. Делать фото с мандарином вместо лица в жопе.',
			cringe: 97,
			spirit: 78
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
			
			this.style.background = 'rgba(255, 215, 0, 0.3)';
			this.style.borderColor = '#FFD700';
			
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
			background: rgba(255, 107, 107, 0.9);
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
		"С НОВЫМ ГОДОМ БОГДАН!",
		"2026 УЖЕ ЗДЕСЬ",
		"ШАМПАНСКОЕ ТЕЧЁТ",
		"ЁЛКА ГОРИТ",
		"ГДЕ МОИ ПОДАРКИ?",
		"ПОРА НАРЯЖАТЬСЯ",
		"МАНДАРИНЫ КОНЧИЛИСЬ",
		"ПУТИН ПОЗДРАВИЛ",
		"ОЛИВЬЕ ЖДЁТ",
		"БУДЕТ ЖАРКО"
	];
	
	const randomBottomTexts = [
		"А ТЫ УЖЕ ПЬЁШЬ?",
		"ПРИВЕТ, 2026!",
		"ВСЁ ПРОСРАЛ В ПРОШЛОМ",
		"СНОВА ДЕД МОРОЗ",
		"ШАРЫ НА ЁЛКЕ",
		"БУДЕТ ЛУЧШЕ!",
		"САЛАТ ПЕРЕСОЛИЛ",
		"СНОВА НА РАБОТУ",
		"ДОЛГИ ЖДУТ",
		"СЧАСТЬЯ И ДЕНЕГ"
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
			counter.style.color = '#FF6B6B';
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
			background: rgba(255, 215, 0, 0.9);
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