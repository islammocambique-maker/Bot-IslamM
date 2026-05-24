#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Classe principal do Islam M Bot
"""

from brain.quran_api import QuranAPI
from brain.prayer_api import PrayerAPI
from brain.hadiths import Hadiths
from brain.duas import Duas
from brain.salat import Salat
from brain.wudhu import Wudhu
from brain.islamic_history import IslamicHistory
from brain.fiqh import Fiqh
from brain.tawhid import Tawhid
from brain.others import Others


class IslamMBot:
    def __init__(self):
        self.quran = QuranAPI()
        self.prayer = PrayerAPI()
        self.hadiths = Hadiths()
        self.duas = Duas()

    def greet(self) -> str:
        return (
            "🌙 *Assalamu Alaikum!*\n\n"
            "Sou o *Islam M Bot* — assistente educacional sobre Islam.\n"
            "Busco dados de fontes online confiáveis.\n\n"
            "💬 *Comandos principais:*\n"
            "`/quran [ref]` — Alcorão (ex: 2:255)\n"
            "`/salat [cidade]` — Horários de oração\n"
            "`/hadith` — Hadith aleatório\n"
            "`/dua` — Súplica do dia\n"
            "`/wudhu` — Como fazer ablução\n"
            "`/ajuda` — Todos os comandos\n\n"
            "🤝 Respeito e paz para todos!"
        )

    def process(self, message: str) -> str:
        msg = message.lower().strip()

        if msg.startswith('/'):
            return self._command(msg)
        return self._faq(msg)

    def _command(self, cmd: str) -> str:
        parts = cmd.split()
        base = parts[0]
        args = parts[1:] if len(parts) > 1 else []

        if base == '/quran':
            if not args:
                return self.quran.help()
            arg = " ".join(args)
            if arg in ['aleatorio', 'random']:
                return self.quran.get_random()
            if arg.startswith('buscar '):
                return self.quran.search(arg[7:])
            # Tenta interpretar como referência
            from utils.helpers import validate_verse_ref
            s, a = validate_verse_ref(arg)
            if s:
                return self.quran.get_verse(s, a)
            return self.quran.help()

        elif base == '/salat':
            if not args:
                return self.prayer.get_times()
            city = " ".join(args)
            return self.prayer.get_times(city)

        elif base == '/hadith':
            return self.hadiths.random()

        elif base == '/dua':
            return self.duas.random()

        elif base == '/wudhu':
            return Wudhu.instructions()

        elif base == '/salat_como':
            return Salat.instructions()

        elif base == '/historia':
            if args and args[0] == 'profetas':
                return IslamicHistory.prophets()
            if args and args[0] == 'muhammad':
                return IslamicHistory.muhammad()
            return IslamicHistory.menu()

        elif base == '/fiqh':
            return Fiqh.menu()

        elif base == '/tawhid':
            return Tawhid.explanation()

        elif base == '/outros':
            if args and args[0] == 'ramadan':
                return Others.ramadan()
            if args and args[0] == 'alimentos':
                return Others.halal()
            return Others.menu()

        elif base in ['/ajuda', '/help']:
            return self._help()

        return "❓ Comando não reconhecido. Digite `/ajuda`."

    def _faq(self, msg: str) -> str:
        if any(w in msg for w in ['o que é o islam', 'definição']):
            return "🌙 *ISLAM* = submissão à vontade de Deus. Paz através dessa submissão. Mesma mensagem de todos os profetas desde Adão até Muhammad ﷺ."

        if any(w in msg for w in ['profeta', 'muhammad', 'maomé']):
            return "🕊️ *Muhammad ﷺ* — último profeta, humano não divino, exemplo de honestidade e misericórdia. Nascido em Meca em 570 d.C."

        if any(w in msg for w in ['alcorão', 'corão', 'livro sagrado']):
            return "📖 *Alcorão* — palavra de Deus revelada a Muhammad ﷺ. 114 suratas. Preservado em árabe. Use `/quran 2:255` para ler."

        if any(w in msg for w in ['matar incrédulos', '9:5', 'guerra santa']):
            return "⚖️ Versículos de 'guerra' foram revelados em contexto específico de defesa no século VII. O Islam proíbe matar inocentes (5:32) e garante liberdade religiosa (2:256)."

        if any(w in msg for w in ['terrorista', 'terrorismo']):
            return "🌍 Terroristas não representam o Islam. 1.8 bilhão de muçulmanos vivem em paz. O terrorismo é condenado por todos os conselhos islâmicos."

        if any(w in msg for w in ['jesus', 'cristo']):
            return "✝️🤝☪️ Os muçulmanos creem em Jesus como profeta, nascido da Virgem Maria, realizou milagres. Mas não cremos que é Deus ou foi crucificado."

        if any(w in msg for w in ['pilares', '5 pilares']):
            return "🕋 *5 Pilares:* 1) Shahada (fé), 2) Salat (oração), 3) Zakat (caridade), 4) Sawm (jejum), 5) Hajj (peregrinação)."

        if any(w in msg for w in ['creem em', 'acreditam']):
            return "🕌 *6 Artigos de Fé:* Deus Único, anjos, livros revelados, profetas, Dia do Juízo, decreto divino."

        return "🤔 Digite `/ajuda` para ver todos os comandos disponíveis."

    def _help(self) -> str:
        return (
            "📋 *COMANDOS*\n\n"
            "📖 `/quran [ref]` — Alcorão (ex: 2:255, 1:1-7)\n"
            "🕌 `/salat [cidade]` — Horários de oração\n"
            "📜 `/hadith` — Hadith aleatório\n"
            "🤲 `/dua` — Súplica com árabe\n"
            "💧 `/wudhu` — Como fazer ablução\n"
            "🙏 `/salat_como` — Como orar\n"
            "📚 `/historia` — História islâmica\n"
            "☝️ `/tawhid` — Unicidade de Deus\n"
            "⚖️ `/fiqh` — Jurisprudência\n"
            "📖 `/outros` — Mais tópicos\n\n"
            "🌐 Fontes: quran.com | aladhan.com\n"
            "📞 Suporte: 860407269"
        )
