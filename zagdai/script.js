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
});

function createSnowflakes() {
    const snowContainer = document.getElementById('snow-container');
    const snowflakeCount = 150;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snow');
        
        const size = Math.random() * 6 + 2;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        snowflake.style.opacity = Math.random() * 0.5 + 0.3;
        
        snowflake.style.left = `${Math.random() * 100}vw`;
        
        const randomX = (Math.random() - 0.5) * 80;
        snowflake.style.setProperty('--random-x', `${randomX}px`);
        
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        snowflake.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        
        snowContainer.appendChild(snowflake);
    }
}

function initGallery() {
    const slides = document.querySelectorAll('.gallery-slide');
    const prevButton = document.querySelector('.gallery-nav.prev');
    const nextButton = document.querySelector('.gallery-nav.next');
    const gallerySlides = document.querySelector('.gallery-slides');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoSlideInterval = null;
    const AUTO_SLIDE_INTERVAL = 6000;

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, AUTO_SLIDE_INTERVAL);
    }

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
        currentSlide = index;
    }

    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
        startAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
        startAutoSlide();
    });

    gallerySlides.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    });

    gallerySlides.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
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

    startAutoSlide();
    showSlide(currentSlide);
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
    
    const predictions = {
        'romantic-walk-love': {
            title: 'Год романтики и приключений',
            icon: '💖✨',
            description: 'Вас ждут незабываемые романтические путешествия и моменты, которые укрепят вашу связь. Год будет полным нежных сюрпризов и теплых вечеров вдвоем.',
            romance: 95,
            happiness: 90,
            surprise: 'Тайное письмо с любовными признаниями, которое ты найдешь в самый неожиданный момент'
        },
        'romantic-walk-dreams': {
            title: 'Год исполнения желаний',
            icon: '🌟💫',
            description: 'Все ваши общие мечты начнут сбываться. Вас ждут удивительные совпадения и возможности, которые приведут к долгожданным целям.',
            romance: 85,
            happiness: 95,
            surprise: 'Волшебный амулет любви, который будет притягивать к вам только самые светлые чувства'
        },
        'romantic-walk-memories': {
            title: 'Год прекрасных воспоминаний',
            icon: '📸💕',
            description: 'Вы создадите альбом счастливых моментов, которые будете пересматривать с улыбкой. Каждый день будет наполнен маленькими радостями.',
            romance: 88,
            happiness: 92,
            surprise: 'Заветная шкатулка, где будут храниться все ваши самые нежные слова друг к другу'
        },
        'romantic-walk-growth': {
            title: 'Год роста и развития',
            icon: '🌱✨',
            description: 'Вместе вы достигнете новых высот в отношениях и личностном росте. Этот год станет важным этапом в вашей общей истории.',
            romance: 82,
            happiness: 88,
            surprise: 'Карта вашей любви с отметками всех мест, где ваши сердца бились в унисон'
        },
        'cozy-home-love': {
            title: 'Год домашнего уюта',
            icon: '🏡💖',
            description: 'Ваш дом станет настоящей крепостью любви и тепла. Вы создадите неповторимую атмосферу, где каждый будет чувствовать себя счастливым.',
            romance: 92,
            happiness: 94,
            surprise: 'Семейный оберег, который будет охранять ваше счастье и умножать нежность'
        },
        'party-travel-memories': {
            title: 'Год ярких впечатлений',
            icon: '✈️🎉',
            description: 'Вас ждут незабываемые путешествия и веселые встречи с друзьями. Этот год будет наполнен радостью и новыми знакомствами.',
            romance: 80,
            happiness: 96,
            surprise: 'Волшебный фотоальбом, который сам будет пополняться самыми счастливыми моментами'
        },
        'travel-wishes-growth': {
            title: 'Год открытий',
            icon: '🌍🌟',
            description: 'Вы откроете для себя новые горизонты и возможности. Совместные приключения укрепят ваши отношения и подарят бесценный опыт.',
            romance: 87,
            happiness: 93,
            surprise: 'Компас любви, который всегда будет указывать путь к вашему взаимному счастью'
        },
        'rest-home-love': {
            title: 'Год гармонии',
            icon: '😴💕',
            description: 'Вы найдете идеальный баланс между отдыхом и активностью. Этот год подарит вам взаимопонимание и душевный покой.',
            romance: 90,
            happiness: 91,
            surprise: 'Хрустальное сердце, которое будет отражать всю глубину ваших чувств'
        },
        'default': {
            title: 'Год вашей любви',
            icon: '💞🎁',
            description: 'Вас ждет год, наполненный теплом, нежностью и взаимопониманием. Каждый день будет приносить новые поводы для улыбок.',
            romance: 88,
            happiness: 92,
            surprise: 'Магический кристалл, хранящий все ваши самые нежные моменты и обещания'
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
        
        const predictionKey = `${answers[0]}-${answers[1]}-${answers[2]}`;
        
        let prediction;
        if (predictions[predictionKey]) {
            prediction = predictions[predictionKey];
        } else {
            prediction = predictions['default'];
        }
        
        document.getElementById('result-title').textContent = prediction.title;
        document.getElementById('result-icon').textContent = prediction.icon;
        
        const description = document.querySelector('.result-description');
        description.innerHTML = `
            <p><strong>Главное событие года:</strong> ${prediction.description}</p>
            <p><strong>Самое романтичное:</strong> Каждый день будет наполнен нежными моментами и взаимопониманием</p>
            <p><strong>Сюрприз года:</strong> ${prediction.surprise}</p>
        `;
        
        setTimeout(() => {
            document.getElementById('romance-level').style.width = `${prediction.romance}%`;
            document.getElementById('happiness-level').style.width = `${prediction.happiness}%`;
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
            background: rgba(255, 105, 180, 0.9);
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