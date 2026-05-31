# Arraiá do Otto — Image Asset Plan (Picsart)

> Website-oriented refactor of [IMAGE-PROMPTS.md](IMAGE-PROMPTS.md).
> That file was written for a single-image invitation generated on Nano Banana Pro.
> This file repurposes the same 6 scenes as **website assets** generated on **Picsart**,
> maps each to a section of the one-page site, and pins filenames, ratios, and post-processing.

The raw prompts in `IMAGE-PROMPTS.md` stay as the source of truth for *scene content*.
This file is the source of truth for *how each becomes a web asset*.

---

## 1. Asset map — what the site actually needs

All scenes are **9:16 portrait** for a consistent vertical rhythm when stacked on mobile
(same dirt floor + bunting on top in every scene). Generate large, then export optimized WebP.

| # | Scene | Website role | Filename | Hair / light |
|---|---|---|---|---|
| 1 | Boas-vindas (espetinho) | **Hero** illustration (top, noon) | `hero-boas-vindas.webp` | blond / noon |
| 2 | Guloseimas | Programação band | `prog-guloseimas.webp` | golden / afternoon |
| 3 | Pescaria | Programação band | `prog-pescaria.webp` | golden / afternoon |
| 4 | Quadrilha | Programação band | `prog-quadrilha.webp` | golden / golden hour |
| 5 | Sanfoneiro | Programação band | `prog-sanfoneiro.webp` | golden / dusk |
| 6 | Despedida (fogueira) | **Footer** illustration (bottom, night) | `footer-despedida.webp` | golden / bonfire |
| A | Espiga gigante (reserve) | swap-in spare | `reserva-espiga.webp` | — |
| B | Noivo caipira (reserve) | swap-in spare | `reserva-noivo.webp` | — |
| C | Dono do arraiá (reserve) | swap-in spare | `reserva-dono.webp` | — |

**Output convention:** generate at the largest size Picsart allows (≥ 2048px on the long edge),
keep the lossless master under `assets-raw/` (gitignored), and commit only the optimized
`public/img/*.webp` (target ≤ ~250 KB each, quality ~80, lazy-loaded with descriptive `alt`).

---

## 2. Compositing decision (UPDATED — owner: "Otto recortado + céu vivo")

The site now has a fully **animated** sky (scroll gradient + rotating sun, drifting clouds, moon,
stars, bonfire embers). So:

- **Hero (top) + Footer (bottom) = TRANSPARENT CUTOUTS.** Generate Otto for these two with a plain
  background and **remove the background on the Picsart web app** → export **transparent PNG**. They
  composite directly over the live sky (sun/clouds behind him at the top; embers/moon at the bottom).
  Do NOT bake a sky into these two — the CSS sky shows through. Filenames stay `hero-boas-vindas` and
  `footer-despedida` but as **`.png`** (transparent), not `.webp`.
- **The 4 Programação scenes = framed cards** (keep their own mini-scene/background). They sit inside
  rounded "photo" frames between text, so a baked background is fine. WebP is fine for these.
- Bunting (bandeirinhas) is **CSS**, not baked into images.

Net: 2 transparent cutouts (hero, footer) + 4 framed scene cards (programação).

---

## 3. Picsart workflow

1. **Reference photo:** upload Otto's real photo and use Picsart's **image-to-image / reference**
   so the face tracks the real kid. ⚠️ Picsart's character consistency from a single photo is
   weaker than Nano Banana's — the **textual anchor block below is the primary consistency lever**;
   the photo is a secondary nudge. Generate **4–6 attempts per scene** and keep the best.
2. **Never** feed a previously *generated* Otto back in as the reference — error compounds and the
   face drifts. Always re-reference the original real photo.
3. Paste the **identical anchor block** at the top of every prompt, then append the scene block.
4. **Text inside images:** let Picsart render only the big text (title + short plaquinhas). Small
   text (date, address) is added as real HTML on the site, never baked into the image — it blurs.
5. Export → run Picsart's optimizer or convert to **WebP** before committing to `public/img/`.

---

## 4. Anchor block — paste at the top of EVERY prompt (PT-BR, keep verbatim)

> Ilustração 3D estilo animação Pixar, alta resolução. Personagem: Otto, bebê risonho de 1 ano,
> MESMA carinha da foto de referência — olhos castanhos com tom levemente acinzentado, bochechas
> redondas e fofas, e cabelo de bebê **MUITO ralo e fininho** (pouquíssimos fios), de cor
> **dourada/loira clara**. Vestido de caipira (camisa xadrez vermelha, lenço no pescoço, chapéu de
> palha). Render suave, cores quentes e saturadas, expressões cômicas e exageradas, clima fofo e
> festivo de festa junina.

