#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Funções utilitárias
"""

import re


def clean_html(text: str) -> str:
    """Remove tags HTML"""
    clean = re.sub(r'<[^>]+>', '', text)
    return clean.strip()


def validate_verse_ref(ref: str):
    """Valida referência do Alcorão. Retorna (surah, ayah) ou (None, None)"""
    try:
        if ":" not in ref:
            return None, None
        surah, ayah = ref.split(":", 1)
        surah = int(surah)
        ayah = int(ayah.split("-")[0])
        if 1 <= surah <= 114 and ayah >= 1:
            return surah, ayah
    except (ValueError, IndexError):
        pass
    return None, None


def truncate(text: str, max_len: int = 4000) -> str:
    """Trunca para limite do Telegram"""
    if len(text) <= max_len:
        return text
    return text[:max_len - 3] + "..."
