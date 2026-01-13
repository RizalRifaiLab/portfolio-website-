// ===== GROQ API CONFIGURATION =====
// const GROQ_API_KEY = '...'; // Key is handled in server.js
const GROQ_API_URL = '/api/chat';

console.log("Script starting...");

// ===== IMAGE PATHS =====
const images = {
    profile: '/assets/images/profile.png',
    mapJakarta: '/assets/images/map_jakarta.png',
    friends: '/assets/images/friends.png'
};

// ===== PORTFOLIO CONTEXT FOR AI =====
const portfolioContext = `
You are an AI assistant for Muhammad Rizal Rifai's portfolio website. You speak in first person AS Rizal (use "I", "my", "me").
Be friendly, professional, and conversational. Keep responses concise but informative.
If asked about topics not related to Rizal, politely redirect to portfolio topics.

===== IMAGES YOU CAN USE =====
You can include images in your response using markdown syntax: ![Alt Text](path/to/image)
- My Profile Photo: ![Rizal Profile](${images.profile})
- Jakarta Location Map: ![Jakarta Map](${images.mapJakarta})
- Friends: ![Friends](${images.friends})
Use these images when relevant:
1. If asked about "me", "who are you", or "profile", show my profile photo.
2. If asked about "location", "where I live", or "map", show the Jakarta map.
3. If asked about "friends", show the Friends image.
4. If asked about "contact", "email", "whatsapp", or "linkedin", include [CONTACT_BUTTONS] at the end of your response.

===== RIZAL'S INFORMATION =====

**Personal Info:**
- Name: Muhammad Rizal Rifai (nickname: Rizal)
- Role: Software Engineer specializing in ML & AI platforms
- Location: Jakarta, Indonesia
- Email: rizalrifai044@gmail.com
- Phone: +62 821 3715 0733
- LinkedIn: https://www.linkedin.com/in/muhammad-rizal-rifai-11b71a152/

**Summary:**
Software Engineer specializing in building scalable backend systems for ML & AI platforms. 
Proven experience in designing and deploying high-throughput RESTful APIs, architecting MLOps pipelines, 
and optimizing large-scale distributed systems (managing 68M+ documents and 200K+ daily transactions).
Passionate about bridging backend development with AI solutions to deliver efficient, data-driven applications.

**Education:**
- Bachelor of Computer Science, Diponegoro University (March 2023)
- Cumulative GPA: 3.68/4.0
- Location: Semarang, Indonesia

**Certification:**
- TensorFlow Developer Certificate (Google)

**Work Experience:**

1. Software Engineer at PLN Icon Plus (January 2024 - Present) - Jakarta, ID
   - Developed and maintained 100+ RESTful APIs in Spring Boot for HCS, PLTS, and GEAS projects
   - Designed scalable ETL data pipelines for data synchronization across systems
   - Reduced query time by 70% through table partitioning and materialized view optimizations
   - Led development of AIL (Arsip Induk Layanan) system managing 68M+ documents with 100K-200K daily transactions
   - Led cross-functional coordination and full-cycle system management
   - Tools: Spring Boot, PostgreSQL, Selenium, GitLab, Figma, Linux Cron, REST API, Python

2. AI Engineer at PT Meister Sinergi Indonesia (May 2023 - December 2023) - Bandung, ID
   - Architected MLOps pipelines for automated model training, versioning (DVC), and deployment (Kubeflow)
   - Researched and deployed 5+ production-ready ML models
   - Improved team productivity by 20% through automated data preparation workflows
   - Tools: Python, TensorFlow, PyTorch, Kubeflow, Docker, DVC, Git

3. AI Engineer Intern at PT Nodeflux Teknologi Indonesia (February 2022 - July 2022) - Jakarta, ID
   - Developed end-to-end ML software for computer vision (object detection, segmentation)
   - Accelerated annotation processes by 5x
   - Trained EfficientDet models for vehicle detection, achieving 89% mAP
   - Containerized ML models using Docker, deployed to Kubernetes-based serverless platform
   - Reduced cloud deployment costs by 15%
   - Tools: Python, Streamlit, TensorFlow, PyTorch, Flask, Docker, DVC, FiftyOne

**Technical Skills:**
- Programming Languages: Python , Java, SQL, JavaScript/TypeScript, Golang
- Backend & Data: Spring Boot, PostgreSQL, Docker, ETL, Git, Linux Cron, Quarkus
- ML Frameworks: TensorFlow, PyTorch, Keras, Scikit-learn, OpenCV
- Cloud & Deployment: Docker, Kubernetes, Kubeflow
- Tools: DVC, FiftyOne, Selenium, GitLab

**Key Achievements:**
- Managed systems with 68M+ customer documents
- Handled 200K+ daily transactions
- Developed 100+ RESTful APIs
- Achieved 89% mAP on vehicle detection models
- Reduced query time by 70%
- Reduced cloud costs by 15%
- Improved team productivity by 20%

**Projects:**
1. AIL System - Large-scale document management system handling 68M+ documents with 100K-200K daily transactions
2. MLOps Pipeline - Automated ML training, versioning, and deployment system
3. Data Annotation Automation - End-to-end ML software for object detection and segmentation

===== RESPONSE GUIDELINES =====
- Always respond AS Rizal (first person)
- Be friendly and approachable
- Highlight relevant achievements when appropriate
- Keep responses focused and not too long (2-4 paragraphs max)
- Use emojis sparingly for personality
- If asked to contact, direct them to the buttons below (do not list email/linkedin in text)
- For technical questions, showcase relevant skills and experience
`;

