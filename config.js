/**
 * ============================================
 * BOT-ISLAMM - CONFIGURAÇÃO PRINCIPAL
 * Criado por: isslam Moz
 * Suporte: 860407269
 * ============================================
 */

const CONFIG = {
    // Informações do Projeto
    NOME_BOT: "Islam M",
    VERSAO: "1.0.0",
    AUTOR: "isslam Moz",
    SUPORTE: "860407269",
    
    // URLs dos recursos
    URL_CEREBRO: "https://raw.githubusercontent.com/islammocambique-maker/Bot-IslamM/main/cerebro.json",
    
    // Configuração Gemini (IA de fallback)
    GEMINI: {
        ATIVO: true,
        API_KEY: "AIzaSyA2vPb-EVCnf1bYVUOgyXL_A_GZPhAPBH4", // <-- INSERE AQUI A TUA API KEY DO GEMINI
        MODEL: "gemini-1.5-flash",
        CONTEXT: `Você é o Islam M, um chatbot educacional sobre o Islam em português. 
        Responda sempre de forma clara, respeitosa e baseada no Alcorão e Sunnah.
        Se não souber algo, diga que não tem certeza.
        Mantenha respostas concisas (máximo 3 parágrafos).
        Nunca promova extremismo ou violência.`
    },
    
    // Configuração de busca no cérebro
    BUSCA: {
        LIMITE_PALAVRAS: 3,      // Mínimo de palavras coincidentes
        SIMILARIDADE_MINIMA: 0.3, // Threshold de similaridade (0-1)
        MAX_RESULTADOS: 1         // Máximo de respostas retornadas
    },
    
    // Mensagens padrão
    MENSAGENS: {
        BOAS_VINDAS: "Assalamu Alaikum! Eu sou o Islam M. Estou aqui para ajudar com suas dúvidas sobre o Islam. Pergunte-me qualquer coisa!",
        CARREGANDO: "⏳ Carregando cérebro...",
        NAO_ENTENDI: "Desculpe, ainda estou aprendendo sobre esse tema. Posso sugerir que consulte um sheikh ou estudioso do Islam. Também posso tentar responder com ajuda da IA.",
        ERRO: "Ops! Algo deu errado. Por favor, tente novamente mais tarde.",
        CONTEXTO: "Sou um chatbot educacional sobre o Islam. Respondo perguntas sobre fé, prática, história e cultura islâmica."
    },
    
    // Informações de apoio (pagamentos)
    APOIO: {
        MPESA: "1228803 (Paga Fácil) / 860407269",
        EMOLA: "860407269",
        BIM_NIB: "000100000012473356257"
    }
};

// ============================================
// MOTOR DE BUSCA NO CÉREBRO
// ============================================

let cerebro = []; // Array que armazena o conhecimento carregado

/**
 * Carrega o cérebro (cerebro.json) do GitHub
 */
async function carregarCerebro() {
    try {
        console.log(CONFIG.MENSAGENS.CARREGANDO);
        const response = await fetch(CONFIG.URL_CEREBRO);
        if (!response.ok) throw new Error("Falha ao carregar cerebro.json");
        cerebro = await response.json();
        console.log(`✅ Cérebro carregado! ${cerebro.length} conhecimentos disponíveis.`);
        return true;
    } catch (erro) {
        console.error("❌ Erro ao carregar cérebro:", erro);
        return false;
    }
}

/**
 * Normaliza texto para busca (remove acentos, minúsculas, etc)
 */
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .trim();
}

/**
 * Calcula similaridade entre duas strings (Jaccard Index)
 */
function calcularSimilaridade(str1, str2) {
    const set1 = new Set(normalizarTexto(str1).split(/\s+/));
    const set2 = new Set(normalizarTexto(str2).split(/\s+/));
    const intersecao = new Set([...set1].filter(x => set2.has(x)));
    const uniao = new Set([...set1, ...set2]);
    return intersecao.size / uniao.size;
}

/**
 * Busca resposta no cérebro baseado na pergunta do usuário
 * Retorna: { encontrado: boolean, resposta: string, fonte: string, categoria: string }
 */
function buscarResposta(perguntaUsuario) {
    const perguntaNormalizada = normalizarTexto(perguntaUsuario);
    const palavrasPergunta = perguntaNormalizada.split(/\s+/);
    
    let melhorMatch = null;
    let melhorScore = 0;
    
    for (const item of cerebro) {
        let scoreTotal = 0;
        let palavrasCoincidentes = 0;
        
        // Verifica palavras-chave
        for (const keyword of item.palavras_chave) {
            const keywordNormalizada = normalizarTexto(keyword);
            if (perguntaNormalizada.includes(keywordNormalizada)) {
                scoreTotal += 2; // Peso alto para palavras-chave
                palavrasCoincidentes++;
            }
        }
        
        // Similaridade com a pergunta completa
        const similaridadePergunta = calcularSimilaridade(perguntaUsuario, item.pergunta || "");
        scoreTotal += similaridadePergunta * 3;
        
        // Similaridade com a resposta
        const similaridadeResposta = calcularSimilaridade(perguntaUsuario, item.resposta);
        scoreTotal += similaridadeResposta * 1;
        
        // Bônus se muitas palavras coincidem
        if (palavrasCoincidentes >= CONFIG.BUSCA.LIMITE_PALAVRAS) {
            scoreTotal += 1;
        }
        
        if (scoreTotal > melhorScore && scoreTotal >= CONFIG.BUSCA.SIMILARIDADE_MINIMA) {
            melhorScore = scoreTotal;
            melhorMatch = item;
        }
    }
    
    if (melhorMatch) {
        return {
            encontrado: true,
            resposta: melhorMatch.resposta,
            fonte: melhorMatch.fonte,
            categoria: melhorMatch.categoria,
            nivel: melhorMatch.nivel,
            links: melhorMatch.links || []
        };
    }
    
    return { encontrado: false, resposta: null };
}

