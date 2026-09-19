from pathlib import Path
p=Path('outputs/preview-quiz-herzlinien.html')
s=p.read_text()
a=s.index('h=`<section');b=s.index('`}\nelse if(step<7)',a)
landing=s[a:b]
changes={
'<h1>Welche Liebe passt<br>wirklich zu dir?</h1>':'<h1>Was verraten deine Handlinien<br>über dein Liebesleben?</h1>',
'Erhalte deine persönliche Liebeslandkarte: was dir in der Liebe wichtig ist, welche Nähe du brauchst und welche Muster du hinter dir lassen möchtest.':'Lade ein Foto deiner Hand hoch und erhalte deine persönliche Liebeslandkarte: mit hervorgehobenen Linien, symbolischen Markierungen und einer individuellen Deutung deiner aktuellen Verbindung und deiner nächsten Kapitel in der Liebe.',
'<span class="eyebrow">Dein Herzlinien-Porträt</span>':'<span class="eyebrow">Deine Liebeslandkarte</span>',
'<strong>Was dein Herz braucht</strong><br><small>Deine Wünsche an Nähe und Gegenseitigkeit.</small>':'<strong>Deine Handlinien</strong><br><small>Auf deinem Foto hervorgehoben und verständlich erklärt.</small>',
'<strong>Was du verändern möchtest</strong><br><small>Die Muster, die du selbst wiedererkennst.</small>':'<strong>Deine Verbindung</strong><br><small>Eine persönliche Deutung zu deiner aktuellen Liebessituation.</small>',
'<strong>Was zu dir passen könnte</strong><br><small>Dein persönlicher Kompass für eine stimmige Beziehung.</small>':'<strong>Deine nächsten Kapitel</strong><br><small>Symbolische Wegpunkte für das, was du dir in der Liebe wünschst.</small>',
'Meine Liebeslandkarte entdecken':'Meine Liebeslandkarte erhalten',
'<button class="cta" id="start">Meine Liebeslandkarte erhalten</button>':'<button class="cta" id="start">Meine Liebeslandkarte erhalten</button><p class="audience-copy">Für dich, wenn du eine neue Liebe erleben möchtest — oder die Beziehung, in der du bereits bist, besser verstehen willst.</p>',
'Vollständiges Porträt ab 34,90 €':'Vollständige Liebeslandkarte ab 34,90 €',
'<span class="eyebrow">Dein Liebesprofil</span><h3>Was sich für dich richtig anfühlt.</h3><p>Deine Antworten ergeben ein persönliches Profil deiner Wünsche und der Beziehungsmuster, die du selbst beschreibst.</p>':'<span class="eyebrow">Deine aktuelle Verbindung</span><h3>Deine Beziehung hat ihren Platz.</h3><p>Ob verheiratet, in einer Partnerschaft oder allein: Deine Antworten geben deiner Deutung den persönlichen Schwerpunkt.</p>',
'Clara Falk begleitet dich durch dein Herzlinien-Porträt. Deine Geschichte bestimmt den Schwerpunkt — damit deine Wünsche und deine Frage Raum bekommen.':'Clara Falk begleitet dich durch deine Liebeslandkarte. Deine Geschichte und deine aktuelle Situation stehen im Mittelpunkt — ob du dir einen neuen Menschen an deiner Seite oder ein neues Kapitel in deiner Beziehung wünschst.',
'Du erhältst ein Profil der Bedürfnisse und Muster, die du in deinen Antworten beschreibst, verbunden mit einer symbolischen Handlesung. Daraus entstehen persönliche Impulse für deine aktuelle Frage an die Liebe.':'Du erhältst dein Handfoto mit hervorgehobenen Linien und symbolischen Markierungen, ergänzt durch eine persönliche Deutung zu deiner Liebessituation. Deine Antworten bestimmen, welche Verbindung und welche Wünsche im Mittelpunkt stehen.',
'<details><summary>Zeigt mir die Hand meinen zukünftigen Partner?</summary>':'<details><summary>Ist die Liebeslandkarte auch für mich, wenn ich verheiratet bin?</summary><p>Ja. Deine Deutung kann sich auf die Beziehung konzentrieren, die du bereits führst. Ein nächstes Kapitel muss kein neuer Mensch sein — es kann auch ein neuer Blick auf eure Verbindung sein.</p></details><details><summary>Zeigt mir die Hand meinen zukünftigen Partner?</summary>',
'das vollständige Porträt':'die vollständige Liebeslandkarte',
'<h2>Welche Liebe wünschst du dir wirklich?</h2>':'<h2>Deine Hand. Deine Verbindung.<br>Deine Liebeslandkarte.</h2>'
}
for old,new in changes.items():
 assert old in landing,old
 landing=landing.replace(old,new)
s=s[:a]+landing+s[b:]
s=s.replace('<title>Herzlinien · Dein persönliches Porträt</title>','<title>Herzlinien · Deine persönliche Liebeslandkarte</title>')
s=s.replace('Welche Liebe passt wirklich zu dir? Deine persönliche Liebeslandkarte aus deinen Antworten und einer symbolischen Handlesung.','Was verraten deine Handlinien über dein Liebesleben? Deine persönliche Liebeslandkarte für deine aktuelle Verbindung und deine nächsten Kapitel in der Liebe.')
s=s.replace('</style>','.audience-copy{max-width:620px;margin:18px auto 12px;font-size:16px;color:var(--green)}.promise-hero h1{font-size:clamp(38px,5.2vw,64px)}@media(max-width:650px){.promise-hero h1 br{display:none}}\n</style>')
p.write_text(s)
print('Página inicial personalizada: promessa, mapa, CTA, inclusão de casadas, Clara e FAQ.')
