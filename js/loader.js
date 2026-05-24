// ===== CARREGADOR DE CONHECIMENTO =====
// Não precisa mexer aqui. Só adicione arquivos JSON na pasta knowledge/

const KnowledgeBase = {
    faq: [],
    hadiths: [],
    duas: [],
    topics: [],
    custom: {},
    
    async loadAll() {
        try {
            // Carrega arquivos principais
            this.faq = await this.loadJSON('knowledge/faq.json');
            this.hadiths = await this.loadJSON('knowledge/hadiths.json');
            this.duas = await this.loadJSON('knowledge/duas.json');
            this.topics = await this.loadJSON('knowledge/topics.json');
            
            // Carrega arquivos customizados automaticamente
            await this.loadCustomFiles();
            
            console.log('✅ Conhecimento carregado:', {
                faq: this.faq.entries?.length || 0,
                hadiths: this.hadiths.entries?.length || 0,
                duas: this.duas.entries?.length || 0,
                topics: this.topics.entries?.length || 0,
                custom: Object.keys(this.custom)
            });
            
            return true;
        } catch(e) {
            console.error('❌ Erro ao carregar:', e);
            return false;
        }
    },
    
    async loadJSON(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Falha em ${path}`);
        return await response.json();
    },
    
    async loadCustomFiles() {
        // Lista de arquivos customizados para carregar
        const customFiles = [
            'knowledge/custom/historia.json',
            'knowledge/custom/fiqh.json',
            'knowledge/custom/ramadan.json'
        ];
        
        for (const file of customFiles) {
            try {
                const data = await this.loadJSON(file);
                const name = file.split('/').pop().replace('.json', '');
                this.custom[name] = data;
            } catch(e) {
                // Arquivo não existe, ignora silenciosamente
            }
        }
    },
    
    // ===== MÉTODOS DE BUSCA =====
    
    findFAQ(query) {
        const lower = query.toLowerCase();
        return this.faq.entries?.find(entry => 
            entry.keywords.some(k => lower.includes(k))
        );
    },
    
    findTopic(command) {
        return this.topics.entries?.find(t => t.command === command);
    },
    
    findCustom(keyword) {
        for (const [name, data] of Object.entries(this.custom)) {
            const found = data.entries?.find(e => 
                e.keywords?.some(k => keyword.includes(k))
            );
            if (found) return found;
        }
        return null;
    },
    
    getRandomHadith() {
        const entries = this.hadiths.entries || [];
        return entries[Math.floor(Math.random() * entries.length)];
    },
    
    getRandomDua() {
        const entries = this.duas.entries || [];
        return entries[Math.floor(Math.random() * entries.length)];
    }
};
