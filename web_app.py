#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor web para Islam M Bot
"""

from flask import Flask, render_template, request, jsonify
from bot import IslamMBot

app = Flask(__name__)
bot = IslamMBot()


@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    """API de chat"""
    data = request.get_json()
    message = data.get('message', '')
    response = bot.process(message)
    return jsonify({'response': response})


@app.route('/api/quran/<int:surah>/<int:ayah>')
def api_quran(surah, ayah):
    """API direta para Alcorão"""
    from brain.quran_api import QuranAPI
    q = QuranAPI()
    return jsonify({'text': q.get_verse(surah, ayah)})


@app.route('/api/salat/<city>')
def api_salat(city):
    """API direta para horários"""
    from brain.prayer_api import PrayerAPI
    p = PrayerAPI()
    return jsonify({'text': p.get_times(city)})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
