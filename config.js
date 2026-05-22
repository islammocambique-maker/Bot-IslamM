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
        // ⚠️ IMPORTANTE: Substitua esta chave por uma válida em:
        // https://aistudio.google.com/app/apikey
        API_KEY: "AIzaSyDLeal_-eD9cgJsWrJioyT3D6ACKcbiAPA",
        MODEL: "gemini-1.5-flash",
        CONTEXT: `Você é o Islam M, um chatbot educacional sobre o Islam em português de Moçambique.
        Responda sempre de forma clara, respeitosa e baseada no Alcorão e Sunnah.
        Se não souber algo, diga que não tem certeza.
        Mantenha respostas concisas (máximo 3 parágrafos).
        Nunca promova extremismo ou violência.
        Use português simples e acessível.`
    },

    // Configuração de busca no cérebro
    BUSCA: {
        LIMITE_PALAVRAS: 1,        // Reduzido para encontrar mais matches
        SIMILARIDADE_MINIMA: 0.1,  // Reduzido para ser mais permissivo
        MAX_RESULTADOS: 1
    },

    // Mensagens padrão
    MENSAGENS: {
        BOAS_VINDAS: "Assalamu Alaikum! Eu sou o Islam M. Estou aqui para ajudar com suas dúvidas sobre o Islam. Pergunte-me qualquer coisa!",
        CARREGANDO: "⏳ Carregando cérebro...",
        NAO_ENTENDI: "Desculpe, ainda não aprendi sobre esse tema específico. Tente perguntar sobre: Islam, Alcorão, Muhammad, Shahada, Kalimah, Salat, Wudhu, ou outros assuntos islâmicos.",
        ERRO: "Ops! Algo deu errado. Por favor, tente novamente mais tarde.",
        ERRO_GEMINI: "⚠️ A IA está temporariamente indisponível. Tente perguntar sobre outros temas do Islam que eu já conheço!",
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

let cerebro = [];

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
 * Normaliza texto para busca
 */
function normalizarTexto(texto) {
    if (!texto) return "";
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
    const set1 = new Set(normalizarTexto(str1).split(/\s+/).filter(w => w.length > 2));
    const set2 = new Set(normalizarTexto(str2).split(/\s+/).filter(w => w.length > 2));
    if (set1.size === 0 || set2.size === 0) return 0;
    const intersecao = new Set([...set1].filter(x => set2.has(x)));
    const uniao = new Set([...set1, ...set2]);
    return intersecao.size / uniao.size;
}

/**
 * Busca resposta no cérebro
 */
function buscarResposta(perguntaUsuario) {
    const perguntaNormalizada = normalizarTexto(perguntaUsuario);
    const palavrasPergunta = perguntaNormalizada.split(/\s+/).filter(w => w.length > 2);

    let melhorMatch = null;
    let melhorScore = 0;

    for (const item of cerebro) {
        let scoreTotal = 0;
        let palavrasCoincidentes = 0;

        // Verifica palavras-chave
        if (item.palavras_chave && Array.isArray(item.palavras_chave)) {
            for (const keyword of item.palavras_chave) {
                const keywordNormalizada = normalizarTexto(keyword);
                if (keywordNormalizada && perguntaNormalizada.includes(keywordNormalizada)) {
                    scoreTotal += 3;
                    palavrasCoincidentes++;
                }
            }
        }

        // Similaridade com a pergunta completa
        const similaridadePergunta = calcularSimilaridade(perguntaUsuario, item.pergunta || "");
        scoreTotal += similaridadePergunta * 2;

        // Similaridade com a resposta
        const similaridadeResposta = calcularSimilaridade(perguntaUsuario, item.resposta || "");
        scoreTotal += similaridadeResposta * 1;

        // Bônus se palavras coincidem
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
// INTEGRAÇÃO GEMINI (IA FALLBACK) - CORRIGIDA
// ============================================

/**
 * Chama a API Gemini com melhor tratamento de erros
 */
async function perguntarGemini(pergunta) {
    if (!CONFIG.GEMINI.ATIVO || !CONFIG.GEMINI.API_KEY) {
        console.log("Gemini desativado ou sem API Key");
        return null;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI.MODEL}:generateContent?key=${CONFIG.GEMINI.API_KEY}`;

        const body = {
            contents: [{
                parts: [{
                    text: `${CONFIG.GEMINI.CONTEXT}\n\nPergunta do usuário: ${pergunta}\n\nResponda em português de forma educativa e baseada no Islam. Seja claro e direto.`
                }]
            }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500,
                topP: 0.8,
                topK: 40
            }
        };

        console.log("🤖 Chamando Gemini API...");
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        // Verifica se a resposta HTTP foi OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("❌ Erro HTTP Gemini:", response.status, errorData);
            
            // Erros comuns da API
            if (response.status === 400) {
                console.error("API Key inválida ou requisição mal formada");
            } else if (response.status === 403) {
                console.error("API Key sem permissão ou quota esgotada");
            } else if (response.status === 429) {
                console.error("Muitas requisições - quota excedida");
            } else if (response.status === 500 || response.status === 503) {
                console.error("Servidor Gemini indisponível");
            }
            
            return null;
        }

        const data = await response.json();
        console.log("✅ Resposta Gemini recebida:", data);

        // Verifica estrutura da resposta
        if (data.error) {
            console.error("❌ Erro na resposta Gemini:", data.error);
            return null;
        }

        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            
            // Verifica se foi bloqueado por segurança
            if (candidate.finishReason === "SAFETY") {
                console.warn("⚠️ Resposta bloqueada por segurança");
                return "Desculpe, não posso responder a essa pergunta por questões de segurança. Tente reformular.";
            }
            
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                const texto = candidate.content.parts[0].text;
                if (texto && texto.trim()) {
                    return texto.trim();
                }
            }
        }

        console.warn("⚠️ Resposta Gemini vazia ou formato inesperado");
        return null;

    } catch (erro) {
        console.error("❌ Erro na chamada Gemini:", erro);
        return null;
    }
}

// ============================================
// FUNÇÃO PRINCIPAL DO CHATBOT - CORRIGIDA
// ============================================

/**
 * Processa a pergunta do usuário
 */
async function processarPergunta(perguntaUsuario) {
    // 1. Tenta encontrar no cérebro
    const resultadoCerebro = buscarResposta(perguntaUsuario);

    if (resultadoCerebro.encontrado) {
        let respostaFinal = resultadoCerebro.resposta;

        if (resultadoCerebro.fonte) {
            respostaFinal += `\n\n📖 Fonte: ${resultadoCerebro.fonte}`;
        }

        if (resultadoCerebro.links && resultadoCerebro.links.length > 0) {
            const linksValidos = resultadoCerebro.links.filter(l => l && l.trim() !== "");
            if (linksValidos.length > 0) {
                respostaFinal += `\n\n🔗 Links:`;
                linksValidos.forEach(link => {
                    respostaFinal += `\n   • ${link}`;
                });
            }
        }

        return {
            origem: "cerebro",
            resposta: respostaFinal,
            confianca: "alta"
        };
    }

    // 2. Tenta Gemini (fallback)
    console.log("🔄 Cérebro não encontrou. Tentando Gemini...");
    const respostaGemini = await perguntarGemini(perguntaUsuario);
    
    if (respostaGemini) {
        return {
            origem: "gemini",
            resposta: respostaGemini,
            confianca: "media"
        };
    }

    // 3. Se Gemini também falhou, mostra mensagem de erro específica
    return {
        origem: "padrao",
        resposta: CONFIG.MENSAGENS.ERRO_GEMINI,
        confianca: "baixa"
    };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function getInfoApoio() {
    return `
💚 Apoie o Projeto Islam M:

📱 M-Pesa (Paga Fácil): ${CONFIG.APOIO.MPESA}
📱 E-mola: ${CONFIG.APOIO.EMOLA}
🏦 Banco BIM NIB: ${CONFIG.APOIO.BIM_NIB}

☎️ Suporte: ${CONFIG.SUPORTE}
    `.trim();
}

function getBoasVindas() {
    return CONFIG.MENSAGENS.BOAS_VINDAS;
}

function cerebroCarregado() {
    return cerebro.length > 0;
}

function getEstatisticas() {
    const categorias = {};
    const niveis = {};

    cerebro.forEach(item => {
        if (item.categoria) categorias[item.categoria] = (categorias[item.categoria] || 0) + 1;
        if (item.nivel) niveis[item.nivel] = (niveis[item.nivel] || 0) + 1;
    });

    return { total: cerebro.length, categorias, niveis };
}

// ============================================
// EXPORTAÇÃO
// ============================================

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
