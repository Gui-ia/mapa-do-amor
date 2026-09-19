import csv,json
from pathlib import Path
out=Path('/Users/oguiillhermesantos/Documents/Codex/2026-09-16/new-chat/outputs')
# Each row is one selected public discussion, not one person or a representative sample.
rows=[
('R01','Reddit','2025-06','Seelenverwandten verlieren','https://www.reddit.com/user/cheesmel/comments/1lc8edy/seelenverwandten_verlieren/','Post; sem comentários substantivos disponíveis','Ich kann nicht aufhören, an ihn zu denken.','Não consigo parar de pensar nele.','Após anos de separação, a pessoa continua pensando no ex e relata dificuldade de se envolver novamente.','Apego a uma ligação que parece insubstituível','Testar uma entrada para quem continua emocionalmente ligado ao passado.','Não comprova interesse em leitura paga.'),
('R02','Reddit','2026-02','Wie findet man in der heutigen, komischen Welt eine Seelenverwandte?','https://www.reddit.com/r/FragtMaenner/comments/1qxgty1/wie_findet_man_in_der_heutigen_komischen_welt/','Post e trechos de comentários','wie nach Hause kommen','como chegar em casa','O autor deseja companhia cotidiana; uma resposta descreve uma relação na qual não precisa provar seu valor.','Desejo de pertencimento e tranquilidade','Testar a transformação emocional de um amor em que a pessoa possa relaxar e ser aceita.','Autor do post é homem; não tratar como pesquisa exclusiva com mulheres.'),
('R03','Reddit','2023-01','Habt ihr jemals die Erfahrung mit einem Seelenverwandten gemacht?','https://www.reddit.com/r/beziehungen/comments/106x3y6/habt_ihr_jemals_die_erfahrung_mit_einem/','Post e trechos de comentários','es fühlt sich so Leer an','parece tão vazio','Depois de uma separação, outras conexões parecem vazias. O autor recorre também ao conceito de Dualseele para explicar a experiência.','Medo de nunca mais viver uma conexão equivalente','Explorar a pergunta sobre o próximo capítulo amoroso sem afirmar que existe apenas uma pessoa possível.','Os termos místicos aparecem como interpretação pessoal, não como fatos verificados.'),
('R04','Reddit','2026-07','Glaubt ihr an Seelenverwandte?','https://www.reddit.com/r/FragReddit/comments/1v7v0b2/glaubt_ihr_an_seelenverwandte/','Post e trechos de comentários','','','Há discordância entre uma única pessoa predestinada e pessoas com quem existe grande afinidade.','Ambiguidade da promessa de alma gêmea','Definir o significado usado no produto; testar conexão e afinidade sem impor destino único.','Comentários não estimam a prevalência de crença na Alemanha.'),
('R05','Reddit','2025-12','Wie und in welchem Alter habt ihr euren Seelenverwandten gefunden?','https://www.reddit.com/r/FragReddit/comments/1pkl32f/wie_und_in_welchem_alter_habt_ihr_euren/','Trechos de comentários','Seelenverwandte nicht unbedingt für immer bleiben','almas gêmeas não necessariamente ficam para sempre','Um comentário relata o fim de uma conexão intensa; outros descrevem relações duradouras e diferentes idades de encontro.','Reconciliar a importância de um amor com o seu fim','Testar um caminho de recomeço que preserve o significado da história anterior.','Diversidade de relatos, sem base para prometer idade ou data de encontro.'),
('R06','Reddit','2020-12','Leute, die an Astrologie glauben: Warum?','https://www.reddit.com/r/FragReddit/comments/kcfq09/leute_die_an_astrologie_glauben_warum/','Post e trechos de comentários','weniger ein Glaubenssystem als eine Sprache','menos um sistema de crenças do que uma linguagem','Participante usa astrologia como linguagem pessoal e evita conversar sobre isso com quem despreza o tema.','Curiosidade com dúvidas; receio de julgamento','Uma experiência íntima, visual e acessível pode acolher quem não se identifica como crente absoluto.','Histórico de 2020; a relação entre discrição e conversão é hipótese.'),
('R07','Reddit','2022-06','BIDA wenn ich Sternzeichen lächerlich finde?','https://www.reddit.com/r/BinIchDasArschloch/comments/vbj8ln/bida_wenn_ich_sternzeichen_l%C3%A4cherlich_finde/','Post e trechos de comentários','','','O autor relata conflito após contestar a crença de uma amiga em compatibilidade de signos. Há críticas e discussão sobre respeito.','Risco de ridicularização social','Evitar uma apresentação que exija defender publicamente a crença para participar.','Relato sobre uma amiga; não é depoimento direto dela nem pesquisa de compradores.'),
('R08','Reddit','2022-12','Tarot is mein Hobby, AMA','https://www.reddit.com/r/de_IAmA/comments/zmgcgn/tarot_is_mein_hobby_ama/','Post e trechos de comentários','Selbstreflexion und Perspektive','autorreflexão e perspectiva','Praticante valoriza reflexão e o aspecto visual dos baralhos. Relata gasto acumulado elevado com o hobby.','Ritual, estética e interpretação pessoal','Investir no objeto visual que a pessoa recebe e guarda, além do texto interpretativo.','Gasto com coleção não demonstra disposição para pagar por uma leitura digital.'),
('R09','Reddit','2026-01','Hallo Ihr Lieben — 2. Versuch','https://www.reddit.com/r/Kartenlegekunst/comments/1qg3yhz/hallo_ihr_lieben_2_versuch/','Post e trechos de comentários','','','Participantes tentam estimular uma comunidade de cartomancia em alemão e comentam a dificuldade de obter respostas.','Necessidade de troca em língua alemã','Manter conteúdo e atendimento naturais em alemão; ampliar pesquisa para fóruns especializados.','Voz de praticantes e discussão sobre comunidade, não evidência direta de compra.'),
('R10','Reddit','2025-06','Freund hat sich nach 7 Jahren in eine Frau die er seit 2 Wochen kennt verliebt','https://www.reddit.com/r/beziehungen/comments/1lmn2mw/','Trechos indexados; reabertura direta falhou','','','Autora relata que o parceiro chamou outra mulher de alma gêmea e expressa rejeição a ficar como alternativa.','Desejo de ser escolhida, não mantida em espera','Perguntas sobre reciprocidade podem ser mais relevantes que uma promessa genérica de romance.','Relato não estabelece crença da autora nem permite confirmar a conduta de terceiros.'),
('R11','Reddit','2024-12','Herzschmerz 1 oder Herzschmerz 2? Bin ratlos','https://www.reddit.com/r/beziehungen/comments/1hnq6vy/herzschmerz_1_oder_herzschmerz_2_bin_ratlos/','Post e trechos de comentários','Taten zählen und nicht mehr nur die Worte','as atitudes contam, e não mais apenas as palavras','Autora descreve longa espera por alguém indisponível e passa a exigir atitudes; também teme ser julgada.','Distância entre intensidade sentida e compromisso recebido','Criar uma seção sobre necessidades e reciprocidade declaradas pela cliente.','A foto da mão não revela intenções ou decisões da outra pessoa.'),
('R12','Reddit','2026','Mein Date und mein Körper','https://www.reddit.com/r/Freudeteilen/comments/1tiqhga/mein_date_und_mein_k%C3%B6rper/','Post e trechos de comentários','','','Relato de insegurança com o corpo e de uma experiência acolhedora com um novo encontro, ainda acompanhada de dúvida sobre compromisso.','Ser aceita sem precisar mudar para merecer amor','Testar a ideia de uma relação em que a pessoa não precise demonstrar valor o tempo todo.','Fonte adjacente sobre relacionamentos; nenhum interesse místico demonstrado.'),
('F01','Esoterikforum.at','2020-03','Kartenlegen Erfahrungen Lines','https://www.esoterikforum.at/threads/kartenlegen-erfahrungen-lines.231706/','Post e respostas da página inicial','Ich wurde immer hingehalten','Sempre me mantiveram esperando','Participante critica leituras que prolongavam a espera usando explicações de conexão de almas, mas aceita pagar por trabalho de qualidade.','Cansaço de falsas esperanças; procura por honestidade','Oferecer uma entrega completa e delimitada, sem depender de novas compras para obter a resposta.','Declaração de intenção, sem pagamento ou preço verificados; material histórico.'),
('F02','Esoterikforum.de','2022-09','Erfahrungen mit Karten','https://www.esoterikforum.de/threads/2679660-erfahrungen-mit-karten','Post e trechos de respostas','','','Autora relata consumo repetido de leituras após uma separação, insegurança e desconforto com imagens de tarot; respostas discutem reflexão.','Busca de alívio que pode alimentar mais incerteza','Resultado deve encerrar a experiência com algo utilizável; testar uma estética acolhedora.','Caso individual; não permite caracterizar todos os consumidores do nicho.'),
('F03','Esoterikforum.at','2008-10','Eure Erfahrungen mit dem Kartenlegen','https://www.esoterikforum.at/threads/eure-erfahrungen-mit-dem-kartenlegen.96017/','Post e trechos de respostas','','','Discussão reúne frustrações e avaliações variadas de leituras, incluindo serviços em plataformas comerciais.','Alternativas já experimentadas; confiança desgastada','Mostrar um exemplo completo do que será entregue antes do pagamento.','Histórico de 2008: útil para objeções, não para dimensionar o mercado atual.'),
('F04','Esoterikforum.de','2007-03','Kartenlegen-Channeln','https://www.esoterikforum.de/threads/2565734-kartenlegen-channeln','Trecho indexado; abertura direta falhou','','','Relato contrasta respostas de cartomancia e canalização sobre uma mesma relação, produzindo incerteza.','Confusão causada por interpretações contraditórias','Distinguir observação da imagem, tradição simbólica e respostas dadas no questionário.','Material de 2007 e acesso parcial; não usar como validação comercial atual.'),
('F05','Esoterikforum.de','2010-07','Handlesen','https://www.esoterikforum.de/threads/961094-handlesen','Post e trechos de respostas','mich verwirren die vielen Linien','as muitas linhas me confundem','Pessoa consulta livros e internet, compartilha fotos e recebe pedidos de imagens melhores para distinguir as linhas.','Curiosidade real, dificuldade de interpretar a própria mão','Instrução visual para a foto, verificação de nitidez e marcações sobre a imagem enviada.','Precedente histórico de envio de foto; não comprova conversão atual.'),
('F06','Esoterikforum.at','2011-02','Frage zum Handlesen (Chiromantie)','https://www.esoterikforum.at/threads/frage-zum-handlesen-chiromantie.148887/','Post e trechos de respostas','','','Autora pergunta sobre diferenças entre linhas das mãos e interpretações ligadas ao amor. Respostas divergem sobre a prática.','Querer entender o significado das próprias particularidades','Explicar qual mão foi solicitada e mostrar exatamente a região interpretada.','As interpretações dos participantes não são evidência científica.'),
('F07','Esoterikforum.de','2013-01 a 2013-05','Frage zum Handlesen','https://www.esoterikforum.de/threads/1095702-frage-zum-handlesen','Post e respostas','Was soll ich darunter verstehen?','O que devo entender disso?','Uma pessoa não identifica linhas pelo livro; outra recebeu uma análise escrita e não compreendeu seu significado.','Jargão e leitura genérica deixam a pessoa sem resposta','Cada marcação deve vir acompanhada de explicação cotidiana e pergunta concreta de reflexão.','Histórico de 2013; evidencia fricção de compreensão, não preferência estética atual.'),
('F08','Gutefrage','2022-08','Wie würdet ihr meine Hand lesen (Schicksal)?','https://www.gutefrage.net/frage/wie-wuerdet-ihr-meine-hand-lesen-schicksal','Post e respostas indexadas; abertura direta falhou','','','Pessoa publica imagem para pedir leitura de destino; respostas incluem rejeição e uma interpretação que termina em sarcasmo.','Curiosidade coexistindo com desconfiança','A imagem pode motivar interação; antecipar a objeção de genericidade com transparência sobre a entrega.','A resposta irônica não foi contada como crença ou elogio à prática.'),
('F09','Gutefrage','2023-01','Kartenlegen über Youtube Videos?','https://www.gutefrage.net/frage/kartenlegen-ueber-youtube-videos','Pergunta, respostas e comentários indexados','','','Pessoa interessada questiona como vídeos por signo podem ser pessoais; reconhece identificação com o presente, mas diz que previsões falham.','Desejo de personalização verificável; dúvida sobre previsão','A foto e o contexto declarado precisam influenciar a entrega de modo visível.','Relato individual; identificação subjetiva não comprova acerto de previsão.'),
('F10','Esoterikforum.at','2026-07','Neue Beziehung und schon bald zu Ende?','https://www.esoterikforum.at/threads/neue-beziehung-und-schon-bald-zu-ende.248286/','Post e trechos de respostas','ob mein Bauchgefühl richtig ist, oder ob ich nur Ängste habe','se minha intuição está certa ou se são apenas meus medos','Pessoa em uma relação recente procura leitura diante da dúvida sobre exclusividade e continuidade.','Dificuldade de distinguir intuição de insegurança','Testar esse conflito como pergunta de entrada; entrega organiza percepções, sem alegar detectar traição.','Mesmo autor de F11; não são duas pessoas independentes.'),
('F11','Esoterikforum.at','2026; data relativa exibida como ontem na consulta','Neue Legung wegen Unsicherheit','https://www.esoterikforum.at/threads/neue-legung-wegen-unsicherheit.248437/','Post e trechos de respostas','','','A mesma pessoa de F10 volta a pedir leitura diante de incertezas e mudanças possíveis na relação.','Nova situação reativa a necessidade de confirmação','Planejar uma entrega que ajude a lidar com dúvidas sem criar dependência de atualizações pagas.','Mesma autoria de F10; data exata não normalizada por depender do horário do site.'),
('F12','Esoterikforum.at','2026-05','Professionelle Kartenlegung gesucht','https://www.esoterikforum.at/threads/professionelle-kartenlegung-gesucht.248076/','Post e trechos de respostas','Natürlich gegen Bezahlung','Naturalmente, mediante pagamento','Pessoa solicita indicação de profissional para leitura e declara disposição para pagar.','Busca explícita por serviço profissional','Qualidade percebida e clareza da entrega merecem teste junto com o preço.','Perfil indica Kufstein, Áustria. Interesse em cartomancia, não compra comprovada de quiromancia digital.')
]
keys=['id','plataforma','data_material','titulo','url','acesso','trecho_de','traducao_pt','observacao','tema','hipotese_produto','limite']
data=[dict(zip(keys,r)) for r in rows]
assert len(data)==24 and len({r['url'] for r in data})==24
with (out/'banco-fontes-amor-mistico-alemao.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=keys);w.writeheader();w.writerows(data)
intro='''# Amor, misticismo e leitura da mão: banco qualitativo em alemão

Consulta: 16 de setembro de 2026. Material para desenvolver uma oferta; não é pesquisa representativa de mercado.

## O que foi reunido

24 discussões selecionadas: 12 no Reddit e 12 em fóruns e sites de perguntas em alemão. Foram examinados posts e trechos de comentários acessíveis, não todas as páginas ou respostas de cada discussão. Algumas fontes ficaram disponíveis apenas em trechos indexados, identificados abaixo. A pesquisa anterior de YouTube está em arquivo separado.

Amostra intencional: procuramos situações amorosas e interesse em misticismo, incluindo objeções e relatos negativos. Não se pode inferir a proporção de alemães que acredita, taxa de compra, idade dominante, maioria feminina ou rentabilidade. Idioma alemão não confirma residência na Alemanha. O conjunto inclui homens, mulheres, praticantes, curiosos e céticos; F12 tem localização declarada na Áustria. F10 e F11 têm a mesma autoria.

Há materiais de 2007 a 2026. Os mais antigos servem para levantar linguagem e problemas persistentes a investigar, não para demonstrar demanda atual. Relatos públicos não foram verificados independentemente. Não foram coletados contatos nem enviados comentários ou mensagens.

O acesso direto ao VK foi bloqueado pela política de segurança do navegador. Não há publicações nem comentários do VK neste banco. Não foi tentado contornar o bloqueio.

## Síntese para a oferta — hipóteses, não conclusões de conversão

| Território | Fontes | O que testar |
|---|---|---|
| Intuição ou medo | F10, F11 | Uma pergunta de entrada que reconheça a dúvida sem prometer saber o que o parceiro sente. |
| Um amor que pareça casa | R02, R05, R12 | A transformação desejada de aceitação, descanso e pertencimento. |
| O vínculo que não termina por dentro | R01, R03, R05 | Um percurso para dar significado ao passado e abrir espaço para o próximo capítulo. |
| Ser escolhida de verdade | R10, R11 | Perguntas sobre reciprocidade e a diferença entre promessa e atitude. |
| Misticismo sem adesão absoluta | R04, R06, R08 | Linguagem simbólica que também acomode curiosidade e dúvida. |
| Cansaço de respostas que adiam tudo | F01, F02, F04 | Uma entrega fechada, compreensível e que não dependa de mais pagamentos para fazer sentido. |
| Quero ver o que é meu nessa leitura | F05, F06, F07, F09 | Foto real marcada e interpretação conectada explicitamente ao contexto informado. |
| Procura por trabalho profissional | F01, F12 | Exemplo de resultado, escopo claro e preço a validar em teste. |

## Direção concreta de produto

Nome de trabalho: **Dein Herzlinien-Porträt** — seu retrato da linha do coração.

A experiência proposta é uma leitura simbólica personalizada: a cliente envia a foto, escolhe a questão amorosa e recebe sua própria mão com linhas destacadas, uma interpretação em linguagem cotidiana e um pequeno ritual de reflexão. O impacto visual precisa mostrar a mão enviada, preservando suas características; um desenho genérico enfraqueceria justamente o diferencial pesquisado.

Mecanismo implementável: identificar linhas visíveis na foto, associá-las a uma tradição simbólica declarada e usar as respostas do questionário para contextualizar o texto. Separar visualmente o que foi observado na imagem da interpretação. A IA não pode concluir, pelas linhas, se alguém ama a cliente, se haverá reconciliação ou quando aparecerá uma pessoa. Não simular essas conclusões como descobertas objetivas.

Três caminhos iniciais de questionário, formulados aqui como criação de copy, não citações:

1. **Eine Verbindung verstehen** — entender uma conexão atual.
2. **Mit der Vergangenheit Frieden schließen** — fazer as pazes com o passado.
3. **Mich für neue Liebe öffnen** — abrir espaço para um novo amor.

Entrega sugerida: retrato visual para guardar + interpretação curta em três partes + uma pergunta prática para cada parte. Identificar a região da mão, explicar o simbolismo e conectar ao que a cliente contou. Evitar um relatório longo que apenas multiplique frases vagas.

Hipóteses de mensagem para testar, ainda sem validação por consumidor nativo:

- **Warum lässt mich diese Verbindung nicht los?** — Por que essa conexão não me deixa seguir em frente?
- **Ich wünsche mir eine Liebe, die sich wie Zuhause anfühlt.** — Quero um amor que pareça um lar.
- **Deine Hand. Deine Geschichte. Dein persönliches Herzlinien-Porträt.** — Sua mão. Sua história. Seu retrato personalizado da linha do coração.

As duas primeiras expressam tensões e desejos; não são promessas de que uma fotografia possa respondê-los objetivamente. A terceira comunica o objeto comprado. O teste deve medir início e conclusão do envio da foto, compra, satisfação e pedidos de reembolso por ângulo. Interesse em conteúdo gratuito e intenção declarada de pagar não substituem essas métricas.

## Fontes e evidências

As observações abaixo são paráfrases dos relatos. Quando há trecho em alemão, ele é uma citação curta e a tradução é nossa. A aplicação ao produto é uma hipótese separada. Os links levam às discussões; comentários podem mudar ou ser removidos.

'''
parts=[intro]
for r in data:
 parts.append(f"### {r['id']} — {r['titulo']}\n\n[{r['plataforma']} — fonte]({r['url']}) · {r['data_material']} · {r['acesso']}.\n\n")
 if r['trecho_de']:
  parts.append(f"> {r['trecho_de']}\n\nTradução: “{r['traducao_pt']}”\n\n")
 parts.append(f"**Observado:** {r['observacao']}\n\n**Tema:** {r['tema']}. **Hipótese:** {r['hipotese_produto']}\n\n**Limite:** {r['limite']}\n\n")
parts.append('''## Como continuar a coleta sem perder qualidade

Termos úteis: `Handlesen Liebe Erfahrungen`, `Herzlinie deuten`, `Seelenverwandten verlieren`, `Seelenpartner loslassen`, `Bauchgefühl oder Angst Beziehung`, `Kartenlegen Erfahrungen hingehalten`, `Kartenlegen persönlich oder YouTube`, `Liebe fühlt sich wie Zuhause an`.

Para novas fontes, registrar data, pergunta inicial, fala real, contexto e objeção. Separar cliente, praticante e propaganda. Não contar o mesmo autor como várias pessoas; não classificar sátira como crença. Conteúdo em russo precisa de uma amostra própria e localização confirmada antes de ser usado como sinal do mercado alemão.

A etapa seguinte mais útil é testar as três entradas com a mesma entrega visual. Isso ajuda a distinguir demanda pelo tema amoroso de curiosidade pela animação da mão. Não escolher preço nem promessa apenas pela intensidade dos relatos.
''')
(out/'pesquisa-reddit-foruns-amor-alemao.md').write_text(''.join(parts),encoding='utf-8')
print(json.dumps({'fontes':len(data),'reddit':sum(r['plataforma']=='Reddit' for r in data),'outras':sum(r['plataforma']!='Reddit' for r in data),'citacoes_curtas':sum(bool(r['trecho_de']) for r in data),'arquivos':['pesquisa-reddit-foruns-amor-alemao.md','banco-fontes-amor-mistico-alemao.csv']},ensure_ascii=False))
