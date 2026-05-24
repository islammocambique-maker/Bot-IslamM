#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Islam M Bot - Ponto de entrada
"""

import sys
from bot import IslamMBot


def main():
    bot = IslamMBot()

    print("=" * 50)
    print("🌙 ISLAM M BOT")
    print("=" * 50)
    print(bot.greet())
    print("=" * 50)

    while True:
        try:
            user = input("\n👤 Você: ").strip()
            if not user:
                continue
            if user.lower() in ['sair', 'exit', 'quit']:
                print("\n🌙 Assalamu Alaikum!")
                break

            response = bot.process(user)
            print(f"\n🤖 Bot:\n{response}")

        except KeyboardInterrupt:
            print("\n\n🌙 Wa Alaikum Assalam!")
            break
        except Exception as e:
            print(f"\n⚠️ Erro: {e}")


if __name__ == "__main__":
    main()
