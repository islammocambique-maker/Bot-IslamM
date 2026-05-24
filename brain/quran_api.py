#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Alcorão via API Quran.com
"""

import requests
from utils.helpers import clean_html, validate_verse_ref


class QuranAPI:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "IslamMBot/1.0",
            "Accept": "application/json"
        })
        self.base_url = "https://api.quran.com/api/v4"

    def get_verse(self, surah: int, ayah: int) -> str:
        """Busca versículo específico"""
        try:
            # Texto árabe
            r = self.session.get(
                f"{self.base_url}/quran/verses/uthmani",
                params={"verse_key": f"{surah}:{ayah}"},
                timeout=10
            )
            r.raise_for_status()
            data = r.json()

            if not data.get("verses"):
                return "❌ Versículo não encontrado."

            arabic = data["verses"][0].get("text_uthmani", "")

            # Tradução (português ID 92, ou inglês 131 como fallback)
            trans = ""
            for tid in [92, 131]:
                try:
                    tr = self.session.get(
                        f"{self.base_url}/quran/translations/{tid}",
                        params={"verse_key": f"{surah}:{ayah}"},
                        timeout=10
                    )
                    if tr.status_code == 200:
                        tdata = tr.json()
                        if tdata.get("translations"):
                            trans = clean_html(tdata["translations"][0].get("text", ""))
                            break
                except:
                    continue

            # Info da surata
            info = ""
            try:
                ir = self.session.get(f"{self.base_url}/chapters/{surah}", timeout=10)
                if ir.status_code == 200:
                    ch = ir.json().get("chapter", {})
                    info = f"{ch.get('name_simple', '')} ({ch.get('translated_name', {}).get('name', '')})"
            except:
                pass

            result = f"📖 *Alcorão {surah}:{ayah}*\n"
            if info:
                result += f"📚 {info}\n"
            result += f"\n🕌 *Árabe:*\n`{arabic}`\n"
            if trans:
                result += f"\n🇧🇷 *Tradução:*\n{trans}\n"
            result += "\n🌐 quran.com"
            return result

        except requests.exceptions.RequestException as e:
            return f"🌐 Erro de conexão: {str(e)}"
        except Exception as e:
            return f"⚠️ Erro: {str(e)}"

    def get_random(self) -> str:
        """Versículo aleatório inspirador"""
        import random
        verses = [(2, 286), (39, 53), (94, 5), (2, 153), (13, 28), (49, 13), (5, 32)]
        s, a = random.choice(verses)
        return self.get_verse(s, a)

    def search(self, keyword: str) -> str:
        """Busca por palavra-chave (mapeamento simples)"""
        mapping = {
            "paz": (5, 16), "misericordia": (1, 1), "jesus": (3, 45),
            "maria": (19, 16), "justica": (4, 135), "perdao": (39, 53),
        }
        k = keyword.lower()
        if k in mapping:
            s, a = mapping[k]
            return self.get_verse(s, a)
        return f"🔍 Tente formatar como `/quran 2:255` ou digite `/quran` para ajuda."

    def help(self) -> str:
        return (
            "📖 *ALCORÃO ONLINE*\n\n"
            "Fonte: api.quran.com\n\n"
            "*Uso:*\n"
            "`/quran 2:255` — Versículo específico\n"
            "`/quran aleatorio` — Versículo inspirador\n"
            "`/quran buscar paz` — Busca por tema\n\n"
            "Suratas populares: 1 (Fatiha), 2 (Baqarah), 36 (Ya-Sin), 112 (Ikhlas)"
        )
