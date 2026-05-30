# Arraiá do Otto — Brief de Projeto / Spec de Build

> Documento de handoff para construir o site no **Claude Code**.
> É um site de convite + confirmação de presença para o **1º aniversário do Otto**, com tema de **festa junina**.

---

## 1. Visão geral

Site de página única (one-page, rolagem vertical, **mobile-first** — a maioria abre no celular), com:

- Convite temático "festa junina" estrelando o Otto (bebê de 1 ano).
- Detalhes do evento + contador regressivo.
- Programação bem-humorada em "caipirês".
- Mapa do local.
- **Formulário de confirmação de presença (RSVP)** com persistência.

A ideia visual central: conforme a pessoa **rola a página**, o fundo passa de **azul de meio-dia (topo)** para **dourado de fim de tarde** e termina em **laranja/roxo de fogueira (base)** — espelhando o horário da festa (12h→18h). As cenas ilustradas do Otto são costuradas por **bandeirinhas** entre as seções.

---

## 2. Fatos do evento (não inventar / não alterar)

| Campo | Valor |
|---|---|
| Aniversariante | Otto (faz 1 ano) |
| Data | Sábado, **27 de junho de 2026** |
| Horário | **12:00 às 18:00** |
| Local | **Arena Bombinhas** (salão) |
| Endereço | **Rua Araçá, 551, Sertãozinho** |
| Tema | Festa junina |
| Fuso para countdown/calendário | America/Sao_Paulo |

---

## 3. Stack & hospedagem

- **Frontend:** Vite + React + Tailwind CSS. Mobile-first.
- **Hospedagem:** Cloudflare Pages (build do Vite).
- **Backend do RSVP:** Cloudflare Pages Functions (ou um Worker) com endpoint `POST /api/rsvp`.
- **Banco:** Cloudflare **D1** (SQLite) para guardar as confirmações.
- **Anti-spam:** Cloudflare **Turnstile** (captcha grátis) no formulário.
- **Domínio:** subdomínio `arraia-do-otto.pages.dev` serve; opcional apontar um domínio próprio depois.

Tudo dentro do **free tier** da Cloudflare.

---

## 4. Estrutura da página (em ordem)

1. **Hero (topo, meio-dia)** — bandeirinhas, título grande "Arraiá do Otto", subtítulo "O Otto vai fazê 1 aninho!", cena de boas-vindas do Otto, **contador regressivo** pro dia 27/06/2026 12h. Botão "Confirma a presença, ó!" fixo/flutuante que acompanha a rolagem.
2. **Os detalhes** — data, horário, local; botões **"Adicionar à agenda"** (Google Calendar + arquivo `.ics`).
3. **Programação caipirês** — cenas ilustradas do Otto como ilustrações de seção, com os recadinhos engraçados (espetinho pra quem vem de longe, guloseimas, quadrilha).
4. **Como chegar** — Google Maps embutido (iframe) + botões **"Abrir no Google Maps"** e **"Abrir no Waze"**.
5. **Confirmar presença (RSVP)** — formulário (ver seção 8). Animação de confete/bandeirinhas ao confirmar.
6. **Rodapé (base, fogueira)** — cena de despedida do Otto, botão **compartilhar no WhatsApp**, e (opcional) toggle de forró ao fundo (desligado por padrão).

---

## 5. Conteúdo / textos (tom "caipirês", convidativo e bem-humorado)

- **Título:** ARRAIÁ DO OTTO
- **Subtítulo:** O Otto vai fazê 1 aninho!
- **Boas-vindas:** Cês tão tudo convidado, sô!
- **Recadinhos pra espalhar pelas seções:**
  - "O úrtimo que chegá é a muié do padre!"
  - "Tem espetinho, paçoca, bolo de milho e muita farra!"
  - "Esperamo cê lá, viu?"
  - "Vai tê quentão pros grandi e muita brincadeira pros pequeno!"
