$ErrorActionPreference = 'Stop'
$directory = Join-Path $PSScriptRoot '../assets/pieces'
$parts = 'base', 'corpo', 'colarinho', 'topo'
$names = 'rei', 'rainha', 'torre', 'bispo', 'cavalo', 'peao'
$variants = 'clara', 'escura'
$expected = foreach ($name in $names) {
    foreach ($variant in $variants) { "$name-$variant.svg" }
}
$files = @(Get-ChildItem -LiteralPath $directory -File -Filter '*.svg')
if (Compare-Object ($expected | Sort-Object) ($files.Name | Sort-Object) -CaseSensitive) {
    throw 'Expected exactly the six pieces in both variants.'
}
foreach ($file in $files) {
    [xml]$document = [IO.File]::ReadAllText($file.FullName)
    $root = $document.DocumentElement
    if ($root.LocalName -cne 'svg' -or $root.NamespaceURI -cne 'http://www.w3.org/2000/svg' -or $root.GetAttribute('viewBox') -cne '0 0 100 100') {
        throw "$($file.Name): invalid SVG root or viewBox."
    }
    $identified = @($root.SelectNodes('.//*[@id]'))
    $ids = @($identified | ForEach-Object { $_.GetAttribute('id') })
    if ($ids.Count -ne $parts.Count -or (Compare-Object ($parts | Sort-Object) ($ids | Sort-Object) -CaseSensitive)) {
        throw "$($file.Name): expected one ID per part."
    }
    foreach ($part in $identified) {
        if ($part.LocalName -cne 'g' -or $part.NamespaceURI -cne $root.NamespaceURI -or -not $part.SelectSingleNode('./*')) {
            throw "$($file.Name): each identified part must be a nonempty SVG group."
        }
    }
}
Write-Output "Validated $($files.Count) SVGs."
