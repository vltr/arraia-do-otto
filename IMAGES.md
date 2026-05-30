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
| 2 | Guloseimas | Programação band | `prog-guloseimas.webp` | copper / afternoon |
| 3 | Pescaria | Programação band | `prog-pescaria.webp` | copper / afternoon |
| 4 | Quadrilha | Programação band | `prog-quadrilha.webp` | copper / golden hour |
| 5 | Sanfoneiro | Programação band | `prog-sanfoneiro.webp` | copper / dusk |
| 6 | Despedida (fogueira) | **Footer** illustration (bottom, night) | `footer-despedida.webp` | near-red / bonfire |
| A | Espiga gigante (reserve) | swap-in spare | `reserva-espiga.webp` | — |
| B | Noivo caipira (reserve) | swap-in spare | `reserva-noivo.webp` | — |
| C | Dono do arraiá (reserve) | swap-in spare | `reserva-dono.webp` | — |

**Output convention:** generate at the largest size Picsart allows (≥ 2048px on the long edge),
keep the lossless master under `assets-raw/` (gitignored), and commit only the optimized
`public/img/*.webp` (target ≤ ~250 KB each, quality ~80, lazy-loaded with descriptive `alt`).

---

## 2. Sky vs. site gradient — the compositing decision

The site has a scroll-linked background gradient (noon → golden hour → dusk/bonfire).
Each scene also carries its own time-of-day sky. To avoid two clashing gradients:

- **Keep each scene a full illustration with its own sky** (it *is* the environment — barraca,
  fogueira, palco). The scenes are sequenced so their baked skies already run noon→night.
- **The page gradient lives in the connective tissue** — hero copy area, the bunting dividers
  between scenes, and the detalhes / mapa / RSVP / footer text blocks. It transitions in the
  gaps, the illustrations punctuate it. No background removal needed for the main 6.
- Bunting (bandeirinhas) is **CSS**, not baked into images, so dividers stay crisp and recolorable.

If a scene's sky ever fights the section behind it, use Picsart **Remove Background** on that one
to drop Otto + his stall onto the CSS gradient instead. Treat that as the exception, not the rule.

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

> Ilustração 3D estilo animação Pixar, proporção 9:16, alta resolução. Personagem: Otto, bebê
> risonho de 1 ano, olhos castanhos com tom acinzentado meio indefinível, cabelinho bem ralo e fino
> com poucos fios levemente cacheados no topo da cabeça, bochechas redondas, vestido de caipira
> (camisa xadrez vermelha, lenço no pescoço, chapéu de palha grande). Mesma carinha da foto de
> referência. Render suave, cores quentes e saturadas, expressões cômicas e exageradas, fileira de
> bandeirinhas coloridas na parte de cima, chão de terra batida embaixo, clima fofo e festivo de
> festa junina.

**Hair-color continuity:** Otto's wispy hair shifts with the light — **blond at noon, copper in
the afternoon, almost red at dusk**. Apply per the scene's time of day.

---

## 5. Per-scene prompts (anchor block + the block below = one full prompt)

### 1 — Hero / boas-vindas — noon, blond → `hero-boas-vindas.webp`
> Letreiro de madeira rústica grande escrito "ARRAIÁ DO OTTO" e abaixo, menor, "O Otto vai fazê 1
> aninho!". O Otto numa barraquinha de espetinhos, com uma plaquinha escrita "Almoço pra quem veio
> de longe, ó!", oferecendo um espetinho com cara simpática. Céu de meio-dia ensolarado, azul claro.
>
> *Web note:* this is the hero — leave calm headroom at the top so the HTML countdown + CTA button
> can overlay without covering Otto's face. Keep the wooden "ARRAIÁ DO OTTO" sign legible.

### 2 — Guloseimas — afternoon, copper → `prog-guloseimas.webp`
> O Otto numa mesa lotada de guloseimas juninas — paçoquinha, bolo de milho, pipoca — se lambuzando
> feliz, com migalhas grudadas no rosto. Luz de tarde, céu dourado-claro.

### 3 — Pescaria — afternoon, copper → `prog-pescaria.webp`
> O Otto na barraca de pescaria, super concentrado, segurando uma vara e fisgando um patinho de
> borracha, com expressão de orgulho exagerado. Barraquinhas e bandeirinhas ao fundo. Luz de tarde.

### 4 — Quadrilha — golden hour, copper → `prog-quadrilha.webp`
> O Otto no meio da roda de quadrilha, sendo rodopiado no ar, gargalhando, com o chapéu de palha
> voando. Plaquinha ao lado escrita "O úrtimo que chegá é a muié do padre!". Sensação de movimento
> e alegria. Céu dourado de fim de tarde.

### 5 — Sanfoneiro — dusk → `prog-sanfoneiro.webp`
> O Otto tentando tocar uma sanfona muito maior que ele, bochechas infladas, olhinhos fechados de
> pura "concentração musical". Palco rústico ao fundo. Céu de entardecer, laranja puxando pro roxo.

### 6 — Despedida / footer — night, bonfire, near-red → `footer-despedida.webp`
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