- **CTA do RSVP:** Confirma a presença, ó!
- **Mensagem de confirmação (pós-envio):** "Oba! Tá confirmado, ó! Agora é só num atrasá — lembra: o úrtimo que chegá é a muié do padre! 🔥"
- **Título do mapa:** Pra num se perdê no caminho

> Tom: caloroso, brincalhão, com sotaque junino leve — sem exagerar a ponto de dificultar a leitura. O Otto é descrito como um menino simpático, sempre risonho e brincalhão.

---

## 6. Design / tema

- **Paleta:** vermelho festa, laranja, amarelo-milho, verde-bandeirinha, marrom-madeira; brilho quente de fogueira; céu azul (topo) → dourado → laranja/roxo entardecer (base).
- **Bandeirinhas:** bunting triangular em CSS (cores alternadas) como divisórias entre seções.
- **Fundo:** gradiente vinculado à rolagem (noon → golden hour → dusk/fogueira).
- **Texturas:** acentos de madeira rústica; padrão **xadrez** (ecoando a camisa do Otto) em detalhes.
- **Tipografia:** display rústico/festivo nos títulos (algo woodtype ou manuscrito legível); sans simples no corpo. Priorizar legibilidade e acessibilidade.
- **Mobile-first**, com toque generoso nos botões.

---

## 7. As imagens do Otto (geração por IA)

**Modelo recomendado:** **Nano Banana Pro** (Gemini 3 Pro Image) para as versões finais — melhor consistência de personagem entre cenas, texto nítido e saída em 4K. Usar **Nano Banana 2** apenas para rascunhos baratos.

**Workflow que funciona (importante):**
- Gerar **cada cena separadamente** em **9:16** (uma cena por imagem = rosto consistente). O site costura tudo depois com CSS.
- Usar **sempre a foto REAL do Otto** como referência em toda geração (nunca uma imagem já gerada — acumula erro).
- Colar o **mesmo bloco-âncora idêntico** no início de todo prompt.
- Gerar 3–4 tentativas por cena e escolher a melhor.

**Bloco-âncora (colar no topo de TODO prompt):**

> Ilustração 3D estilo animação Pixar, proporção 9:16, alta resolução. Personagem: Otto, bebê risonho de 1 ano, olhos castanhos com tom acinzentado, cabelinho bem ralo e fino com poucos fios levemente cacheados no topo da cabeça, bochechas redondas, vestido de caipira (camisa xadrez vermelha, lenço no pescoço, chapéu de palha grande). Mesma carinha da foto de referência. Render suave, cores quentes e saturadas, expressões cômicas e exageradas, fileira de bandeirinhas coloridas na parte de cima, clima fofo e festivo de festa junina.

> Observação de continuidade de cor: o pouco cabelo do Otto muda com a luz — loiro ao meio-dia, acobreado à tarde, quase ruivo ao entardecer. Aplicar conforme a hora da cena.

**Cenas (acrescentar ao bloco-âncora):**

1. **Capa / boas-vindas (meio-dia, cabelo loiro):** Letreiro de madeira rústica escrito "ARRAIÁ DO OTTO" e abaixo, menor, "O Otto vai fazê 1 aninho!". O Otto numa barraquinha de espetinhos, com uma plaquinha "Almoço pra quem veio de longe, ó!", oferecendo um espetinho com cara simpática.
2. **Guloseimas (tarde, cabelo acobreado):** O Otto numa mesa lotada de guloseimas juninas — paçoquinha, bolo de milho, pipoca — se lambuzando feliz, migalhas no rosto.
3. **Pescaria (tarde):** O Otto na barraca de pescaria, segurando uma vara e fisgando um patinho de borracha, com cara de orgulho exagerado.
4. **Quadrilha (fim de tarde dourado, cabelo acobreado):** O Otto no meio da roda de quadrilha, rodopiado no ar, gargalhando, chapéu de palha voando. Plaquinha ao lado escrita "O úrtimo que chegá é a muié do padre!".
5. **Sanfoneiro (entardecer):** O Otto tentando tocar uma sanfona maior que ele, bochechas infladas, olhinhos fechados de pura "concentração musical".
6. **Despedida (anoitecer, luz de fogueira, cabelo quase ruivo):** O Otto sentado perto de uma fogueirinha acenando tchau.