// ===== CONTACT BUTTONS HTML =====
const contactButtonsHTML = `
<div class="contact-buttons-container">
    <a href="mailto:rizalrifai044@gmail.com" class="contact-btn btn-email" target="_blank">
        <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        Email
    </a>
    <a href="https://wa.me/6282137150733" class="contact-btn btn-whatsapp" target="_blank">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
    </a>
    <a href="https://www.linkedin.com/in/muhammad-rizal-rifai-11b71a152/" class="contact-btn btn-linkedin" target="_blank">
        <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        LinkedIn
    </a>
</div>
`;

// ===== FALLBACK RESPONSES =====
const fallbackResponses = {
    greeting: `Hey there! 👋 I'm Rizal, a Software Engineer based in Jakarta, Indonesia. I specialize in building scalable backend systems for ML & AI platforms. What would you like to know about me?\n\n![Rizal Profile](${images.profile})`,
    about: `I'm a Software Engineer specializing in ML & AI platforms. I graduated from Diponegoro University with a B.S. in Computer Science (GPA: 3.68) and hold a TensorFlow Developer Certificate. I've managed systems handling 68M+ documents and 200K+ daily transactions! 🚀\n\n![Rizal Profile](${images.profile})`,
    experience: "I've worked at three amazing companies:\n\n• **PLN Icon Plus** (2024-Present) - Software Engineer developing 100+ APIs and managing 68M+ documents\n• **PT Meister Sinergi** (2023) - AI Engineer building MLOps pipelines\n• **PT Nodeflux** (2022) - AI Engineer Intern working on computer vision",
    skills: "My technical skills include:\n• **Languages:** Python (Advanced), Java, SQL, JavaScript, Golang\n• **Backend:** Spring Boot, PostgreSQL, REST APIs, ETL\n• **ML/AI:** TensorFlow, PyTorch, Keras, OpenCV\n• **DevOps:** Docker, Kubernetes, Kubeflow",
    projects: `I've worked on some exciting projects:\n\n• **AIL System** - Large-scale document management handling 68M+ documents with 100K-200K daily transactions\n\n• **MLOps Pipeline** - Automated ML training, versioning (DVC), and deployment (Kubeflow)\n\n• **Computer Vision Tool** - End-to-end ML software for object detection and segmentation, accelerating annotation by 5x`,
    contact: `You can reach me via the buttons below:\n\nI'm based in Jakarta, Indonesia:\n![Jakarta Map](${images.mapJakarta})\n\n[CONTACT_BUTTONS]`,
    fallback: "Sorry, I think the model limit has been reached. If your question is not covered by the quick questions, feel free to reach me via my contact info."
};

// ===== FUNCTIONS =====

function getFallbackResponse(input) {
    const text = input.toLowerCase();
    if (/^(hi|hello|hey|yo|sup|greetings)/i.test(text)) return fallbackResponses.greeting;
    if (/project|portfolio|built|build|create|made/.test(text)) return fallbackResponses.projects;
    if (/who|about|yourself|introduce|background|bio/.test(text)) return fallbackResponses.about;
    if (/experience|work|job|career|company|worked/.test(text)) return fallbackResponses.experience;
    if (/skill|technology|tech|stack|programming|language/.test(text)) return fallbackResponses.skills;
    if (/contact|email|phone|linkedin|reach|hire|map|location|where/.test(text)) return fallbackResponses.contact;
    return fallbackResponses.fallback;
}

async function callGroqAPI(userMessage) {
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: portfolioContext },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 800,
                top_p: 0.95
            })
        });

        if (!response.ok) throw new Error('API error: ' + response.status);

        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Groq API error:', error);
        return null;
    }
}

function formatResponse(text) {
    let formatted = text
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="chat-image">')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^• /gm, '<li>')
        .replace(/^- /gm, '<li>');

    if (!formatted.startsWith('<') && !formatted.startsWith('<img')) {
        formatted = '<p>' + formatted + '</p>';
    }

    if (formatted.includes('[CONTACT_BUTTONS]')) {
        formatted = formatted.replace('[CONTACT_BUTTONS]', contactButtonsHTML);
    }
    return formatted;
}

