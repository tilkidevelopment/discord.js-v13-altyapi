Write-Host ""
Write-Host "                          / \  //\" -ForegroundColor Green
Write-Host "            |\___/|      /   \//  \\" -ForegroundColor Green
Write-Host "            /0  0  \__  /    //  | \ \" -ForegroundColor Green
Write-Host "           /     /  \/_/    //   |  \  \" -ForegroundColor Green
Write-Host "           @_^_@'/   \/_   //    |   \   \" -ForegroundColor Green
Write-Host "          //_^_/     \/_ //     |    \    \" -ForegroundColor Green
Write-Host "        ( //) |        \///      |     \     \" -ForegroundColor Green
Write-Host "      ( / /) _|_ /   )  //       |      \     _\" -ForegroundColor Green
Write-Host "    ( // /) '/,_ _ _/  ( ; -.    |    _ _\.-~        .-~~~^-." -ForegroundColor Green
Write-Host "  (( / / )) ,-{        _      `-.|.-~-.           .~         `." -ForegroundColor Green
Write-Host " (( // / ))  '/\      /                 ~-. _ .-~      .-~^-.  \" -ForegroundColor Green
Write-Host " (( /// ))      `.   {            }                   /      \  \" -ForegroundColor Green
Write-Host "  (( / ))     .----~-.\        \-'                 .~         \  `. \^-." -ForegroundColor Green
Write-Host "             ///.----..>        \             _ -~             `.  ^-`  ^-_" -ForegroundColor Green
Write-Host "               ///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~" -ForegroundColor Green
Write-Host "                                                                  /.-~" -ForegroundColor Green
Write-Host " _______ _ _ _    _   _____" -ForegroundColor Green
Write-Host "|__   __(_) | |  (_) |  __ \" -ForegroundColor Green
Write-Host "   | |   _| | | ___  | |  | | _____   __" -ForegroundColor Green
Write-Host "   | |  | | | |/ / | | |  | |/ _ \ \ / /" -ForegroundColor Green
Write-Host "   | |  | | |   <| | | |__| |  __/\ V /" -ForegroundColor Green
Write-Host "   |_|  |_|_|_|\_\_| |_____/ \___| \_(_)" -ForegroundColor Green
Write-Host ""
Write-Host "Baslatmak icin ENTER yap!" -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Burayı kendi dosyanız olarak ayarlatın (yani botun tüm dosyalarını içeren dosya)
cd "$env:USERPROFILE\Desktop\Projeler\Tilki Bot"

# Bot başlatma (node index.js yerinne nodemon'da yazabilirsin)
try {
    Write-Host "Bot baslatiliyor..." -ForegroundColor Green
    node index.js
}
catch {
    Write-Host "Bot baslatilamadi, Script kodlarina bakin." -ForegroundColor Red
}

# Durunca çıkış yapman için enter yap :p
Write-Host "Enter yap ve cik..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
