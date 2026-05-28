
readme_content = """# ☪ Islam M Bot

**Assistente de Conhecimento Islâmico Inteligente** — Um chatbot web que responde perguntas sobre o Islam, Alcorão, práticas religiosas e conceitos islâmicos, com suporte a múltiplas fontes de conhecimento.

---

## 🚀 Funcionalidades

- **🤖 Chatbot Inteligente** — Responde perguntas sobre Islam usando um "cérebro" de conhecimento modular
- **📖 Versículos do Alcorão** — Busca textos em árabe e tradução em português via API (QuranEnc, Al-Quran Cloud, Quran.com)
- **🧠 Cérebro Modular** — Carrega conhecimento de pastas externas em formato JSON ou texto
- **🔍 Busca Inteligente** — Encontra a melhor resposta avaliando múltiplas palavras-chave simultaneamente
- **📜 Histórico de Respostas** — Botão "Ver anteriores" para consultar respostas passadas
- **📱 Responsivo** — Funciona perfeitamente em mobile e desktop
- **🌐 Suporte Multilingue** — Keywords com ou sem acentos, maiúsculas/minúsculas

---

## 📁 Estrutura do Projeto

```
📦 Bot-IslamM/
├── 📄 index.html          # Página principal do chatbot
├── 📁 cerebro/            # Base de conhecimento (cérebro)
│   ├── 📁 definicao/      # Conceitos e definições islâmicas
│   │   ├── Janazah
│   │   ├── adoracao_ibadah
│   │   ├── comportamento
│   │   ├── crenca_aquidah
│   │   ├── crianca_educacao_bobecas
│   │   ├── familia_direitos
│   │   ├── fiqh
│   │   ├── historia_islamica
│   │   ├── mulheres_do_profeta
│   │   ├── palavras
│   │   ├── perguntas_frequentes
│   │   └── ramadan
│   ├── 📁 extra/
│   │   └── extra_bot
│   ├── 📁 mais/
│   │   └── mais_conhecimento
│   └── 📁 pratica/        # Práticas religiosas
│       ├── salat
│       └── Wudhu
└── 📄 README.md           # Este ficheiro
```

---

## 🧠 Formato do Cérebro

Os ficheiros do cérebro aceitam **dois formatos**:

### 1. JSON (Recomendado)

```json
[
  {
    "palavras_chave": ["crianças", "jovens", "aqiqah", "nasce com", "fitrah"],
    "resposta": "O Islam dá grande importância à educação desde o berço...",
    "fonte": "Alcorão (96:1-5); Sahih al-Bukhari (5150)",
    "categoria": "Educação",
    "nivel": "Fundamental",
    "links": ["https://facebook.com/Islamguia"]
  },
  {
    "palavras_chave": ["fotos", "imagens", "quadros", "retratos", "proibição"],
    "resposta": "O Islam traça limites claros na criação de imagens...",
    "fonte": "Alcorão (5941-5950); Sahih Muslim (5268-5272)",
    "categoria": "Fiqh",
    "nivel": "Intermediário",
    "links": ["https://facebook.com/Islamguia"]
  }
]
```

### 2. Texto Simples

```
palavras_chave: wudu, ablucao, limpeza
resposta: O Wudu é a purificação ritual obrigatória antes da oração...
fonte: Sahih al-Bukhari
---
palavras_chave: salat, oracao, namaz
resposta: A Salat é um dos Cinco Pilares do Islam...
fonte: Al-Quran 2:238
```

---

## 🎯 Como Funciona a Busca

O bot usa um algoritmo de **matching inteligente**:

1. **Normalização** — Remove acentos e converte tudo para minúsculas
2. **Avaliação por entrada** — Compara TODAS as palavras da pergunta com TODAS as keywords de cada entrada
3. **Pontuação**:
   - Match exato: **+10 pontos**
   - Keyword contém palavra: **+5 pontos**
   - Palavra contém keyword: **+3 pontos**
   - Bônus por múltiplas matches na mesma entrada: **+2 por keyword extra**
4. **Seleção** — Escolhe a entrada com maior score (mínimo: 3 pontos)

### Exemplos de Perguntas

| Pergunta | Resposta Esperada |
|---|---|
| `2:155` | Versículo do Alcorão com árabe + português |
| `crianças educação` | Educação islâmica infantil |
| `imagens proibição` | Regras sobre criação de imagens |
| `respeito pais` | Deveres com os pais no Islam |
| `wudhu` | Como fazer a ablução |
| `salat` | Horários e regras da oração |

---

## 🛠️ Como Usar

### 1. Clonar o Repositório

```bash
git clone https://github.com/islammocambique-maker/Bot-IslamM.git
cd Bot-IslamM
```

### 2. Adicionar Conhecimento

Crie ou edite ficheiros em `cerebro/` seguindo o formato JSON ou texto.

### 3. Abrir no Navegador

Abra o ficheiro `index.html` diretamente no navegador ou hospede em qualquer servidor web:

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx serve .

# Opção 3: PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

---

## 🌐 Deploy no GitHub Pages

1. Faça push do projeto para um repositório GitHub
2. Vá em **Settings → Pages**
3. Selecione a branch `main` e pasta `/ (root)`
4. O bot estará disponível em: `https://seuusuario.github.io/Bot-IslamM/`

---

## 📞 Suporte

| Canal | Contacto |
|---|---|
| 📱 WhatsApp | [+258 860407269](https://wa.me/258860407269) |
| ✉️ Email | [Islammocambique@gmail.com](mailto:Islammocambique@gmail.com) |
| 📘 Facebook | [Islam Guia](https://www.facebook.com/islamguia) |

---

## 📝 APIs Utilizadas

| API | Função |
|---|---|
| [QuranEnc](https://quranenc.com) | Tradução português (Helmi Nasr) |
| [Al-Quran Cloud](https://alquran.cloud) | Texto árabe + tradução alternativa |
| [Quran.com API v4](https://api.quran.com) | Fallback para versículos |

---

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona novo tema'`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de código aberto para uso educativo e religioso.

---

<p align="center">
  <strong>☪ Islam M Bot</strong><br>
  <em>"E buscai conhecimento desde o berço até à tumba"</em><br>
  <small>— Profeta Muhammad (SAAW)</small>
</p>
"""

with open('/mnt/agents/output/README.md', 'w', encoding='utf-8') as f:
    f.write(readme_content)

print("README.md criado com sucesso!")
print(f"Tamanho: {len(readme_content)} caracteres")
