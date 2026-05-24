#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
História islâmica
"""


class IslamicHistory:
    @staticmethod
    def menu() -> str:
        return (
            "📚 *HISTÓRIA ISLÂMICA*\n\n"
            "• `/historia profetas` — 25 profetas do Alcorão\n"
            "• `/historia muhammad` — Vida do Profeta ﷺ\n"
            "• `/historia califas` — Os 4 califas bem-geridos\n"
            "• `/historia ciencia` — Contribuições científicas\n"
            "• `/historia andaluzia` — Al-Andalus"
        )

    @staticmethod
    def prophets() -> str:
        return (
            "🕊️ *PROFETAS NO ISLAM*\n\n"
            "25 mencionados no Alcorão:\n"
            "Adão, Noé, Abraão, Ismael, Isaac, Jacó, José, Jó, "
            "Moisés, Arão, Davi, Salomão, Elias, Eliseu, Jonas, "
            "Zacarias, João, Jesus, Muhammad ﷺ (último)\n\n"
            "💡 Todos trouxeram a mesma mensagem: adorar Um Deus Único."
        )

    @staticmethod
    def muhammad() -> str:
        return (
            "🌙 *VIDA DO PROFETA MUHAMMAD ﷺ*\n\n"
            "• 570 — Nascimento em Meca\n"
            "• 595 — Casamento com Khadija\n"
            "• 610 — Primeira revelação (Caverna Hira)\n"
            "• 613 — Pregação pública\n"
            "• 622 — Hijra (Migração para Medina)\n"
            "• 630 — Conquista pacífica de Meca\n"
            "• 632 — Última peregrinação e falecimento\n\n"
            "📖 Fonte: As-Sirah an-Nabawiyyah"
        )