**Cenas reserva (caso alguma não fique boa):** "noivo caipira" (gravata borboleta torta, cara confusa), espiga de milho gigante (maior que a cabeça dele), "dono do arraiá" (atrás da barraca com plaquinha "Arraiá do Otto").

---

## 8. RSVP (formulário + persistência)

**Campos do formulário:**
- Nome de quem confirma — texto, obrigatório
- Quantos adultos — número (default 1)
- Quantas crianças — número (default 0)
- Vai comparecer? — opções: "Tô dentro!" / "Num vô dá dessa vez" / "Talvez"
- Restrição alimentar / observação — texto, opcional
- Recadinho pro Otto — texto, opcional
- Widget **Turnstile** (anti-spam)

**Fluxo:** `POST /api/rsvp` (Pages Function) → valida Turnstile → insere no D1 → retorna sucesso → UI mostra a mensagem de confirmação com **confete/bandeirinhas**.

**Schema D1 sugerido:**
```sql
CREATE TABLE IF NOT EXISTS rsvp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  nome TEXT NOT NULL,
  adultos INTEGER DEFAULT 1,
  criancas INTEGER DEFAULT 0,
  status TEXT NOT NULL,        -- 'sim' | 'nao' | 'talvez'
  restricao TEXT,
  recado TEXT
);
```

**Visualização das respostas:** uma rota protegida simples (ou apenas consultar o D1 via `wrangler d1 execute`) para o anfitrião ver a lista de confirmados e o total de adultos/crianças.

---

## 9. Mapa

- Iframe do Google Maps apontando "Arena Bombinhas, Rua Araçá, 551, Sertãozinho".
- Botão **"Abrir no Google Maps"** (`https://www.google.com/maps/search/?api=1&query=...`).
- Botão **"Abrir no Waze"** (`https://waze.com/ul?q=...`).

---

## 10. Extras

- **Contador regressivo** para 2026-06-27T12:00 (America/Sao_Paulo).
- **Adicionar à agenda:** gerar arquivo `.ics` e link de Google Calendar (com título, data/hora, local).
- **Compartilhar no WhatsApp:** `https://wa.me/?text=...` com mensagem pré-pronta convidando + link do site.
- **Forró de fundo (opcional):** toggle de áudio, **desligado por padrão**.

---

## 11. Acessibilidade & qualidade

- Mobile-first, áreas de toque grandes, contraste legível apesar das cores vibrantes.
- Imagens com `alt` descritivo.
- Formulário com `label`s e validação clara.
- Performance: imagens otimizadas (o Otto em formato leve, ex. WebP).

---

## 12. Checklist de build

- [ ] Scaffold Vite + React + Tailwind
- [ ] Layout one-page com gradiente de rolagem (noon → dusk) e bandeirinhas
- [ ] Hero + contador regressivo
- [ ] Seção detalhes + add-to-calendar (.ics + Google)
- [ ] Seção programação com as cenas do Otto
- [ ] Mapa (iframe + botões Maps/Waze)
- [ ] Formulário RSVP + Turnstile
- [ ] Pages Function `/api/rsvp` + D1 (schema + insert)
- [ ] Animação de confirmação (confete/bandeirinhas)
- [ ] Compartilhar no WhatsApp
- [ ] Deploy na Cloudflare Pages
- [ ] (Opcional) toggle de forró; domínio próprio

---

*As imagens do Otto são geradas à parte (ver seção 7) e adicionadas como assets do site. O conteúdo textual já está em "caipirês" e pode ser ajustado à vontade.*
