#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Horários de Salat via API Aladhan
"""

import requests
from datetime import datetime
from geopy.geocoders import Nominatim


class PrayerAPI:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "IslamMBot/1.0"})
        self.geolocator = Nominatim(user_agent="IslamMBot")
        self.base_url = "https://api.aladhan.com/v1"

    def get_times(self, city: str = "São Paulo", country: str = "Brazil") -> str:
        try:
            loc = self.geolocator.geocode(f"{city}, {country}")
            if not loc:
                return f"❌ Cidade '{city}' não encontrada."

            date = datetime.now().strftime("%d-%m-%Y")
            r = self.session.get(
                f"{self.base_url}/timings/{date}",
                params={
                    "latitude": loc.latitude,
                    "longitude": loc.longitude,
                    "method": 2,
                },
                timeout=15
            )
            r.raise_for_status()
            data = r.json()

            if data.get("code") != 200:
                return "⚠️ Erro na API."

            t = data["data"]["timings"]
            d = data["data"]["date"]

            names = {
                "Fajr": "🌅 Fajr", "Sunrise": "🌄 Nascer do sol",
                "Dhuhr": "☀️ Dhuhr", "Asr": "🌤️ Asr",
                "Maghrib": "🌇 Maghrib", "Isha": "🌙 Isha"
            }

            result = (
                f"🕌 *HORÁRIOS DE ORAÇÃO*\n"
                f"📍 {city}\n"
                f"📅 {d['readable']}\n"
                f"🌙 {d['hijri']['day']} {d['hijri']['month']['en']} {d['hijri']['year']} AH\n\n"
            )

            for k, v in names.items():
                result += f"{v}: `{t.get(k, '--:--')}`\n"

            result += "\n🌐 aladhan.com"
            return result

        except Exception as e:
            return f"⚠️ Erro: {str(e)}"

    def help(self) -> str:
        return (
            "🕌 *HORÁRIOS DE SALAT*\n\n"
            "Fonte: api.aladhan.com\n\n"
            "*Uso:*\n"
            "`/salat` — São Paulo (padrão)\n"
            "`/salat Rio de Janeiro`\n"
            "`/salat Lisboa Portugal`\n\n"
            "Usa cálculos astronômicos padrão (método ISNA)."
        )
