# Oráculo das Cores — Magic: The Gathering (fan project)

Quiz recreativo, em português brasileiro, com **45 perguntas**, gráfico WUBRG, índice incolor independente, combinações de guildas e trios, estilos de deck, recomendações de tribos e **catálogo de 367 tipos de criatura**. Não oficial, sem afiliação com a Wizards of the Coast.

## Estrutura

- `site/index.html` — site completo e conteúdo semântico para mecanismos de busca.
- `data/perguntas_e_catalogo.json` — 45 perguntas, 72 tribos curadas e 367 subtipos editáveis.
- `scripts/sync_data.py` — sincroniza o JSON editável com o HTML para Netlify Drop. O deploy via Git sincroniza automaticamente.
- `site/assets/css/base.css` — regras visuais anteriores do quiz, preservadas.
- `site/assets/css/atelier.css` — identidade editorial exclusiva, tipografia monumental, layout responsivo, dark/light e animação do viajante de mana.
- `site/assets/js/quiz.js` — pontuação, navegação, pesquisa e resultados.
- `site/assets/js/theme.js` — preferência por tema claro/escuro, com modo escuro como padrão e escolha persistida no navegador.
- `site/assets/img/` — arte vetorial autoral de fantasia, favicon e imagem Open Graph de 1200 × 630 px.
- `site/_headers`, `site/_redirects`, `site/robots.txt` — configuração estática do Netlify.
- `scripts/build.py` — preparação de SEO com URL real de produção.
- `netlify.toml` — configuração para deploy via Git.

## Opção 1 — Publicação rápida no Netlify Drop

1. Acesse https://app.netlify.com/drop.
2. Se editar `data/perguntas_e_catalogo.json`, execute antes `python scripts/sync_data.py`. **Arraste a pasta `site`**, extraída deste projeto (não arraste o ZIP ou o projeto inteiro).
3. O site funciona imediatamente, incluindo todas as perguntas e o gráfico, sem backend ou banco de dados. Para fontes customizadas, a conexão com Google Fonts é opcional.
4. Depois de conhecer a URL definitiva, configure canonical, sitemap e Open Graph usando a opção abaixo e substitua o deploy com a pasta `dist`.

### Gerar SEO completo depois que o endereço do site existir

No Windows PowerShell (com Python 3 instalado), na **raiz do projeto**:

```powershell
$env:SITE_URL = 'https://seu-site-real.netlify.app'
python scripts/build.py
```

Substitua pelo endereço real. Em seguida **envie a pasta `dist`** para o Netlify. A pasta terá `sitemap.xml`, `robots.txt`, link canonical e `og:image` com URL absoluta. Não deixe o domínio de exemplo nos arquivos publicados.

No Linux/macOS:

```bash
SITE_URL=https://seu-site-real.netlify.app python3 scripts/build.py
```

## Opção 2 — GitHub + Netlify (recomendada)

1. Envie **o conteúdo** da pasta `Oraculo_MTG_Netlify` para a **raiz** do repositório GitHub (ou defina `Oraculo_MTG_Netlify` como Base directory no Netlify).
2. No Netlify, clique **Add new project → Import an existing project** e conecte o repositório.
3. `netlify.toml` configura `python3 scripts/build.py` e diretório de publicação `dist` automaticamente.
4. O Netlify fornece a variável `URL` no build, usada para preencher canonical, sitemap e metadados sociais com a URL de produção.
5. Se quiser usar um domínio próprio, em **Site configuration → Environment variables** crie `SITE_URL` com `https://meudominio.com.br`, e faça novo deploy.
6. Se um domínio novo não estiver funcionando ainda, não use o antigo para canonical. Aguarde domínio/DNS/SSL estarem ativos e refaça o deploy.

## SEO e indexação (depois da publicação)

1. Verifique a URL da produção em https://search.google.com/search-console/.
2. Envie o sitemap: `https://seu-site-real.netlify.app/sitemap.xml` (somente quando tiver sido gerado após configurar a URL).
3. Use **Inspeção de URL → Solicitar indexação** para `/`.
4. Confirme que a página abre publicamente, sem senha, com HTTPS e código 200; confira `robots.txt` e o `link rel=canonical` no código-fonte.
5. Espere o rastreamento. Sitemap e metadados **ajudam a descoberta, mas não garantem classificação ou indexação imediata**.

O Google indexa **somente o conteúdo público**, não resultados privados individualizados do quiz. O site tem descrição de cada cor, guildas, perguntas frequentes e conteúdo rastreável no HTML inicial. Não há keyword stuffing, contadores fictícios, depoimentos inventados nem marcação de avaliações falsas.

## Teste local

O HTML agora usa **caminhos relativos** (`./assets/css/...`) e funciona por duplo clique, desde que as pastas `assets` e `site` sejam mantidas juntas. Para testar como um site HTTP, opcionalmente:

```bash
cd site
python3 -m http.server 8080
```

Abra `http://localhost:8080` no navegador.

## Decisões de design e dependências

