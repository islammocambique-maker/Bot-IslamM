#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Integração com Telegram
"""

import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from bot import IslamMBot

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

bot = IslamMBot()
TOKEN = os.getenv("BOT_TOKEN", "")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(bot.greet(), parse_mode="Markdown")

async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(bot._help(), parse_mode="Markdown")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    response = bot.process(update.message.text)
    await update.message.reply_text(response, parse_mode="Markdown")

def main():
    if not TOKEN:
        print("❌ Defina BOT_TOKEN no ambiente!")
        return

    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("ajuda", help_cmd))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("🤖 Bot iniciado no Telegram!")
    app.run_polling()

if __name__ == "__main__":
    main()
