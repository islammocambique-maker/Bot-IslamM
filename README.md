
readme = """# 🤖 Islam M Bot

> **Seu guia islâmico inteligente** — Responde perguntas sobre Islam, busca versículos do Alcorão em árabe/português e informa horários de Salat para Moçambique.

---

## 📁 Estrutura do Projeto

```
islam-m-bot/
├── index.html              ← Página principal do chatbot
├── cerebro/
│   ├── pratica.json        ← Conhecimento sobre práticas islâmicas
│   ├── definicao.json      ← Definições e conceitos do Islam
│   ├── mais.json           ← Informações adicionais
│   └── extra.json          ← Conteúdo extra e curiosidades
└── README.md               ← Este arquivo
```

---

## 🚀 Como Usar

### 1. Clone ou baixe os arquivos

```bash
git clone https://github.com/seu-usuario/islam-m-bot.git
cd islam-m-bot
```

### 2. Configure o Cérebro (opcional)

Crie a pasta `cerebro/` e adicione os arquivos JSON no formato da **Grelha Jos**:

```json
[
  {
    "palavras_chave": ["como orar", "salah", "salat", "oração"],
    "resposta": "A oração (Salah) em Islam consiste em 5 orações diárias...",
    "fonte": "Alcorão 2:238",
    "categoria": "Prática",
    "nivel": "Básico",
    "links": ["https://Facebook.com/Islamguia"]
  }
]
```

> 💡 **Dica:** Se os arquivos não existirem, o bot usa dados **fallback** embutidos.

### 3. Abra no navegador

Basta abrir o arquivo `index.html` em qualquer navegador moderno:

```bash
# No Windows
start index.html

# No Linux
xdg-open index.html

# No macOS
open index.html
```

Ou hospede em qualquer servidor web estático (GitHub Pages, Netlify, Vercel, Firebase Hosting, etc.).

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---------|-----------|
| 🔍 **Busca Inteligente** | Keywords com suporte a **maiúsculas/minúsculas**, **acentos/sem acentos** |
| 📖 **Alcorão Online** | Digite `Alcorão 2:255` → recebe texto em **árabe** + **tradução em português** |
| 🕐 **Horários de Salat** | Horários atualizados online para **Maputo, Moçambique** com alarme de notificação |
| 🧠 **Cérebro Externo** | Carrega conhecimento de arquivos JSON externos na pasta `cerebro/` |
| 🔔 **Alarme de Oração** | Clique no sino para ativar notificação no horário da oração |
| 📱 **Responsivo** | Funciona em desktop, tablet e celular |

---

## 📝 Comandos de Exemplo

Digite no chat:

| Comando | Resposta |
|---------|----------|
| `Alcorão 1:1` | Surata Al-Fatiha, versículo 1 em árabe + português |
| `Alcorão 2:255` | Ayat al-Kursi em árabe + português |
| `horário salat` | Horários de Fajr, Dhuhr, Asr, Maghrib, Isha para hoje |
| `o que é islam` | Definição completa do Islam |
| `como orar` | Passo a passo da oração (Salah) |
| `allah` | Quem é Allah e Seus 99 nomes |
| `profeta muhammad` | Biografia do Profeta Muhammad (S.A.W.) |
| `wudu` | Como fazer a ablução ritual |
| `jejum ramadan` | Regras do jejum no Ramadan |
| `shahada` | Testemunho de fé e conversão |

---

## 🧩 Formato da Grelha Jos

Cada entrada no cérebro deve seguir este formato:

```json
{
  "palavras_chave": ["palavra1", "palavra2", "sinonimo", "variacao"],
  "resposta": "Texto completo da resposta que o bot vai mostrar...",
  "fonte": "Alcorão X:Y ou Hadith X",
  "categoria": "Prática | Definição | Mais | Extra",
  "nivel": "Básico | Intermediário | Avançado",
  "links": ["https://Facebook.com/Islamguia"]
}
```

### Regras de Busca:
- ✅ **Case-insensitive**: `Islam` = `islam` = `ISLAM`
- ✅ **Sem acentos**: `oração` = `oracao` = `oraçao`
- ✅ **Empate**: Se múltiplas respostas tiverem o mesmo score, o bot **escolhe uma aleatoriamente**

---

## 🌐 APIs Utilizadas

| API | Uso | Documentação |
|-----|-----|--------------|
| **Quran.com API** | Versículos do Alcorão (árabe + tradução) | https://api.quran.com |
| **AlAdhan API** | Horários de oração baseados em localização | https://aladhan.com/prayer-times-api |

---

## 📞 Suporte

| Canal | Contato |
|-------|---------|
| 📧 Email | [Islammocambique@gmail.com](mailto:Islammocambique@gmail.com) |
| 📱 WhatsApp | [+258 86 040 7269](https://wa.me/258860407269) |
| 🌐 Facebook | [facebook.com/Islamguia](https://Facebook.com/Islamguia) |

---

## 🛠️ Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3** — Design responsivo com gradientes e animações
- **JavaScript (Vanilla)** — Lógica do bot, APIs e interatividade
- **Fetch API** — Comunicação com APIs externas
- **Web Notifications API** — Alarmes de oração

---

## 📄 Licença

Este projeto é de código aberto para uso educacional e religioso islâmico.

**Feito com ❤️ para a comunidade muçulmana de Moçambique.**

🕌 *As-salamu alaykum wa rahmatullahi wa barakatuh*
"""

with open('/mnt/agents/output/README.md', 'w', encoding='utf-8') as f:
    f.write(readme)

print("✅ README.md criado com sucesso!")
print(f"📁 Tamanho: {len(readme)} caracteres")
