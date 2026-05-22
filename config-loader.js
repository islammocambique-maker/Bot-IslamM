/**
 * ============================================
 * BOT-ISLAMM - CARREGADOR DE CONFIGURAÇÃO
 * Carrega variáveis de ambiente de forma segura
 * ============================================
 */

class ConfigLoader {
    constructor() {
        this.config = {};
        this.carregar();
    }

    carregar() {
        // Detecta ambiente (Node.js vs Browser)
        if (typeof process !== 'undefined' && process.env) {
            this.carregarNode();
        } else {
            this.carregarBrowser();
        }
    }

    carregarNode() {
        // Node.js - usa process.env
        this.config = {
            NOME_BOT: this.getEnv('BOT_NOME', 'Islam M'),
            VERSAO: this.getEnv('BOT_VERSAO', '1.0.0'),
            AUTOR: this.getEnv('BOT_AUTOR', 'isslam Moz'),
            SUPORTE: this.getEnv('BOT_SUPORTE', '860407269'),
            
            URL_CEREBRO: this.getEnv('URL_CEREBRO', 'https://raw.githubusercontent.com/islammocambique-maker/Bot-IslamM/main/cerebro.json'),
            
            GEMINI: {
                ATIVO: this.getEnv('GEMINI_ATIVO', 'true') === 'true',
                API_KEY: this.getEnv('GEMINI_API_KEY', ''),
                MODEL: this.getEnv('GEMINI_MODEL', 'gemini-1.5-flash'),
                CONTEXT: `Você é o Islam M, um chatbot educacional sobre o Islam em português de Moçambique.
                Responda sempre de forma clara, respeitosa e baseada no Alcorão e Sunnah.
                Se não souber algo, diga que não tem certeza.
                Mantenha respostas concisas (máximo 3 parágrafos).
                Nunca promova extremismo ou violência.
                Use português simples e acessível.`
            },
            
            BUSCA: {
                LIMITE_PALAVRAS: parseInt(this.getEnv('BUSCA_LIMITE_PALAVRAS', '1')),
                SIMILARIDADE_MINIMA: parseFloat(this.getEnv('BUSCA_SIMILARIDADE_MINIMA', '0.1')),
                MAX_RESULTADOS: parseInt(this.getEnv('BUSCA_MAX_RESULTADOS', '1'))
            },
            
            MENSAGENS: {
                BOAS_VINDAS: "Assalamu Alaikum! Eu sou o Islam M. Estou aqui para ajudar com suas dúvidas sobre o Islam. Pergunte-me qualquer coisa!",
                CARREGANDO: "⏳ Carregando cérebro...",
                NAO_ENTENDI: "Desculpe, ainda não aprendi sobre esse tema específico. Tente perguntar sobre: Islam, Alcorão, Muhammad, Shahada, Kalimah, Salat, Wudhu, ou outros assuntos islâmicos.",
                ERRO: "Ops! Algo deu errado. Por favor, tente novamente mais tarde.",
                ERRO_GEMINI: "⚠️ A IA está temporariamente indisponível. Tente perguntar sobre outros temas do Islam que eu já conheço!",
                CONTEXTO: "Sou um chatbot educacional sobre o Islam. Respondo perguntas sobre fé, prática, história e cultura islâmica."
            },
            
            APOIO: {
                MPESA: this.getEnv('APOIO_MPESA', '1228803 (Paga Fácil) / 860407269'),
                EMOLA: this.getEnv('APOIO_EMOLA', '860407269'),
                BIM_NIB: this.getEnv('APOIO_BIM_NIB', '000100000012473356257')
            }
        };

        this.validar();
    }

    carregarBrowser() {
        // Browser - usa window.ENV se disponível (injetado no build)
        const env = (typeof window !== 'undefined' && window.ENV) ? window.ENV : {};
        
        this.config = {
            NOME_BOT: env.BOT_NOME || 'Islam M',
            VERSAO: env.BOT_VERSAO || '1.0.0',
            AUTOR: env.BOT_AUTOR || 'isslam Moz',
            SUPORTE: env.BOT_SUPORTE || '860407269',
            
            URL_CEREBRO: env.URL_CEREBRO || 'https://raw.githubusercontent.com/islammocambique-maker/Bot-IslamM/main/cerebro.json',
            
            GEMINI: {
                ATIVO: (env.GEMINI_ATIVO !== 'false'),
                API_KEY: env.GEMINI_API_KEY || '',
                MODEL: env.GEMINI_MODEL || 'gemini-1.5-flash',
                CONTEXT: `Você é o Islam M, um chatbot educacional sobre o Islam em português de Moçambique.
                Responda sempre de forma clara, respeitosa e baseada no Alcorão e Sunnah.
                Se não souber algo, diga que não tem certeza.
                Mantenha respostas concisas (máximo 3 parágrafos).
                Nunca promova extremismo ou violência.
                Use português simples e acessível.`
            },
            
            BUSCA: {
                LIMITE_PALAVRAS: parseInt(env.BUSCA_LIMITE_PALAVRAS || '1'),
                SIMILARIDADE_MINIMA: parseFloat(env.BUSCA_SIMILARIDADE_MINIMA || '0.1'),
                MAX_RESULTADOS: parseInt(env.BUSCA_MAX_RESULTADOS || '1')
            },
            
            MENSAGENS: {
                BOAS_VINDAS: "Assalamu Alaikum! Eu sou o Islam M. Estou aqui para ajudar com suas dúvidas sobre o Islam. Pergunte-me qualquer coisa!",
                CARREGANDO: "⏳ Carregando cérebro...",
                NAO_ENTENDI: "Desculpe, ainda não aprendi sobre esse tema específico. Tente perguntar sobre: Islam, Alcorão, Muhammad, Shahada, Kalimah, Salat, Wudhu, ou outros assuntos islâmicos.",
                ERRO: "Ops! Algo deu errado. Por favor, tente novamente mais tarde.",
                ERRO_GEMINI: "⚠️ A IA está temporariamente indisponível. Tente perguntar sobre outros temas do Islam que eu já conheço!",
                CONTEXTO: "Sou um chatbot educacional sobre o Islam. Respondo perguntas sobre fé, prática, história e cultura islâmica."
            },
            
            APOIO: {
                MPESA: env.APOIO_MPESA || '1228803 (Paga Fácil) / 860407269',
                EMOLA: env.APOIO_EMOLA || '860407269',
                BIM_NIB: env.APOIO_BIM_NIB || '000100000012473356257'
            }
        };

        this.validar();
    }

    getEnv(key, defaultValue = '') {
        return process.env[key] || defaultValue;
    }

    validar() {
        // Validações de segurança
        if (!this.config.GEMINI.API_KEY) {
            console.warn("⚠️  GEMINI_API_KEY não configurada. A IA de fallback estará desativada.");
            this.config.GEMINI.ATIVO = false;
        }

        if (this.config.GEMINI.API_KEY && this.config.GEMINI.API_KEY.length < 20) {
            console.warn("⚠️  GEMINI_API_KEY parece inválida (muito curta).");
        }

        console.log(`✅ Configuração carregada para: ${this.config.NOME_BOT} v${this.config.VERSAO}`);
    }

    get() {
        return this.config;
    }
}

// Singleton
const configLoader = new ConfigLoader();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConfigLoader, config: configLoader.get() };
} else if (typeof window !== 'undefined') {
    window.ConfigLoader = ConfigLoader;
    window.BotConfig = configLoader.get();
}