**Owner corrections (override older prompts):** grayish-brown eyes; hair is **very sparse baby hair,
golden/blond** — NOT copper or red. Keep it golden throughout; at most a warm golden glow at dusk,
never reddish.

**⚠️ Generate on the Picsart WEB app, not the CLI/API.** The gen-ai API rejects real-child face
references (`prohibited_content`); the web app allows Otto's reference photos. Reference photos live
in `assets-raw/photos/` (gitignored) — the clearest front-facing one is the best face reference.

---

## 5. Per-scene prompts (anchor block + the block below = one full prompt)

### 1 — Hero / boas-vindas — noon, blond → `hero-boas-vindas.webp`
> Letreiro de madeira rústica grande escrito "ARRAIÁ DO OTTO" e abaixo, menor, "O Otto vai fazê 1
> aninho!". O Otto numa barraquinha de espetinhos, com uma plaquinha escrita "Almoço pra quem veio
> de longe, ó!", oferecendo um espetinho com cara simpática. Céu de meio-dia ensolarado, azul claro.
>
> *Web note:* this is the hero — leave calm headroom at the top so the HTML countdown + CTA button
> can overlay without covering Otto's face. Keep the wooden "ARRAIÁ DO OTTO" sign legible.

### 2 — Guloseimas — afternoon, golden hair → `prog-guloseimas.webp`
> O Otto numa mesa lotada de guloseimas juninas — paçoquinha, bolo de milho, pipoca — se lambuzando
> feliz, com migalhas grudadas no rosto. Luz de tarde, céu dourado-claro.

### 3 — Pescaria — afternoon, golden hair → `prog-pescaria.webp`
> O Otto na barraca de pescaria, super concentrado, segurando uma vara e fisgando um patinho de
> borracha, com expressão de orgulho exagerado. Barraquinhas e bandeirinhas ao fundo. Luz de tarde.

### 4 — Quadrilha — golden hour, golden hair → `prog-quadrilha.webp`
> O Otto no meio da roda de quadrilha, sendo rodopiado no ar, gargalhando, com o chapéu de palha
> voando. Plaquinha ao lado escrita "O úrtimo que chegá é a muié do padre!". Sensação de movimento
> e alegria. Céu dourado de fim de tarde.

### 5 — Sanfoneiro — dusk → `prog-sanfoneiro.webp`
> O Otto tentando tocar uma sanfona muito maior que ele, bochechas infladas, olhinhos fechados de
> pura "concentração musical". Palco rústico ao fundo. Céu de entardecer, laranja puxando pro roxo.

### 6 — Despedida / footer — night, bonfire, warm golden → `footer-despedida.webp`
> O Otto sentado perto de uma fogueirinha acenando tchau, expressão doce e sonolenta de fim de
> festa. Luz quente de fogueira no rosto, céu noturno roxo-escuro com brilho laranja embaixo.

### A — Espiga gigante (reserve) → `reserva-espiga.webp`
> O Otto mordendo uma espiga de milho enorme, maior que a própria cabeça, com grãos grudados no
> rosto e sorriso radiante. Mesa de comidas juninas atrás.

### B — Noivo caipira (reserve) → `reserva-noivo.webp`
> O Otto vestido de "noivo caipira" com gravata borboleta torta e flor na lapela, expressão muito
> séria e confusa, como se não entendesse o próprio casamento da brincadeira. Humor sutil.

### C — Dono do arraiá (reserve) → `reserva-dono.webp`
> O Otto atrás de uma barraquinha com uma plaquinha escrita "Arraiá do Otto", fingindo ser o dono
> do negócio, mãozinha no balcão com ar de chefe.

---

## 6. On-image text (PT-BR) — render ONLY these, big

- `ARRAIÁ DO OTTO` (hero sign)
- `O Otto vai fazê 1 aninho!` (hero sign, smaller)
- `Almoço pra quem veio de longe, ó!` (hero plaquinha)
- `O úrtimo que chegá é a muié do padre!` (quadrilha plaquinha)
- `Arraiá do Otto` (reserve C plaquinha)

Everything else (date, time, address, countdown, RSVP) is real HTML text on the site.

---

## 7. Post-processing checklist (per image)

- [ ] Best of 4–6 attempts chosen; face matches Otto's real photo
- [ ] Correct hair color for the scene's time of day
- [ ] On-image text legible and spelled right (caipirês intentional)
- [ ] Cropped to clean 9:16; hero has headroom for overlay
- [ ] Exported to WebP, ≤ ~250 KB, committed to `public/img/`
- [ ] Descriptive PT-BR `alt` written for the site
