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
        this.addMessage(this.getWelcomeMessage(), true);
    },

    getWelcomeMessage() {
        return `<strong>Assalamu Alaikum! 👋</strong><br><br>
        Digite sua pergunta sobre Islam:<br>
        • <code>O que é o Islam?</code><br>
        • <code>Quem é o profeta?</code><br>
        • <code>alcorão 2:255</code><br>
        • <code>/salat Maputo</code><br>
        • <code>/hadith</code> | <code>/dua</code><br>
        • <code>/ajuda</code> — todos os comandos`;
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

    // ========== ALCORÃO VIA WEB ==========

    async fetchQuranVerse(surah, ayah) {
        try {
            const [arabicRes, transRes] = await Promise.all([
                fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${surah}:${ayah}`),
                fetch(`https://api.quran.com/api/v4/quran/translations/92?verse_key=${surah}:${ayah}`)
            ]);
            const arabicData = await arabicRes.json();
            const transData = await transRes.json();
            return {
                arabic: arabicData.verses?.[0]?.text_uthmani || '',
                translation: transData.translations?.[0]?.text?.replace(/<[^>]*>/g, '').trim() || '[Tradução não disponível]'
            };
        } catch(e) {
            return null;
        }
    },

    async fetchSurahInfo(surah) {
        try {
            const res = await fetch(`https://api.quran.com/api/v4/chapters/${surah}`);
            const data = await res.json();
            return data.chapter;
        } catch(e) { return null; }
    },

    // ========== PROCESSADOR ==========

    async processCommand(text) {
        const cmd = text.toLowerCase().trim();

        // ALCORÃO: alcorão X:Y, alcorão X:Y-Z, surata X
        const quranMatch = cmd.match(/(?:alcor[ãa]o|cor[ãa]o|quran|sur[áa]ta?)\s*(\d+)(?::(\d+))?(?:-(\d+))?/i) 
                        || cmd.match(/^(\d+):(\d+)(?:-(\d+))?$/);

        if (quranMatch) {
            const surah = parseInt(quranMatch[1]);
            let start = quranMatch[2] ? parseInt(quranMatch[2]) : 1;
            let end = quranMatch[3] ? parseInt(quranMatch[3]) : (quranMatch[2] ? start : 10);

            if (surah < 1 || surah > 114) return '❌ Surata 1-114';
            if (start < 1) start = 1;
            if (end - start > 19) end = start + 19;

            this.showLoading(true);
            const chapterInfo = await this.fetchSurahInfo(surah);
            const verses = [];

            for (let a = start; a <= end; a++) {
                const v = await this.fetchQuranVerse(surah, a);
                if (v) verses.push({ayah: a, ...v});
            }
            this.showLoading(false);

            if (verses.length === 0) return '⚠️ Erro de conexão';

            const names = {1:"Al-Fatiha",2:"Al-Baqarah",36:"Ya-Sin",112:"Al-Ikhlas"};
            const name = names[surah] || `Surata ${surah}`;

            let html = `<div style="background:rgba(16,185,129,0.15);padding:10px 15px;border-radius:8px;margin-bottom:15px;">`;
            html += `📖 <strong>ALCORÃO ${surah}</strong> — ${name}`;
            html += `</div>`;

            for (const v of verses) {
                html += `<div style="font-family:'Traditional Arabic',serif;font-size:1.5rem;line-height:2;text-align:right;direction:rtl;margin:10px 0;padding:15px;background:rgba(0,0,0,0.2);border-radius:10px;">`;
                html += `<span style="color:#10b981;">﴿${this.toArabicNumber(v.ayah)}﴾</span> ${v.arabic}`;
                html += `</div>`;
                html += `<div style="margin:5px 0 20px 0;padding-left:12px;border-left:3px solid #10b981;">`;
                html += `<strong>[${v.ayah}]</strong> ${v.translation}`;
                html += `</div>`;
            }
            html += `<em style="color:#a8e6cf;font-size:0.85rem;">🌐 quran.com</em>`;
            return html;
        }

        // COMANDOS
        if (cmd === '/quran') return `📖 <code>alcorão 2:255</code> | <code>alcorão 112:1-4</code> | <code>surata 36</code>`;
        if (cmd.startsWith('/salat')) return await this.handleSalat(cmd.slice(7).trim() || 'Maputo');
        if (cmd === '/hadith') return this.handleHadith();
        if (cmd === '/dua') return this.handleDua();
        if (cmd === '/wudhu') return this.handleWudhu();
        if (cmd === '/salat_como') return this.handleSalatComo();
        if (cmd === '/ajuda') return this.getHelp();

        // FAQ NATURAL
        return this.handleFAQ(cmd);
    },

    // ========== SALAT MOÇAMBIQUE ==========

    async handleSalat(city) {
        this.showLoading(true);
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Mozambique&method=2`);
            const data = await res.json();
            const t = data.data.timings;
            this.showLoading(false);
            return `🕌 <strong>Salat — ${city}, Moçambique</strong><br><br>
            🌅 Fajr: <strong>${t.Fajr}</strong><br>
            ☀️ Dhuhr: <strong>${t.Dhuhr}</strong><br>
            🌤️ Asr: <strong>${t.Asr}</strong><br>
            🌇 Maghrib: <strong>${t.Maghrib}</strong><br>
            🌙 Isha: <strong>${t.Isha}</strong><br><br>
            <em>🌐 aladhan.com</em>`;
        } catch(e) {
            this.showLoading(false);
            return '⚠️ Erro. Tente: <code>/salat Maputo</code>';
        }
    },

    // ========== HADITH ==========

    handleHadith() {
        const h = [
            {n:'Umar ibn al-Khattab', f:'Sahih al-Bukhari', t:'Um homem perguntou: "Informe-me sobre o Islam." O Profeta ﷺ respondeu: "Testemunhes que não há divindade exceto Allah e que Muhammad é o Mensageiro de Allah..."'},
            {n:'Abu Hurairah', f:'Sahih Muslim', t:'O Mensageiro de Allah ﷺ disse: "Não sereis verdadeiros crentes até que tenhais misericórdia uns dos outros."'}
        ];
        const r = h[Math.floor(Math.random() * h.length)];
        return `📜 <strong>HADITH</strong><br>📝 ${r.n}<br>📚 ${r.f}<br><br>❝ ${r.t} ❞`;
    },

    // ========== DUÃ ==========

    handleDua() {
        const d = {
            arabe:'رَبِّ زِدْنِي عِلْمًا',
            transliteracao:'Rabbi zidni \'ilma',
            portugues:'Meu Senhor, aumenta-me em conhecimento.'
        };
        return `🤲 <strong>DUÃ</strong><br><div style="font-family:serif;font-size:1.4rem;text-align:right;direction:rtl;margin:10px 0;">${d.arabe}</div><em>${d.transliteracao}</em><br><br>🇧🇷 ${d.portugues}`;
    },

    // ========== WUDHU ==========

    handleWudhu() {
        return `💧 <strong>WUDHU</strong><br><br>
        1️⃣ Intenção<br>2️⃣ Bismillah<br>3️⃣ Lavar mãos 3x<br>4️⃣ Enxaguar boca 3x<br>5️⃣ Lavar nariz 3x<br>6️⃣ Lavar rosto 3x<br>7️⃣ Lavar braços até cotovelos 3x<br>8️⃣ Passar mãos na cabeça<br>9️⃣ Limpar orelhas<br>🔟 Lavar pés até tornozelos 3x`;
    },

    // ========== COMO ORAR ==========

    handleSalatComo() {
        return `🙏 <strong>COMO ORAR</strong><br><br>
        1️⃣ Takbir — "Allahu Akbar"<br>2️⃣ Qiyam — Al-Fatiha + surata<br>3️⃣ Ruku' — Inclinar-se<br>4️⃣ Sujud — Prostrar-se<br>5️⃣ Julus — Sentar<br>6️⃣ Sujud novamente<br>7️⃣ Tashahhud — Testemunho<br>8️⃣ Salaam — "Assalamu alaikum"`;
    },

    // ========== FAQ — 15 PERGUNTAS ==========

    handleFAQ(cmd) {
        const c = cmd.replace(/[ãáàâä]/g,'a').replace(/[éêë]/g,'e').replace(/[íï]/g,'i').replace(/[óôõö]/g,'o').replace(/[úü]/g,'u').replace(/ç/g,'c');

        if (c.includes('o que e o islam') || c.includes('definicao')) 
            return '🌙 <strong>ISLAM</strong> = submissão à vontade de Deus. Paz através dessa submissão. Mesma mensagem desde Adão até Muhammad ﷺ.';

        if (c.includes('profeta') || c.includes('muhammad') || c.includes('maome')) 
            return '🕊️ <strong>Muhammad ﷺ</strong> — último profeta, humano não divino. Nascido em Meca em 570 d.C. Exemplo de honestidade e misericórdia.';

        if (c.includes('jesus') || c.includes('cristo') || c.includes('isa')) 
            return '✝️🤝☪️ Os muçulmanos <strong>creem em Jesus</strong>! Profeta, nasceu da Virgem Maria, realizou milagres. Mas NÃO é Deus nem foi crucificado.';

        if (c.includes('pilares')) 
            return '🕋 <strong>5 PILARES:</strong> 1) Shahada, 2) Salat, 3) Zakat, 4) Sawm, 5) Hajj';

        if (c.includes('terrorista') || c.includes('terrorismo')) 
            return '🌍 <strong>NÃO.</strong> Terroristas não representam o Islam. 1.8 bilhão vivem em paz. O Islam condena matar inocentes (Alcorão 5:32).';

        if (c.includes('matar') || c.includes('matar nao muculmanos')) 
            return '⚖️ <strong>O ISLAM NÃO MANDA MATAR.</strong> "Quem matar uma pessoa inocente... é como se tivesse matado toda a humanidade" (5:32).';

        if (c.includes('muhammad e deus') || c.includes('profeta e deus')) 
            return '❌ <strong>MUHAMMAD NÃO É DEUS.</strong> "Não sou senão um homem como vocês" (Alcorão 18:110).';

        if (c.includes('creem em') || c.includes('acreditam') || c.includes('aqeedah')) 
            return '🕌 <strong>6 ARTIGOS DE FÉ:</strong> Allah, anjos, livros revelados, profetas, Dia do Juízo, decreto divino.';

        if (c.includes('quem sao os muculmanos') || c.includes('o que e muculmano')) 
            return '🤲 <strong>MUÇULMANOS</strong> = aqueles que se submetem à vontade de Deus. 1.8 bilhão em todas as etnias.';

        if (c.includes('alcorao') || c.includes('corao') || c.includes('livro sagrado')) 
            return '📖 <strong>ALCORÃO</strong> — palavra de Deus revelada a Muhammad ﷺ. 114 suratas. Preservado em árabe. Use <code>alcorão 2:255</code>.';

        if (c.includes('wudhu') || c.includes('ablucao')) 
            return '💧 <strong>WUDHU</strong> é a purificação ritual antes da oração. Use <code>/wudhu</code> para passo a passo.';

        if (c.includes('salat') || c.includes('oracao') || c.includes('como orar')) 
            return '🙏 <strong>SALAT</strong> são as 5 orações diárias. Use <code>/salat_como</code> para aprender.';

        if (c.includes('ramadan') || c.includes('jejum')) 
            return '🌙 <strong>RAMADÃ</strong> — nono mês do calendário islâmico. Jejum do amanhecer ao pôr do sol.';

        if (c.includes('hajj') || c.includes('peregrinacao')) 
            return '🕋 <strong>HAJJ</strong> — peregrinação obrigatória a Meca, pelo menos uma vez na vida, se capaz.';

        if (c.includes('zakat') || c.includes('caridade')) 
            return '💰 <strong>ZAKAT</strong> — caridade obrigatória de 2.5% da riqueza acumulada para os pobres.';

        // Se não reconheceu
        return `🤔 Não entendi. Tente:<br>
        • <code>alcorão 2:255</code><br>
        • <code>/salat Maputo</code><br>
        • <code>O que é o Islam?</code><br>
        • <code>/ajuda</code>`;
    },

    // ========== AJUDA ==========

    getHelp() {
        return `📋 <strong>COMANDOS</strong><br><br>
        <strong>📖 Alcorão (busca web):</strong><br>
        • <code>alcorão 1:1</code><br>
        • <code>alcorão 2:255-257</code><br>
        • <code>surata 36</code><br><br>
        <strong>🕌 Salat (Moçambique):</strong><br>
        • <code>/salat Maputo</code><br>
        • <code>/salat Beira</code><br><br>
        <strong>📚 Conhecimento:</strong><br>
        • <code>/hadith</code> — Hadith<br>
        • <code>/dua</code> — Súplica<br>
        • <code>/wudhu</code> — Abluição<br>
        • <code>/salat_como</code> — Como orar<br><br>
        <strong>💬 Perguntas naturais:</strong><br>
        "O que é o Islam?"<br>
        "Quem é o profeta?"<br>
        "Os muçulmanos creem em Jesus?"<br>
        "O Islam manda matar?"<br>
        "Os 5 pilares"`;
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