// ============================================
// INTEGRAÇÃO GEMINI (IA FALLBACK)
// ============================================

/**
 * Chama a API Gemini quando o cérebro não tem resposta
 */
async function perguntarGemini(pergunta) {
    if (!CONFIG.GEMINI.ATIVO || !CONFIG.GEMINI.API_KEY) {
        return null;
    }
    
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI.MODEL}:generateContent?key=${CONFIG.GEMINI.API_KEY}`;
        
        const body = {
            contents: [{
                parts: [{
                    text: `${CONFIG.GEMINI.CONTEXT}\n\nPergunta do usuário: ${pergunta}\n\nResponda em português de forma educativa e baseada no Islam.`
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500
            }
        };
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
        return null;
    } catch (erro) {
        console.error("Erro Gemini:", erro);
        return null;
    }
}

// ============================================
// FUNÇÃO PRINCIPAL DO CHATBOT
// ============================================

/**
 * Processa a pergunta do usuário e retorna a melhor resposta
 * Prioridade: 1) Cérebro local  2) Gemini IA  3) Mensagem padrão
 */
async function processarPergunta(perguntaUsuario) {
    // 1. Tenta encontrar no cérebro
    const resultadoCerebro = buscarResposta(perguntaUsuario);
    
    if (resultadoCerebro.encontrado) {
        let respostaFinal = resultadoCerebro.resposta;
        
        // Adiciona fonte se existir
        if (resultadoCerebro.fonte) {
            respostaFinal += `\n\n📖 Fonte: ${resultadoCerebro.fonte}`;
        }
        
        // Adiciona links se existirem
        if (resultadoCerebro.links && resultadoCerebro.links.length > 0 && resultadoCerebro.links[0] !== "") {
            respostaFinal += `\n\n🔗 Links:`;
            resultadoCerebro.links.forEach(link => {
                if (link) respostaFinal += `\n   • ${link}`;
            });
        }
        
        return {
            origem: "cerebro",
            resposta: respostaFinal,
            confianca: "alta"
        };
    }
    
    // 2. Tenta Gemini (fallback)
    const respostaGemini = await perguntarGemini(perguntaUsuario);
    if (respostaGemini) {
        return {
            origem: "gemini",
            resposta: respostaGemini,
            confianca: "media"
        };
    }
    
    // 3. Resposta padrão
    return {
        origem: "padrao",
        resposta: CONFIG.MENSAGENS.NAO_ENTENDI,
        confianca: "baixa"
    };
}

// ============================================
// FUNÇÕES AUXILIARES PARA A UI
// ============================================

/**
 * Retorna informações de apoio (doações)
 */
function getInfoApoio() {
    return `
💚 Apoie o Projeto Islam M:

📱 M-Pesa (Paga Fácil): ${CONFIG.APOIO.MPESA}
📱 E-mola: ${CONFIG.APOIO.EMOLA}
🏦 Banco BIM NIB: ${CONFIG.APOIO.BIM_NIB}

☎️ Suporte: ${CONFIG.SUPORTE}
    `.trim();
}

/**
 * Retorna mensagem de boas-vindas
 */
function getBoasVindas() {
    return CONFIG.MENSAGENS.BOAS_VINDAS;
}

/**
 * Verifica se o cérebro está carregado
 */
function cerebroCarregado() {
    return cerebro.length > 0;
}

/**
 * Retorna estatísticas do cérebro
 */
function getEstatisticas() {
    const categorias = {};
    const niveis = {};
    
    cerebro.forEach(item => {
        categorias[item.categoria] = (categorias[item.categoria] || 0) + 1;
        niveis[item.nivel] = (niveis[item.nivel] || 0) + 1;
    });
    
    return {
        total: cerebro.length,
        categorias,
        niveis
    };
}

// ============================================
// EXPORTAÇÃO (para módulos ou uso global)
// ============================================

// Para uso com ES6 modules:
// export { CONFIG, carregarCerebro, processarPergunta, buscarResposta, getBoasVindas, getInfoApoio, getEstatisticas, cerebroCarregado };

// Para uso global (script tag):
if (typeof window !== 'undefined') {
    window.BotIslamM = {
        CONFIG,
        carregarCerebro,
        processarPergunta,
        buscarResposta,
        getBoasVindas,
        getInfoApoio,
        getEstatisticas,
        cerebroCarregado
    };
}
