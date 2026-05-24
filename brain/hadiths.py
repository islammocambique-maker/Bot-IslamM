#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hadiths autênticos
"""

import random


class Hadiths:
    def __init__(self):
        self.collection = [
            {
                "narrador": "Umar ibn al-Khattab",
                "fonte": "Sahih al-Bukhari",
                "texto": "Um dia estávamos com o Mensageiro de Allah ﷺ quando um homem com vestes brancas perguntou: 'Informe-me sobre o Islam.' O Profeta respondeu: 'O Islam é que testemunhes que não há divindade exceto Allah e que Muhammad é o Mensageiro de Allah, que establishes a oração, pagues o zakat, jejues o Ramadã e peregrines à Casa se tiveres meios.'"
            },
            {
                "narrador": "Abu Hurairah",
                "fonte": "Sahih Muslim",
                "texto": "O Mensageiro de Allah ﷺ disse: 'Não sereis verdadeiros crentes até que tenhais misericórdia uns dos outros.' Disseram: 'Todos nós somos misericordiosos!' Ele respondeu: 'Não é a misericórdia que um de vós tem para com seu companheiro, mas sim a misericórdia geral para com todos.'"
            },
            {
                "narrador": "Aisha",
                "fonte": "Sahih al-Bukhari",
                "texto": "O Mensageiro de Allah ﷺ disse: 'Allah é Gentil e ama a gentileza em todos os assuntos.'"
            },
            {
                "narrador": "Abu Hurairah",
                "fonte": "Sahih Muslim",
                "texto": "O Mensageiro de Allah ﷺ disse: 'Allah disse: Meu servo não se aproxima de Mim com nada mais amado do que as obrigações que lhe prescrevi. Meu servo continua se aproximando de Mim com atos voluntários até que Eu o ame.'"
            },
            {
                "narrador": "Jabir ibn Abdullah",
                "fonte": "Sahih Muslim",
                "texto": "O Mensageiro de Allah ﷺ disse: 'A piedade é aqui' — apontando para o peito — 'É suficiente pecado para uma pessoa desprezar seu irmão muçulmano. Todo muçulmano é sagrado para outro muçulmano: sua vida, sua honra e sua propriedade.'"
            },
        ]

    def random(self) -> str:
        h = random.choice(self.collection)
        return (
            f"📜 *HADITH*\n\n"
            f"📝 {h['narrador']}\n"
            f"📚 {h['fonte']}\n\n"
            f"❝ {h['texto']} ❞"
        )

    def help(self) -> str:
        return "📜 *HADITHS*\n\n`/hadith` — Hadith aleatório de Sahih Bukhari ou Muslim"
