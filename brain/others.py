#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Outros tópicos
"""


class Others:
    @staticmethod
    def menu() -> str:
        return (
            "📖 *OUTROS TÓPICOS*\n\n"
            "• `/outros ramadan` — Mês do jejum\n"
            "• `/outros hajj` — Peregrinação\n"
            "• `/outros zakat` — Caridade obrigatória\n"
            "• `/outros alimentos` — O que é halal\n"
            "• `/outros mulheres` — Direitos das mulheres"
        )

    @staticmethod
    def ramadan() -> str:
        return (
            "🌙 *RAMADÃ*\n\n"
            "Nono mês do calendário islâmico.\n\n"
            "*O que se faz:*\n"
            "• Jejum do amanhecer ao pôr do sol\n"
            "• Suhur (refeição pré-amanhecer)\n"
            "• Iftar (ruptura do jejum)\n"
            "• Tarawih (orações noturnas)\n"
            "• Zakat al-Fitr (caridade do fim do Ramadã)\n\n"
            "*Quem é isento:*\n"
            "Doentes, viajantes, grávidas, amamentando, idosos, crianças"
        )

    @staticmethod
    def halal() -> str:
        return (
            "🍽️ *ALIMENTOS (HALAL)*\n\n"
            "*Permitido:*\n"
            "• Boi, carneiro, cabra, camelo, frango\n"
            "• Peixe com escamas\n"
            "• Frutas, vegetais, grãos\n\n"
            "*Proibido (Haram):*\n"
            "• Carne de porco\n"
            "• Animais mortos sem sacrifício\n"
            "• Sangue\n"
            "• Bebidas alcoólicas\n"
            "• Drogas intoxicantes\n\n"
            "🔪 Sacrifício deve ser em nome de Allah, de forma humanitária."
        )
