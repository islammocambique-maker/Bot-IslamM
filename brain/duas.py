#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Duãs (súplicas)
"""

import random


class Duas:
    def __init__(self):
        self.collection = [
            {
                "nome": "Ao acordar",
                "arabe": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
                "trans": "Alhamdu lillahi alladhi ahyana ba'da ma amatana",
                "pt": "Louvor a Deus que nos deu vida depois da morte, e a Ele é o retorno."
            },
            {
                "nome": "Antes de dormir",
                "arabe": "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
                "trans": "Bismika Allahumma amutu wa ahya",
                "pt": "Em Teu nome, ó Allah, eu morro e vivo."
            },
            {
                "nome": "Para conhecimento",
                "arabe": "رَبِّ زِدْنِي عِلْمًا",
                "trans": "Rabbi zidni ilma",
                "pt": "Meu Senhor, aumenta-me em conhecimento."
            },
            {
                "nome": "Proteção",
                "arabe": "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
                "trans": "A'udhu billahi minash-shaytanir-rajim",
                "pt": "Busco proteção em Deus contra Satanás, o condenado."
            },
        ]

    def random(self) -> str:
        d = random.choice(self.collection)
        return (
            f"🤲 *{d['nome'].upper()}*\n\n"
            f"🕌 `{d['arabe']}`\n\n"
            f"📝 _{d['trans']}_\n\n"
            f"🇧🇷 {d['pt']}"
        )

    def help(self) -> str:
        return "🤲 *DUÃS*\n\n`/dua` — Súplica aleatória com árabe, transliteração e português"
