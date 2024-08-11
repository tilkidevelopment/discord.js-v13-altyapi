@echo off

REM Bot başlatmak kolay olsun diye bat ve ps1 koydum
powershell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0start-bot.ps1'"