A base `Frontend - Design System e Bibliotecas.zip` orientou organização, semântica, responsividade e segurança. A identidade visual foi inteiramente refeita após a referência editorial [Game Studio — Ninefold](https://websiteprompts.ai/prompts/game-studio): preto quase absoluto, texto osso, verde de sinal, linhas editoriais, títulos monumentais, uma animação discreta em degraus e ilustração original. São referências de direção de arte, não uma cópia do layout original. **Não foi instalado Bootstrap, React Bits, Aceternity, Toastr ou SweetAlert2**: eles não são necessários para um quiz com stack já pronta e aumentariam dependências e risco de regressão. As modais de confirmação usam o elemento nativo `<dialog>`; feedback simples permanece na página. Todos os ícones e ilustrações são próprios/locais. As fontes Google Fonts são opcionais e têm fallback de sistema. Não há CDN de JavaScript, frameworks de UI ou rastreamento.

O quiz não possui analytics, login nem API que envie respostas. Usa armazenamento local somente para as perguntas respondidas e a preferência visual. Os links de cartas abrem buscas externas do Scryfall mediante clique. A identidade do Commander e a viabilidade de uma tribo precisam ser verificadas na lista real de cartas.

## Limitações

- É um fan project, sem endosso oficial.
- Os percentuais são afinidades recreativas e não constituem medição psicológica.
- A lista de tipos e o catálogo de tribos são um retrato do material pesquisado em 2026; podem mudar com novas coleções e atualizações nas regras.
- A busca de cartas no Scryfall exige conexão; a mecânica central do quiz funciona localmente.
- Custom headers só têm efeito no servidor Netlify, não ao abrir o HTML diretamente.

**Licença e autoria:** perguntas, lógica e arte originais deste projeto, sem reivindicar propriedade sobre Magic: The Gathering e seus elementos de terceiros. Consulte as marcas da Wizards of the Coast antes de distribuir comercialmente.

## Direção de arte — versão editorial 2.0

- **Primeira dobra**: composição editorial com título em caixa alta, ilustração vetorial exclusiva (viajante e eclipse de mana), informações essenciais em linhas, sem painéis genéricos e gradientes neon.
- **Perguntas**: layout de dossiê com numeração gigante, linha de avanço e alternativas em linhas; os atalhos de 1 a 6 continuam funcionando.
- **Resultados**: gráficos e combinações apresentados como um relatório de exploração; permanecem o gráfico WUBRG, incolor, personalidade, jogo e catálogo de criaturas.
- **Acessibilidade**: contraste alto, estados de foco, `prefers-reduced-motion`, `aria-live` nas perguntas, dados do progresso e mobile sem scroll horizontal.
- **SEO**: o conteúdo explicativo original (filosofia das cores, 10 guildas, FAQ) continua em HTML visível antes do início do teste; Open Graph foi redesenhado para combinar com o site.
- **Publicação**: Google Fonts é carregado apenas como recurso visual opcional com CSP restrita aos domínios da fonte. Sem scripts de terceiros.


## Experiência interativa — versão dos portais animados

- **Anéis do portal em SVG vetorial original**: três órbitas em velocidades/sentidos diferentes e núcleo pulsante, sem GIF pesado ou imagem externa. O usuário pode **pausar/reativar** as animações.
- **Seletor WUBRG na abertura**: as cores Branco, Azul, Preto, Vermelho e Verde alteram o brilho do portal e exibem uma mensagem temática; essa interação **não influencia os pontos do quiz**.
- **Movimento e interação**: parallax discreto apenas para mouse, revelação das seções ao rolar, indicador de leitura, guildas selecionáveis com descrição, transições nas 45 perguntas e entrada animada dos gráficos de resultados.
- **Acessibilidade**: controles operáveis pelo teclado, atributos ARIA e suporte a `prefers-reduced-motion` (reduz movimentos automaticamente). Em dispositivos touch, o efeito de parallax é desativado.
- **Desempenho e privacidade**: sem canvas, WebGL, rastreamento, APIs pagas ou bibliotecas JavaScript adicionais; os arquivos `assets/css/motion.css` e `assets/js/motion.js` cuidam apenas dos efeitos visuais.
- **Celular**: o portal animado aparece logo após o título principal, antes do texto explicativo, para destacar a experiência.

### Arquivos novos e alterados

`site/assets/css/motion.css` e `site/assets/js/motion.js` são os módulos novos. `site/assets/img/planeswalker-art.svg` recebeu grupos animados; o mesmo SVG foi incluído diretamente no `index.html` para permitir personalização ao vivo. `quiz.js` manteve o motor de pontuação original; recebeu somente um acesso de navegação usado quando alguém retorna do resultado para as seções explicativas.



## Correção de frontend e favicon (18/11/2026)

- **Corrigido:** estilos e scripts deixaram de usar caminhos absolutos (`/assets/...`), que quebravam quando o HTML era aberto por `file://` no Windows ou em alguns subdiretórios. Agora usam `./assets/...`.
- **Adicionado:** `site/favicon.ico` multirresolução (16, 32, 48, 64, 128 e 256 px), `favicon.svg`, PNG 16/32, ícones Apple/PWA e `site.webmanifest`.
- **Atualizado:** tags no `<head>` para os favicons e versão dos links CSS/JS para evitar cache de um deploy anterior.
- **Netlify Drop:** extraia o ZIP de publicação e arraste **a pasta extraída (o conteúdo do site)**, que tem o `index.html`, `favicon.ico`, pasta `assets`, `_headers` e `robots.txt` juntos na raiz. Nunca publique apenas o `index.html` modular.
- **Visualização local:** abra `site/index.html`; a navegação, o quiz, os estilos e o favicon devem carregar normalmente. Também foi incluído um HTML único independente, útil para testar sem as pastas de assets.
- **Em site já publicado:** envie novo deploy da pasta corrigida. Recarregue com `Ctrl + F5` e veja `https://SEU-SITE.netlify.app/favicon.ico`.
