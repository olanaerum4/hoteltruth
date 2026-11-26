# døgn.no – Norge på ett døgn (prototype)

En enkel, statisk side med tellere som tikker gjennom døgnet. Alt ligger i `index.html`,
og siden har ingen byggesteg eller avhengigheter.

## Slik fungerer tallene
- Hvert tall har et **årstall** fra en offentlig kilde (SSB, Statens vegvesen, Avinor, OFV, Sjømatrådet …).
- Årstall ÷ dager i året = et **snittdøgn**.
- Snittdøgnet fordeles time for time etter et **døgnmønster** (`PROFILES` i koden), f.eks. rushtrafikk for bompenger.
- Telleren nullstilles ved midnatt **norsk tid** (Europe/Oslo), uansett hvor den besøkende er.
- Siden sier tydelig at dette er beregnede snitt, ikke sanntidsmålinger.

## Før lansering
Årstallene i `STATS` er omtrentlige prototypeverdier. **Sjekk hvert tall mot kilden** og oppdater `annual` og `year`.

## Legge til et nytt tall
Legg til et objekt i `STATS` med `annual`, `kind` (`count`/`money`/`energy`), `profile`, kilde og to setningsformer
(`inv` = «Siden midnatt i dag **har det** …», `plain` = «… og **nordmenn har** …»).

## Publisering
Last opp `index.html` til et hvilket som helst statisk vertskap (Vercel, Netlify, Cloudflare Pages, GitHub Pages)
og pek domenet dit. døgn.no er et IDN-domene; i DNS-oppsett heter det `xn--dgn-0na.no`.
