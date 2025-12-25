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
        'wisdom-cook-tradition': {
            title: 'Мудрая Хранительница Традиций',
            icon: '📚🍲',
            description: 'Твоя мудрость сохраняет семейные рецепты и традиции. Твоя миссия - передавать кулинарные секреты из поколения в поколение. Твое секретное умение - готовить блюда, которые хранят историю семьи.',
            wisdom: 98,
            warmth: 95
        },
        'wisdom-story-harmony': {
            title: 'Мудрая Сказительница',
            icon: '📖✨',
            description: 'Твои истории учат гармонии и пониманию. Твоя миссия - передавать жизненные урокы через истории. Твое секретное умение - находить нужные слова в любой ситуации.',
            wisdom: 97,
            warmth: 96
        },
        'wisdom-teach-warmth': {
            title: 'Мудрая Наставница',
            icon: '🎨🤗',
            description: 'Ты учишь рукоделию с теплотой и терпением. Твоя миссия - передавать умения, которые согревают душу. Твое секретное умение - превращать уроки в моменты счастья.',
            wisdom: 95,
            warmth: 98
        },
        'wisdom-garden-unity': {
            title: 'Мудрая Садовница',
            icon: '🌿👵',
            description: 'Твой сад учит единству с природой. Твоя миссия - показывать красоту созидания. Твое секретное умение - выращивать не только растения, но и добрые отношения.',
            wisdom: 96,
            warmth: 94
        },
        'care-cook-warmth': {
            title: 'Заботливая Кудесница',
            icon: '🍲💖',
            description: 'Твоя забота проявляется через вкуснейшие блюда. Твоя миссия - кормить семью с любовью. Твое секретное умение - готовить именно то, что нужно для души.',
            wisdom: 92,
            warmth: 99
        },
        'care-story-tradition': {
            title: 'Заботливая Летописец',
            icon: '📖❤️',
            description: 'Твои рассказы хранят семейную историю. Твоя миссия - сохранять память о предках. Твое секретное умение - оживлять прошлое в рассказах.',
            wisdom: 94,
            warmth: 97
        },
        'care-teach-harmony': {
            title: 'Заботливая Учительница',
            icon: '🎨✨',
            description: 'Ты учишь рукоделию с заботой о каждом. Твоя миссия - развивать творческие способности внуков. Твое секретное умение - находить подход к каждому.',
            wisdom: 93,
            warmth: 98
        },
        'care-garden-unity': {
            title: 'Заботливая Хранительница Сада',
            icon: '🌿💕',
            description: 'Твой сад - место семейного единства. Твоя миссия - создавать пространство для общения. Твое секретное умение - превращать сад в место силы.',
            wisdom: 91,
            warmth: 96
        },
        'love-cook-tradition': {
            title: 'Любящая Традиционалистка',
            icon: '💖🍛',
            description: 'Твоя любовь сохраняет семейные традиции. Твоя миссия - наполнять дом любовью через кулинарию. Твое секретное умение - готовить с такой любовью, что еда лечит.',
            wisdom: 90,
            warmth: 100
        },
        'love-story-warmth': {
            title: 'Любящая Сказительница',
            icon: '💖📚',
            description: 'Твои истории наполнены любовью и теплом. Твоя миссия - согревать сердца историями. Твое секретное умение - рассказывать так, что слушатели чувствуют любовь.',
            wisdom: 93,
            warmth: 99
        },
        'love-teach-unity': {
            title: 'Любящая Наставница',
            icon: '💖🎨',
            description: 'Ты учишь с любовью и объединяешь семью. Твоя миссия - создавать моменты единения через творчество. Твое секретное умение - видеть таланты в каждом.',
            wisdom: 92,
            warmth: 98
        },
        'love-garden-harmony': {
            title: 'Любящая Садовница',
            icon: '💖🌻',
            description: 'Твой сад - проявление любви к природе. Твоя миссия - учить любить и ценить природу. Твое секретное умение - создавать гармонию в саду и в семье.',
            wisdom: 91,
            warmth: 97
        },
        'support-cook-warmth': {
            title: 'Поддерживающая Кормилица',
            icon: '✨🍲',
            description: 'Твоя поддержка приходит через вкусную еду. Твоя миссия - поддерживать силы семьи питанием. Твое секретное умение - готовить блюда, которые дают силы.',
            wisdom: 89,
            warmth: 98
        },
        'support-story-unity': {
            title: 'Поддерживающая Хранительница',
            icon: '✨📖',
            description: 'Твои истории поддерживают семейные узы. Твоя миссия - укреплять связь поколений. Твое секретное умение - находить истории, которые объединяют.',
            wisdom: 94,
            warmth: 96
        },
        'support-teach-harmony': {
            title: 'Поддерживающая Учительница',
            icon: '✨🎨',
            description: 'Ты поддерживаешь через обучение ремеслам. Твоя миссия - дарить уверенность через умения. Твое секретное умение - замечать успехи каждого.',
            wisdom: 92,
            warmth: 95
        },
        'support-garden-tradition': {
            title: 'Поддерживающая Садовница',
            icon: '✨🌿',
            description: 'Твой сад поддерживает семейные традиции. Твоя миссия - создавать традиции в саду. Твое секретное умение - передавать любовь к земле.',
            wisdom: 90,
            warmth: 94
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
        
        document.getElementById('result-title').textContent = `${role.title}`;
        document.getElementById('result-icon').textContent = role.icon;
        
        const description = document.querySelector('.result-description');
        description.innerHTML = `
            <p><strong>Твоя сверхспособность:</strong> ${role.description.split('. ')[0]}.</p>
            <p><strong>Твоя миссия:</strong> ${role.description.split('. ')[1]}.</p>
            <p><strong>Секретное умение:</strong> ${role.description.split('. ')[2]}</p>
        `;
        
        setTimeout(() => {
            document.getElementById('cringe-level').style.width = `${role.wisdom}%`;
            document.getElementById('spirit-level').style.width = `${role.warmth}%`;
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
        "С НОВЫМ ГОДОМ, БАБУЛЯ!",
        "ЛУЧШАЯ БАБУШКА НА СВЕТЕ",
        "СПАСИБО ЗА ВСЁ, БАБУЛЕЧКА",
        "2026 - ГОД НАШЕЙ БАБУШКИ",
        "БАБУШКИНА ЛЮБОВЬ БЕЗГРАНИЧНА",
        "ТЫ - МОЁ ВДОХНОВЕНИЕ",
        "САМАЯ МУДРАЯ И ДОБРАЯ",
        "БАБУШКА - МОЯ СУПЕРГЕРОИНЯ",
        "БЕСКОНЕЧНАЯ БЛАГОДАРНОСТЬ",
        "БАБУШКИНЫ ОБЪЯТИЯ ЛЕЧАТ"
    ];
    
    const randomBottomTexts = [
        "Я ТЕБЯ ОЧЕНЬ ЛЮБЛЮ!",
        "СПАСИБО ЗА ТВОЮ МУДРОСТЬ",
        "ТЫ - САМОЕ ЦЕННОЕ В МОЕЙ ЖИЗНИ",
        "2026 БУДЕТ ЛУЧШИМ ГОДОМ",
        "БАБУШКИНА УЛЫБКА - МОЁ СЧАСТЬЕ",
        "ТЫ ВСЕГДА БЫЛА РЯДОМ",
        "СПАСИБО ЗА ТВОИ ИСТОРИИ",
        "Я ГОРЖУСЬ ТОБОЙ, БАБУЛЯ",
        "ТВОЯ МУДРОСТЬ НАУЧИЛА МЕНЯ",
        "ЛЮБЛЮ ТЕБЯ БЕЗГРАНИЧНО"
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
        
        showMemeNotification('Готово! Создавайте новый мем для бабушки!');
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