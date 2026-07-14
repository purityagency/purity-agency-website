$files = Get-ChildItem -Filter *.html
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    
    # Inject CSP
    $csp = "<meta http-equiv=`"Content-Security-Policy`" content=`"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;`">"
    $content = $content -replace '(?i)(<head>\s*<meta charset="UTF-8">)', "`$1`n$csp"
    
    # Fix Alt tags for Purity Agency
    $content = $content -replace '(<img[^>]*src="[^"]*logo\.(?:webp|png)"[^>]*?alt=")Purity Agency(")', '$1$2'
    
    Set-Content -Path $f.FullName -Value $content -NoNewline
}
