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
        Sou seu assistente sobre Islam. Posso ajudar com:<br>
        • 📖 <strong>Alcorão completo</strong> — digite <code>alcorão 2:255</code><br>
        • 🕌 <strong>Horários de Salat</strong> — <code>/salat São Paulo</code><br>
        • 📜 <strong>Hadiths</strong> — <code>/hadith</code><br>
        • 🤲 <strong>Duãs</strong> — <code>/dua</code><br>
        • 💧 <strong>Wudhu</strong> — <code>/wudhu</code><br>
        • 🙏 <strong>Como orar</strong> — <code>/salat_como</code><br>
        • ❓ <strong>FAQ</strong> — "O que é o Islam?"<br><br>
        <code>/ajuda</code> para todos os comandos`;
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

    // ========== ALCORÃO COMPLETO DA WEB ==========

    async fetchQuranVerse(surah, ayah) {
        try {
            const arabicRes = await fetch(
                `https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${surah}:${ayah}`
            );
            const arabicData = await arabicRes.json();
            const arabic = arabicData.verses?.[0]?.text_uthmani || '';

            let translation = '';
            try {
                const ptRes = await fetch(
                    `https://api.quran.com/api/v4/quran/translations/92?verse_key=${surah}:${ayah}`
                );
                const ptData = await ptRes.json();
                translation = ptData.translations?.[0]?.text?.replace(/<[^>]*>/g, '').trim() || '';
            } catch(e) {
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

    // ========== PROCESSADOR PRINCIPAL ==========

    async processCommand(text) {
        const cmd = text.toLowerCase().trim();

        // ALCORÃO: alcorão X:Y, alcorão X:Y-Z, surata X, X:Y
        const quranMatch = cmd.match(/(?:alcor[ãa]o|cor[ãa]o|quran|sur[áa]ta?)\s*(\d+)(?::(\d+))?(?:-(\d+))?/i) 
                        || cmd.match(/^(\d+):(\d+)(?:-(\d+))?$/);

        if (quranMatch) {
            const surah = parseInt(quranMatch[1]);
            let start = quranMatch[2] ? parseInt(quranMatch[2]) : 1;
            let end = quranMatch[3] ? parseInt(quranMatch[3]) : (quranMatch[2] ? start : 10);

            if (surah < 1 || surah > 114) return '❌ Surata deve ser entre 1 e 114.';
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

            if (verses.length === 0) {
                return '⚠️ Erro ao buscar. Verifique sua conexão.';
            }

            const name = this.surahNames[surah] || `Surata ${surah}`;
            const total = chapterInfo?.verses_count || '';

            let html = `<div class="surah-info">`;
            html += `📖 <strong>ALCORÃO ${surah}</strong><br>`;
            html += `<strong>${name}</strong>${total ? ` <em>(${total} versículos)</em>` : ''}`;
            html += `</div>`;

            for (const v of verses) {
                const numAr = this.toArabicNumber(v.ayah);
                html += `<div class="verse-arabic">`;
                html += `<span style="color:#10b981;">﴿${numAr}﴾</span> ${v.arabic}`;
                html += `</div>`;
                html += `<div class="verse-translation">`;
                html += `<strong>[${v.ayah}]</strong> ${v.translation}`;
                html += `</div>`;
            }

            html += `<br><em style="color:#a8e6cf;font-size:0.85rem;">🌐 quran.com</em>`;
            return html;
        }

        // COMANDOS COM /
        if (cmd === '/quran') {
            return `📖 <strong>COMO BUSCAR O ALCORÃO</strong><br><br>
            • <code>alcorão 1:1</code> — Um versículo<br>
            • <code>alcorão 2:255-257</code> — Intervalo (máx 20)<br>
            • <code>surata 36</code> — Primeiros 10 versículos<br>
            • <code>112:1</code> — Formato curto`;
        }

        if (cmd.startsWith('/salat')) {
            const parts = text.split(' ');
            const city = parts.length > 1 ? parts.slice(1).join(' ') : 'Sao Paulo';
            return await this.handleSalat(city);
        }

        if (cmd === '/hadith') return this.handleHadith();
        if (cmd === '/dua') return this.handleDua();
        if (cmd === '/wudhu') return this.handleWudhu();
        if (cmd === '/salat_como') return this.handleSalatComo();
        if (cmd === '/tawhid') return this.handleTawhid();
        if (cmd === '/fiqh') return this.handleFiqh();
        if (cmd === '/historia') return this.handleHistoria();
        if (cmd === '/outros') return this.handleOutros();
        if (cmd === '/ajuda' || cmd === '/help') return this.getHelp();

        // FAQ NATURAL
        return this.handleFAQ(cmd);
    },

    // ========== OUTRAS FUNCIONALIDADES ==========

    async handleSalat(city) {
        this.showLoading(true);
        try {
            const res = await fetch(
                `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Brazil&method=2`
            );
            const data = await res.json();
            
            if (data.code !== 200) throw new Error();
            
            const t = data.data.timings;
            const d = data.data.date;
            
            this.showLoading(false);
            
            return `🕌 <strong>HORÁRIOS DE ORAÇÃO</strong><br>
            📍 ${city}<br>
            📅 ${d.readable}<br><br>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="background:rgba(255,255,255,0.1);padding:10px;border-radius:8px;text-align:center;">
                    <div style="color:#a8e6cf;font-size:0.85rem;">🌅 Fajr</div>
                    <div style="font-size:1.2rem;font-weight:bold;">${t.Fajr}</div>
                </div>
                <div style="background:rgba(255,255,255,0.1);padding:10px;border-radius:8px;text-align:center;">
                    <div style="color:#a8e6cf;font-size:0.85rem;">☀️ Dhuhr</div>
                    <div style="font-size:1.2rem;font-weight:bold;">${t.Dhuhr}</div>
                </div>
                <div style="background:rgba(255,255,255,0.1);padding:10px;border-radius:8px;text-align:center;">
                    <div style="color:#a8e6cf;font-size:0.85rem;">🌤️ Asr</div>
                    <div style="font-size:1.2rem;font-weight:bold;">${t.Asr}</div>
                </div>
                <div style="background:rgba(255,255,255,0.1);padding:10px;border-radius:8px;text-align:center;">
                    <div style="color:#a8e6cf;font-size:0.85rem;">🌇 Maghrib</div>
                    <div style="font-size:1.2rem;font-weight:bold;">${t.Maghrib}</div>
                </div>
                <div style="background:rgba(255,255,255,0.1);padding:10px;border-radius:8px;text-align:center;grid-column:1/-1;">
                    <div style="color:#a8e6cf;font-size:0.85rem;">🌙 Isha</div>
                    <div style="font-size:1.2rem;font-weight:bold;">${t.Isha}</div>
                </div>
            </div>
            <br><em style="color:#a8e6cf;font-size:0.85rem;">🌐 aladhan.com</em>`;
        } catch(e) {
            this.showLoading(false);
            return '⚠️ Erro ao buscar horários. Tente: <code>/salat São Paulo</code>';
        }
    },

    handleHadith() {
        const hadiths = [
            {
                narrador: 'Umar ibn al-Khattab',
                fonte: 'Sahih al-Bukhari',
                texto: 'Um homem perguntou: "Informe-me sobre o Islam." O Profeta ﷺ respondeu: "O Islam é que testemunhes que não há divindade exceto Allah e que Muhammad é o Mensageiro de Allah, que establishes a oração, que pagues o zakat, que jejues o Ramadã e que peregrines à Casa se tiveres meios."'
            },
            {
                narrador: 'Abu Hurairah',
                fonte: 'Sahih Muslim',
                texto: 'O Mensageiro de Allah ﷺ disse: "Não sereis verdadeiros crentes até que tenhais misericórdia uns dos outros." Disseram: "Todos nós somos misericordiosos!" Ele respondeu: "Não é a misericórdia que um de vós tem para com seu companheiro, mas sim a misericórdia geral para com todos."'
            },
            {
                narrador: 'Aisha',
                fonte: 'Sahih al-Bukhari',
                texto: 'O Mensageiro de Allah ﷺ disse: "Allah é Gentil e ama a gentileza em todos os assuntos."'
            },
            {
                narrador: 'Abu Hurairah',
                fonte: 'Sahih Muslim',
                texto: 'O Mensageiro de Allah ﷺ disse: "Allah disse: Meu servo não se aproxima de Mim com nada mais amado do que as obrigações que lhe prescrevi. Meu servo continua se aproximando de Mim com atos voluntários até que Eu o ame."'
            }
        ];
        const h = hadiths[Math.floor(Math.random() * hadiths.length)];
        return `📜 <strong>HADITH</strong><br><br>
        📝 <em>${h.narrador}</em><br>
        📚 ${h.fonte}<br><br>
        ❝ ${h.texto} ❞`;
    },

    handleDua() {
        const duas = [
            {
                nome: 'Ao acordar',
                arabe: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
                transliteracao: 'Alhamdu lillahi alladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
                portugues: 'Louvor a Deus que nos deu vida depois de nos ter dado a morte, e a Ele é o retorno.'
            },
            {
                nome: 'Antes de dormir',
                arabe: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
                transliteracao: 'Bismika Allahumma amutu wa ahya',
                portugues: 'Em Teu nome, ó Allah, eu morro e vivo.'
            },
            {
                nome: 'Para conhecimento',
                arabe: 'رَبِّ زِدْنِي عِلْمًا',
                transliteracao: 'Rabbi zidni \'ilma',
                portugues: 'Meu Senhor, aumenta-me em conhecimento.'
            }
        ];
        const d = duas[Math.floor(Math.random() * duas.length)];
        return `🤲 <strong>${d.nome.toUpperCase()}</strong><br><br>
        <div class="verse-arabic">${d.arabe}</div>
        <em>${d.transliteracao}</em><br><br>
        🇧🇷 ${d.portugues}`;
    },

    handleWudhu() {
        return `💧 <strong>WUDHU (ABLUIÇÃO)</strong><br><br>
        <strong>Passos:</strong><br>
        1️⃣ Intenção no coração<br>
        2️⃣ Bismillah<br>
        3️⃣ Lavar mãos 3x<br>
        4️⃣ Enxaguar boca 3x<br>
        5️⃣ Lavar nariz 3x<br>
        6️⃣ Lavar rosto 3x<br>
        7️⃣ Lavar braços até cotovelos 3x<br>
        8️⃣ Passar mãos molhadas na cabeça<br>
        9️⃣ Limpar orelhas<br>
        🔟 Lavar pés até tornozelos 3x<br><br>
        ⚠️ <strong>Quebra o wudhu:</strong> relieve, sono profundo, perda de consciência`;
    },

    handleSalatComo() {
        return `🙏 <strong>COMO ORAR (SALAT)</strong><br><br>
        <strong>Pré-requisitos:</strong> wudhu válido, vestes limpas, lugar limpo, intenção<br><br>
        <strong>Passos:</strong><br>
        1️⃣ <strong>Takbir</strong> — "Allahu Akbar" (mãos levantadas)<br>
        2️⃣ <strong>Qiyam</strong> — Recitar Al-Fatiha + surata<br>
        3️⃣ <strong>Ruku'</strong> — Inclinar, mãos nos joelhos<br>
        4️⃣ <strong>Sujud</strong> — Prostrar, testa no chão<br>
        5️⃣ <strong>Julus</strong> — Sentar entre sujud<br>
        6️⃣ Repetir sujud<br>
        7️⃣ <strong>Tashahhud</strong> — Testemunho sentado<br>
        8️⃣ <strong>Salaam</strong> — "Assalamu alaikum" (virar cabeça)`;
    },

    handleTawhid() {
        return `☝️ <strong>TAWHID (UNICIDADE DE DEUS)</strong><br><br>
        O conceito central do Islam.<br><br>
        <strong>3 níveis:</strong><br>
        1️⃣ <strong>Rububiyyah</strong> — Deus é Único Criador<br>
        2️⃣ <strong>Uluhiyyah</strong> — Deus é Único digno de adoração<br>
        3️⃣ <strong>Asma wa Sifat</strong> — Nomes e Atributos perfeitos<br><br>
        📖 <em>"Dize: Ele é Deus, Uno. Absoluto. Não gerou, nem foi gerado. Não tem igual."</em> (112)`;
    },

    handleFiqh() {
        return `⚖️ <strong>FIQH (JURISPRUDÊNCIA)</strong><br><br>
        <strong>Escolas:</strong><br>
        • Hanafi — Maioria mundial<br>
        • Maliki — Norte da África<br>
        • Shafi'i — Sudeste Asiático<br>
        • Hanbali — Arábia Saudita<br><br>
        <strong>Fontes:</strong><br>
        1. Alcorão<br>
        2. Sunnah<br>
        3. Ijma' (consenso)<br>
        4. Qiyas (analogia)<br><br>
        ⚠️ Consulte um estudioso qualificado!`;
    },

    handleHistoria() {
        return `📚 <strong>HISTÓRIA ISLÂMICA</strong><br><br>
        <strong>Profetas no Alcorão (25):</strong><br>
        Adão, Noé, Abraão, Ismael, Isaac, Jacó, José, Jó, Moisés, Arão, Davi, Salomão, Elias, Eliseu, Jonas, Zacarias, João, Jesus, Muhammad ﷺ<br><br>
        <strong>Linha do tempo do Profeta ﷺ:</strong><br>
        • 570 — Nascimento em Meca<br>
        • 595 — Casamento com Khadija<br>
        • 610 — Primeira revelação<br>
        • 622 — Hijra (Migração para Medina)<br>
        • 630 — Conquista pacífica de Meca<br>
        • 632 — Falecimento em Medina`;
    },

    handleOutros() {
        return `📖 <strong>OUTROS TÓPICOS</strong><br><br>
        • <strong>Ramadã</strong> — Nono mês, jejum do amanhecer ao pôr do sol<br>
        • <strong>Zakat</strong> — Caridade obrigatória (2.5% da riqueza)<br>
        • <strong>Hajj</strong> — Peregrinação a Meca (pelo menos uma vez na vida)<br>
        • <strong>Halal/Haram</strong> — Permitido/Proibido (porco, álcool, sangue proibidos)<br>
        • <strong>Jesus no Islam</strong> — Profeta, não Deus; não foi crucificado`;
    },

    handleFAQ(cmd) {
        const faqs = {
            'o que e o islam': '🌙 <strong>ISLAM</strong> = submissão à vontade de Deus. Paz através dessa submissão. Mesma mensagem de todos os profetas desde Adão até Muhammad ﷺ.',
            'profeta': '🕊️ <strong>Muhammad ﷺ</strong> — último profeta, humano não divino. Nascido em Meca em 570 d.C. Exemplo de honestidade, misericórdia e humildade.',
            'jesus': '✝️🤝☪️ Os muçulmanos <strong>creem firmemente em Jesus</strong>! Ele é profeta, nasceu da Virgem Maria, realizou milagres. Mas NÃO cremos que é Deus ou foi crucificado.',
            'pilares': '🕋 <strong>5 PILARES:</strong> 1) Shahada (fé), 2) Salat (oração), 3) Zakat (caridade), 4) Sawm (jejum), 5) Hajj (peregrinação).',
            'terrorista': '🌍 <strong>NÃO.</strong> Terroristas não representam o Islam. 1.8 bilhão de muçulmanos vivem em paz. O Islam condena matar inocentes (Alcorão 5:32).',
            'matar': '⚖️ <strong>O ISLAM NÃO MANDA MATAR.</strong> "Quem matar uma pessoa inocente... é como se tivesse matado toda a humanidade" (5:32).',
            'muhammad e deus': '❌ <strong>MUHAMMAD NÃO É DEUS.</strong> Ele mesmo disse: "Não sou senão um homem como vocês" (Alcorão 18:110).',
            'creem em': '🕌 <strong>6 ARTIGOS DE FÉ:</strong> Allah, anjos, livros revelados, profetas, Dia do Juízo, decreto divino.',
            'quem sao os muculmanos': '🤲 <strong>MUÇULMANOS</strong> = aqueles que se submetem à vontade de Deus. 1.8 bilhão em todas as etnias e países.',
            'alcorao': '📖 <strong>ALCORÃO</strong> — palavra de Deus revelada a Muhammad ﷺ em 23 anos. 114 suratas. Preservado em árabe original.',
            'livro sagrado': '📖 <strong>ALCORÃO</strong> — palavra de Deus revelada a Muhammad ﷺ em 23 anos. 114 suratas. Preservado em árabe original.'
        };

        const normalized = cmd.replace(/[ãáàâä]/g, 'a').replace(/[éêë]/g, 'e').replace(/[íï]/g, 'i')
                             .replace(/[óôõö]/g, 'o').replace(/[úü]/g, 'u').replace(/ç/g, 'c');

        for (const [key, value] of Object.entries(faqs)) {
            if (normalized.includes(key)) return value;
        }

        return `🤔 Não entendi bem. Tente:<br><br>
        <strong>Buscar Alcorão:</strong><br>
        • <code>alcorão 1:1</code><br>
        • <code>alcorão 2:255</code><br>
        • <code>surata 36</code><br><br>
        <strong>Outros:</strong><br>
        • <code>/salat São Paulo</code><br>
        • <code>/hadith</code>, <code>/dua</code><br>
        • <code>/wudhu</code>, <code>/salat_como</code><br>
        • <code>/ajuda</code> — todos os comandos`;
    },

    getHelp() {
        return `📋 <strong>TODOS OS COMANDOS</strong><br><br>
        
        <strong>📖 ALCORÃO (busca completa na web):</strong><br>
        • <code>alcorão 1:1</code> — Um versículo<br>
        • <code>alcorão 2:255-257</code> — Intervalo (máx 20)<br>
        • <code>surata 36</code> — Primeiros 10 versículos<br>
        • <code>112:1</code> — Formato curto<br><br>
        
        <strong>🕌 HORÁRIOS DE ORAÇÃO:</strong><br>
        • <code>/salat</code> — São Paulo (padrão)<br>
        • <code>/salat Rio de Janeiro</code><br><br>
        
        <strong>📚 CONHECIMENTO:</strong><br>
        • <code>/hadith</code> — Hadith aleatório<br>
        • <code>/dua</code> — Súplica com árabe<br>
        • <code>/wudhu</code> — Como fazer ablução<br>
        • <code>/salat_como</code> — Como orar<br>
        • <code>/tawhid</code> — Unicidade de Deus<br>
        • <code>/fiqh</code> — Jurisprudência<br>
        • <code>/historia</code> — História islâmica<br>
        • <code>/outros</code> — Mais tópicos<br><br>
        
        <strong>💬 PERGUNTAS NATURAIS:</strong><br>
        • "O que é o Islam?"<br>
        • "Quem é o profeta?"<br>
        • "Os muçulmanos creem em Jesus?"<br>
        • "O Islam manda matar?"<br>
        • "Os 5 pilares"<br>
        • "Muhammad é Deus?"`;
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
