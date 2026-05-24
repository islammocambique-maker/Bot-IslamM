# 🤖 Islam M Bot

Bot educacional sobre Islam para Telegram. Responde perguntas de muçulmanos e não-muçulmanos com respeito e base em fontes confiáveis.

## 🌐 Fontes Online

| Recurso | API |
|---------|-----|
| Alcorão | [Quran.com API](https://api.quran.com) |
| Horários de Salat | [Aladhan API](https://aladhan.com/prayer-times-api) |
| Hadiths | Coleção Sahih Bukhari & Muslim |

## 🚀 Instalação

```bash
# Clone
git clone https://github.com/seu-usuario/islam_m_bot.git
cd islam_m_bot

# Ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Dependências
pip install -r requirements.txt

# Configure
cp config.py.example config.py
# Edite config.py com seu TOKEN do Telegram

# Execute
python main.py
