const App = {
    chatBox: null,
    userInput: null,
    loading: null,
    sendBtn: null,
    
    surahNames: {
        1: "Al-Fatiha (A Abertura)",
        2: "Al-Baqarah (A Vaca)",
        3: "Ali 'Imran",
        4: "An-Nisa",
        5: "Al-Ma'idah",
        6: "Al-An'am",
        7: "Al-A'raf",
        8: "Al-Anfal",
        9: "At-Tawbah",
        10: "Yunus",
        11: "Hud",
        12: "Yusuf",
        13: "Ar-Ra'd",
        14: "Ibrahim",
        15: "Al-Hijr",
        16: "An-Nahl",
        17: "Al-Isra",
        18: "Al-Kahf",
        19: "Maryam",
        20: "Taha",
        21: "Al-Anbiya",
        22: "Al-Hajj",
        23: "Al-Mu'minun",
        24: "An-Nur",
        25: "Al-Furqan",
        26: "Ash-Shu'ara",
        27: "An-Naml",
        28: "Al-Qasas",
        29: "Al-'Ankabut",
        30: "Ar-Rum",
        31: "Luqman",
        32: "As-Sajdah",
        33: "Al-Ahzab",
        34: "Saba",
        35: "Fatir",
        36: "Ya-Sin",
        37: "As-Saffat",
        38: "Sad",
        39: "Az-Zumar",
        40: "Ghafir",
        41: "Fussilat",
        42: "Ash-Shura",
        43: "Az-Zukhruf",
        44: "Ad-Dukhan",
        45: "Al-Jathiyah",
        46: "Al-Ahqaf",
        47: "Muhammad",
        48: "Al-Fath",
        49: "Al-Hujurat",
        50: "Qaf",
        51: "Adh-Dhariyat",
        52: "At-Tur",
        53: "An-Najm",
        54: "Al-Qamar",
        55: "Ar-Rahman",
        56: "Al-Waqi'ah",
        57: "Al-Hadid",
        58: "Al-Mujadilah",
        59: "Al-Hashr",
        60: "Al-Mumtahanah",
        61: "As-Saff",
        62: "Al-Jumu'ah",
        63: "Al-Munafiqun",
        64: "At-Taghabun",
        65: "At-Talaq",
        66: "At-Tahrim",
        67: "Al-Mulk",
        68: "Al-Qalam",
        69: "Al-Haqqah",
        70: "Al-Ma'arij",
        71: "Nuh",
        72: "Al-Jinn",
        73: "Al-Muzzammil",
        74: "Al-Muddaththir",
        75: "Al-Qiyamah",
        76: "Al-Insan",
        77: "Al-Mursalat",
        78: "An-Naba'",
        79: "An-Nazi'at",
        80: "'Abasa",
        81: "At-Takwir",
        82: "Al-Infitar",
        83: "Al-Mutaffifin",
        84: "Al-Inshiqaq",
        85: "Al-Buruj",
        86: "At-Tariq",
        87: "Al-A'la",
        88: "Al-Ghashiyah",
        89: "Al-Fajr",
        90: "Al-Balad",
        91: "Ash-Shams",
        92: "Al-Layl",
        93: "Ad-Duha",
        94: "Ash-Sharh",
        95: "At-Tin",
        96: "Al-'Alaq",
        97: "Al-Qadr",
        98: "Al-Bayyinah",
        99: "Az-Zalzalah",
        100: "Al-'Adiyat",
        101: "Al-Qari'ah",
        102: "At-Takathur",
        103: "Al-'Asr",
        104: "Al-Humazah",
        105: "Al-Fil",
        106: "Quraysh",
        107: "Al-Ma'un",
        108: "Al-Kawthar",
        109: "Al-Kafirun",
        110: "An-Nasr",
        111: "Al-Masad",
        112: "Al-Ikhlas",
        113: "Al-Falaq",
        114: "An-Nas"
    },
    
    init() {
        this.chatBox = document.getElementById('chatBox');
        this.userInput = document.getElementById('userInput');
        this.loading = document.getElementById('loading');
        this.sendBtn = document.getElementById('sendBtn');
        
        this.addMessage(this.getWelcomeMessage(), true);
    },
    
    getWelcomeMessage() {
        return `<strong>Assalamu Alaikum! 👋</strong><br><br>
        Digite qualquer versículo do Alcorão:<br>
        • <code>alcorão 1:1</code><br>
        • <code>alcorão 2:255</code><br>
        • <code>alcorão 112:1-4</code><br>
        • <code>surata 36</code>`;
    },
    
    getTime() {
        return new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
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
    
    toArabicNumber(num) {
        const digits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        return num.toString().split('').map(d => digits[parseInt(d)] || d).join('');
    },
    
    // ========== BUSCA ALCORÃO NA WEB ==========
    
    async fetchQuranVerse(surah, ayah) {
        try {
            // Busca árabe
            const arabicRes = await fetch(
                `https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${surah}:${ayah}`
            );
            const arabicData = await arabicRes.json();
            const arabic = arabicData.verses?.[0]?.text_uthmani || '';
            
            // Busca tradução português
            let translation = '';
            try {
                const ptRes = await fetch(
                    `https://api.quran.com/api/v4/quran/translations/92?verse_key=${surah}:${ayah}`
                );
                const ptData = await ptRes.json();
                translation = ptData.translations?.[0]?.text?.replace(/<[^>]*>/g, '').trim() || '';
            } catch(e) {
                // Fallback inglês
                const enRes = await fetch(
                    `https://api.quran.com/api/v4/quran/translations/131?verse_key=${surah}:${ayah}`
                );
                const enData = await enRes.json();
                translation = enData.translations?.[0]?.text?.replace(/<[^>]*>/g, '').trim() || '';
            }
            
            return { arabic, translation: translation || '[Tradução não disponível]' };
            
        } catch(e) {
            return null;
        }
    },
    
    async fetchSurahInfo(surah) {
        try {
            const res = await fetch(`https://api.quran.com/api/v4/chapters/${surah}`);
            const data = await res.json();
            return data.chapter;
        } catch(e) {
            return null;
        }
    },
    
    // ========== PROCESSADOR ==========
    
    async processCommand(text) {
        const cmd = text.toLowerCase().trim();
        
        // Detecta: alcorão X:Y, alcorão X:Y-Z, surata X, X:Y
        const match = cmd.match(/(?:alcor[ãa]o|cor[ãa]o|quran|sur[áa]ta?)\s*(\d+)(?::(\d+))?(?:-(\d+))?/i) 
                   || cmd.match(/^(\d+):(\d+)(?:-(\d+))?$/);
        
        if (match) {
            const surah = parseInt(match[1]);
            let start = match[2] ? parseInt(match[2]) : 1;
            let end = match[3] ? parseInt(match[3]) : (match[2] ? start : 10);
            
            if (surah < 1 || surah > 114) return '❌ Surata deve ser entre 1 e 114.';
            if (start < 1) start = 1;
            if (end - start > 19) end = start + 19; // Máximo 20 versículos
            
            this.showLoading(true);
            
            const chapterInfo = await this.fetchSurahInfo(surah);
            const verses = [];
            
            for (let a = start; a <= end; a++) {
                const v = await this.fetchQuranVerse(surah, a);
                if (v) verses.push({ayah: a, ...v});
            }
            
            this.showLoading(false);
            
            if (verses.length === 0) {
                return '⚠️ Erro ao buscar. Verifique sua conexão.';
            }
            
            // Formata resposta
            const name = this.surahNames[surah] || `Surata ${surah}`;
            const total = chapterInfo?.verses_count || '';
            
            let html = `<div style="background:rgba(16,185,129,0.15);padding:10px 15px;border-radius:8px;margin-bottom:15px;">`;
            html += `📖 <strong>ALCORÃO ${surah}</strong><br>`;
            html += `<strong>${name}</strong>${total ? ` <em>(${total} versículos)</em>` : ''}`;
            html += `</div>`;
            
            for (const v of verses) {
                const numAr = this.toArabicNumber(v.ayah);
                html += `<div class="verse-arabic" style="font-family:'Traditional Arabic',serif;font-size:1.5rem;line-height:2;text-align:right;direction:rtl;margin:10px 0;padding:15px;background:rgba(0,0,0,0.2);border-radius:10px;">`;
                html += `<span style="color:#10b981;">﴿${numAr}﴾</span> ${v.arabic}`;
                html += `</div>`;
                html += `<div style="margin:5px 0 20px 0;padding-left:12px;border-left:3px solid #10b981;">`;
                html += `<strong>[${v.ayah}]</strong> ${v.translation}`;
                html += `</div>`;
            }
            
            html += `<em style="color:#a8e6cf;font-size:0.85rem;">🌐 quran.com</em>`;
            return html;
        }
        
        // Outros comandos (mantenha os que você já tem)
        if (cmd === '/salat') return await this.handleSalat('Sao Paulo');
        if (cmd.startsWith('/salat ')) return await this.handleSalat(cmd.slice(7));
        if (cmd === '/hadith') return this.handleHadith();
        if (cmd === '/dua') return this.handleDua();
        if (cmd === '/ajuda') return this.getHelp();
        
        return `🤔 Tente: <code>alcorão 1:1</code> ou <code>alcorão 2:255</code>`;
    },
    
    async handleSalat(city) {
        this.showLoading(true);
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Brazil&method=2`);
            const data = await res.json();
            const t = data.data.timings;
            this.showLoading(false);
            return `🕌 <strong>Salat - ${city}</strong><br>🌅 ${t.Fajr} | ☀️ ${t.Dhuhr} | 🌤️ ${t.Asr} | 🌇 ${t.Maghrib} | 🌙 ${t.Isha}`;
        } catch(e) {
            this.showLoading(false);
            return '⚠️ Erro ao buscar horários.';
        }
    },
    
    handleHadith() {
        const h = [
            {n: 'Umar ibn al-Khattab', f: 'Sahih al-Bukhari', t: 'Um homem perguntou: "Informe-me sobre o Islam." O Profeta ﷺ respondeu: "Testemunhes que não há divindade exceto Allah e que Muhammad é o Mensageiro de Allah..."'},
            {n: 'Abu Hurairah', f: 'Sahih Muslim', t: 'O Mensageiro de Allah ﷺ disse: "Não sereis verdadeiros crentes até que tenhais misericórdia uns dos outros."'}
        ];
        const r = h[Math.floor(Math.random() * h.length)];
        return `📜 <strong>HADITH</strong><br>📝 ${r.n}<br>📚 ${r.f}<br><br>❝ ${r.t} ❞`;
    },
    
    handleDua() {
        return `🤲 <strong>DUÃ</strong><br><div style="font-family:serif;font-size:1.4rem;text-align:right;direction:rtl;margin:10px 0;">رَبِّ زِدْنِي عِلْمًا</div><em>Rabbi zidni 'ilma</em><br>🇧🇷 Meu Senhor, aumenta-me em conhecimento.`;
    },
    
    getHelp() {
        return `📋 <strong>COMANDOS</strong><br><br>
        📖 <code>alcorão X:Y</code> — Versículo<br>
        📖 <code>alcorão X:Y-Z</code> — Intervalo<br>
        📖 <code>surata X</code> — Primeiros 10<br>
        🕌 <code>/salat [cidade]</code><br>
        📜 <code>/hadith</code><br>
        🤲 <code>/dua</code>`;
    },
    
    // ========== INTERFACE ==========
    
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

document.addEventListener('DOMContentLoaded', () => App.init());
