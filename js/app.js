// ===== MOTOR DO ISLAM M BOT =====
// Não precisa mexer aqui. Edite os arquivos JSON em knowledge/

const App = {
    chatBox: null,
    userInput: null,
    loading: null,
    sendBtn: null,
    
    init() {
        this.chatBox = document.getElementById('chatBox');
        this.userInput = document.getElementById('userInput');
        this.loading = document.getElementById('loading');
        this.sendBtn = document.getElementById('sendBtn');
        
        // Carrega conhecimento e inicia
        KnowledgeBase.loadAll().then(() => {
            this.addMessage(this.getWelcomeMessage(), true);
        });
        
        // Eventos
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },
    
    getWelcomeMessage() {
        return `<strong>Assalamu Alaikum! 👋</strong><br><br>
        Sou seu assistente sobre Islam. Conhecimento carregado: 
        <strong>${KnowledgeBase.faq.entries?.length || 0}</strong> FAQs, 
        <strong>${KnowledgeBase.hadiths.entries?.length || 0}</strong> Hadiths, 
        <strong>${KnowledgeBase.duas.entries?.length || 0}</strong> Duãs.<br><br>
        Use os botões rápidos ou digite sua pergunta!`;
    },
    
    getTime() {
        return new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit', 
            minute: '2-digit'
        });
    },
    
    addMessage(text, isBot) {
        const div = document.createElement('div');
        div.className = `message ${isBot ? 'bot' : 'user'}`;
        div.innerHTML = `${text}<div class="time">${this.getTime()}</div>`;
        div.style.animation = 'fadeIn 0.3s ease';
        this.chatBox.appendChild(div);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    },
    
    showLoading(show) {
        this.loading.classList.toggle('show', show);
        this.sendBtn.disabled = show;
    },
    
    // ===== PROCESSADOR DE COMANDOS =====
    
    async processCommand(text) {
        const cmd = text.toLowerCase().trim();
        const lower = cmd;
        
        // Comandos diretos de tópicos
        if (cmd.startsWith('/')) {
            const topic = KnowledgeBase.findTopic(cmd);
            if (topic) {
                return `<strong>${topic.title}</strong><br><br>${topic.content}`;
            }
        }
        
        // Alcorão (API online)
        if (cmd.startsWith('/quran')) {
            return await this.handleQuran(cmd);
        }
        
        // Salat (API online)
        if (cmd.startsWith('/salat')) {
            return await this.handleSalat(cmd);
        }
        
        // Hadith
        if (cmd === '/hadith') {
            const h = KnowledgeBase.getRandomHadith();
            return `📜 <strong>HADITH</strong><br><br>
            📝 <em>${h.narrador}</em><br>
            📚 ${h.fonte}<br><br>
            ❝ ${h.texto} ❞`;
        }
        
        // Duã
        if (cmd === '/dua') {
            const d = KnowledgeBase.getRandomDua();
            return `🤲 <strong>${d.nome.toUpperCase()}</strong><br>
            📌 ${d.contexto}<br><br>
            <div class="verse-arabic">${d.arabe}</div>
            <em>${d.transliteracao}</em><br><br>
            🇧🇷 ${d.portugues}`;
        }
        
        // Ajuda
        if (cmd === '/ajuda' || cmd === '/help') {
            return this.getHelp();
        }
        
        // Busca em FAQ
        const faq = KnowledgeBase.findFAQ(lower);
        if (faq) {
            return `<strong>${faq.response.title}</strong><br><br>
            ${faq.response.content}
            ${faq.response.source ? `<br><br><em>📖 ${faq.response.source}</em>` : ''}`;
        }
        
        // Busca em custom
        const custom = KnowledgeBase.findCustom(lower);
        if (custom) {
            return `<strong>${custom.title}</strong><br><br>${custom.content}`;
        }
        
        // Não encontrou
        return `🤔 Não entendi bem. Tente:<br><br>
        • <code>/ajuda</code> para ver comandos<br>
        • Perguntar "O que é o Islam?"<br>
        • <code>/quran 2:255</code> para ler o Alcorão`;
    },
    
    async handleQuran(cmd) {
        const parts = cmd.split(' ');
        if (parts.length < 2) {
            return `📖 <strong>ALCORÃO</strong><br><br>
            Use: <code>/quran [surata:versículo]</code><br>
            Exemplos: <code>/quran 2:255</code>, <code>/quran 1:1</code>`;
        }
        
        const [surah, ayah] = parts[1].split(':').map(Number);
        if (!surah || !ayah) {
            return '❌ Formato inválido. Use: <code>/quran 2:255</code>';
        }
        
        this.showLoading(true);
        const result = await this.fetchQuranAPI(surah, ayah);
        this.showLoading(false);
        
        return result;
    },
    
    async fetchQuranAPI(surah, ayah) {
        try {
            const r = await fetch(
                `https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${surah}:${ayah}`
            );
            const data = await r.json();
            const arabic = data.verses[0]?.text_uthmani || '';
            
            // Tenta tradução
            let trans = '';
            for (const tid of [92, 131]) {
                try {
                    const tr = await fetch(
                        `https://api.quran.com/api/v4/quran/translations/${tid}?verse_key=${surah}:${ayah}`
                    );
                    const td = await tr.json();
                    trans = td.translations[0]?.text?.replace(/<[^>]*>/g, '') || '';
                    if (trans) break;
                } catch(e) {}
            }
            
            return `📖 <strong>Alcorão ${surah}:${ayah}</strong><br><br>
            <div class="verse-arabic">${arabic}</div>
            <strong>🇧🇷 Tradução:</strong><br>${trans || 'Não disponível'}<br><br>
            <em>🌐 quran.com</em>`;
            
        } catch(e) {
            return '⚠️ Erro ao buscar versículo. Verifique sua conexão.';
        }
    },
    
    async handleSalat(cmd) {
        const parts = cmd.split(' ');
        const city = parts.length > 1 ? parts.slice(1).join(' ') : 'Sao Paulo';
        
        this.showLoading(true);
        const result = await this.fetchSalatAPI(city);
        this.showLoading(false);
        
        return result;
    },
    
    async fetchSalatAPI(city) {
        try {
            const r = await fetch(
                `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Brazil&method=2`
            );
            const data = await r.json();
            
            if (data.code !== 200) throw new Error();
            
            const t = data.data.timings;
            return `🕌 <strong>HORÁRIOS DE ORAÇÃO</strong><br>
            📍 ${city}<br><br>
            <div class="prayer-time">
                <div class="prayer-item"><div class="prayer-name">🌅 Fajr</div><div class="prayer-hour">${t.Fajr}</div></div>
                <div class="prayer-item"><div class="prayer-name">☀️ Dhuhr</div><div class="prayer-hour">${t.Dhuhr}</div></div>
                <div class="prayer-item"><div class="prayer-name">🌤️ Asr</div><div class="prayer-hour">${t.Asr}</div></div>
                <div class="prayer-item"><div class="prayer-name">🌇 Maghrib</div><div class="prayer-hour">${t.Maghrib}</div></div>
                <div class="prayer-item"><div class="prayer-name">🌙 Isha</div><div class="prayer-hour">${t.Isha}</div></div>
            </div>
            <em>🌐 aladhan.com</em>`;
            
        } catch(e) {
            return '⚠️ Erro ao buscar horários. Tente novamente.';
        }
    },
    
    getHelp() {
        const topics = KnowledgeBase.topics.entries || [];
        const topicCommands = topics.map(t => `• <code>${t.command}</code> — ${t.title.replace(/<[^>]*>/g, '')}`).join('<br>');
        
        return `📋 <strong>COMANDOS DISPONÍVEIS</strong><br><br>
        <strong>📖 Alcorão (online):</strong><br>
        • <code>/quran 2:255</code> — Versículo<br><br>
        <strong>🕌 Oração (online):</strong><br>
        • <code>/salat [cidade]</code> — Horários<br><br>
        <strong>📚 Conhecimento:</strong><br>
        • <code>/hadith</code> — Hadith aleatório<br>
        • <code>/dua</code> — Súplica com árabe<br><br>
        <strong>📂 Tópicos:</strong><br>
        ${topicCommands}<br><br>
        <strong>💬 FAQ:</strong><br>
        • "O que é o Islam?"<br>
        • "Quem é o profeta?"<br>
        • "Os muçulmanos creem em Jesus?"<br>
        • "O Islam manda matar?"<br>
        • "Os 5 pilares"`;
    },
    
    // ===== INTERFACE =====
    
    async sendMessage() {
        const text = this.userInput.value.trim();
        if (!text) return;
        
        this.addMessage(text, false);
        this.userInput.value = '';
        
        const response = await this.processCommand(text);
        this.addMessage(response, true);
    },
    
    sendQuick(text) {
        this.userInput.value = text;
        this.sendMessage();
    }
};

// Inicia quando DOM carregar
document.addEventListener('DOMContentLoaded', () => App.init());