function addMessage(content, isUser) {
    const chatMessages = document.getElementById('chat-messages');
    isUser = isUser || false;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isUser ? 'user' : 'ai');

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    if (isUser) {
        avatarDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
    } else {
        avatarDiv.innerHTML = 'MR';
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    if (isUser) {
        bubbleDiv.textContent = content;
    } else {
        bubbleDiv.innerHTML = formatResponse(content);
    }

    contentDiv.appendChild(bubbleDiv);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll container directly

    return messageDiv;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.id = 'typing-indicator';
    messageDiv.innerHTML = '<div class="message-avatar">MR</div><div class="message-content"><div class="message-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>';
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

async function processInput(input) {
    if (!input.trim()) return;

    // Trigger transition from landing mode to chat mode
    if (document.body.classList.contains('landing-mode')) {
        document.body.classList.remove('landing-mode');
        window.dispatchEvent(new Event('resize'));
    }

    // Add user message
    addMessage(input, true);

    // Clear input
    const userInput = document.getElementById('user-input');
    if (userInput) userInput.value = '';

    // Show typing indicator
    addTypingIndicator();

    // Try Groq API first
    let response = await callGroqAPI(input);

    // If API fails, use fallback
    if (!response) {
        console.log('Using fallback response');
        response = getFallbackResponse(input);
    }

    // Remove typing indicator and show response
    removeTypingIndicator();
    addMessage(response, false);
}


// ===== DOM & EVENTS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded");
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickButtons = document.querySelectorAll('.quick-btn');
    const toggleQuestionsBtn = document.getElementById('toggle-questions');
    const quickButtonsContainer = document.getElementById('quick-buttons');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme Toggle
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    function getTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return prefersDark.matches ? 'dark' : 'light';
    }
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
    setTheme(getTheme());
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // Event Listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', function () {
            if (userInput) processInput(userInput.value);
        });
    }

    if (userInput) {
        userInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                processInput(userInput.value);
            }
        });
    }

    quickButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const topic = btn.dataset.topic;
            const questionMap = {
                'about': 'Tell me about yourself',
                'experience': 'What is your work experience?',
                'skills': 'What are your technical skills?',
                'projects': 'Tell me about your projects',
                'contact': 'How can I contact you?'
            };
            processInput(questionMap[topic]);
        });
    });

    if (toggleQuestionsBtn && quickButtonsContainer) {
        let questionsVisible = true;
        toggleQuestionsBtn.addEventListener('click', function () {
            questionsVisible = !questionsVisible;
            if (questionsVisible) {
                quickButtonsContainer.classList.remove('hidden');
                toggleQuestionsBtn.textContent = 'Hide';
            } else {
                quickButtonsContainer.classList.add('hidden');
                toggleQuestionsBtn.textContent = 'Show';
            }
        });
    }

    // Initial Greeting
    // Initial Greeting removed as per user request
    // The previous code caused a ReferenceError because 'greeting' was commented out.
    // We now just wait for the user to initiate the chat.

    // Landing Page Effects
    initCursorEffect();
    initAvatarEffect();
    initTransitionLogic();
});

// ===== EFFECTS =====

function initCursorEffect() {
    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor(x, y, hue) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 15 + 5;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${hue}, 100%, 50%)`;
            this.life = 1.0;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size *= 0.95;
            this.life -= 0.02;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
    }

    let hue = 0;
    window.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(e.clientX, e.clientY, hue));
        }
        hue += 2;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0 || particles[i].size <= 0.5) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function initAvatarEffect() {
    const avatar = document.getElementById('hero-avatar');
    const container = document.getElementById('avatar-container');
    if (!avatar || !container) return;

    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        avatar.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        avatar.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
}

function initTransitionLogic() {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickBtns = document.querySelectorAll('.quick-btn');

    function startChat() {
        if (document.body.classList.contains('landing-mode')) {
            document.body.classList.remove('landing-mode');
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                setTimeout(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 100);
            }
            // Trigger resize for 3D canvas
            window.dispatchEvent(new Event('resize'));
        }
    }

    if (sendBtn) sendBtn.addEventListener('click', startChat);
    if (userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startChat();
    });
    quickBtns.forEach(btn => {
        btn.addEventListener('click', startChat);
    });
}

// function initTransitionLogic() {
//     const userInput = document.getElementById('user-input');
//     const sendBtn = document.getElementById('send-btn');
//     const quickBtns = document.querySelectorAll('.quick-btn');

//     function startChat() {
//         console.log('🚀 startChat called!');
//         console.log('Body has landing-mode?', document.body.classList.contains('landing-mode'));

//         if (document.body.classList.contains('landing-mode')) {
//             console.log('✅ Removing landing-mode class...');
//             document.body.classList.remove('landing-mode');
//             console.log('After removal:', document.body.classList.contains('landing-mode'));

//             const chatContainer = document.getElementById('chat-container');
//             if (chatContainer) {
//                 setTimeout(() => {
//                     chatContainer.scrollTop = chatContainer.scrollHeight;
//                 }, 100);
//             }
//         } else {
//             console.log('⚠️ landing-mode already removed!');
//         }
//     }

//     if (sendBtn) sendBtn.addEventListener('click', startChat);
//     if (userInput) userInput.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') startChat();
//     });
//     quickBtns.forEach(btn => {
//         btn.addEventListener('click', startChat);
//     });
// }



console.log("Script loaded");
