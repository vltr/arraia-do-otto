# Arraiá do Otto — Prompts de Imagem (Nano Banana Pro)

> Coletânea dos prompts de geração de imagem do Otto para o site de aniversário (tema festa junina).
> Cada cena é uma imagem **9:16** separada, gerada individualmente e depois usada como asset do site.

---

## Modelo recomendado

- **Versões finais:** **Nano Banana Pro** (Gemini 3 Pro Image) — melhor consistência de personagem entre cenas, texto nítido em português e saída em 4K.
- **Rascunhos baratos:** **Nano Banana 2** (Gemini 3.1 Flash Image) — use para testar e achar o "Otto certo" antes de gastar no Pro.

## Workflow que funciona (importante)

1. Gere **cada cena separadamente** em **9:16** (uma cena por imagem = rosto consistente).
2. Use **sempre a foto REAL do Otto** como referência em toda geração — nunca uma imagem já gerada (acumula erro e a cara escorrega).
3. Cole o **mesmo bloco-âncora idêntico** no início de TODO prompt.
4. Gere **3–4 tentativas por cena** e escolha a melhor.
5. Mantenha o mesmo chão de terra batida e bandeirinhas no topo em todas, pra criar ritmo visual quando empilhadas no site.

---

## Bloco-âncora (colar no topo de TODO prompt)

> Ilustração 3D estilo animação Pixar, proporção 9:16, alta resolução. Personagem: Otto, bebê risonho de 1 ano, olhos castanhos com tom acinzentado meio indefinível, cabelinho bem ralo e fino com poucos fios levemente cacheados no topo da cabeça, bochechas redondas, vestido de caipira (camisa xadrez vermelha, lenço no pescoço, chapéu de palha grande). Mesma carinha da foto de referência. Render suave, cores quentes e saturadas, expressões cômicas e exageradas, fileira de bandeirinhas coloridas na parte de cima, clima fofo e festivo de festa junina.

**Continuidade de cor do cabelo:** o pouco cabelo do Otto muda com a luz — **loiro ao meio-dia, acobreado à tarde, quase ruivo ao entardecer**. Aplique conforme a hora da cena.

---

## Cenas principais (acrescentar ao bloco-âncora)

### 1. Capa / boas-vindas — meio-dia, cabelo loiro
Letreiro de madeira rústica escrito "ARRAIÁ DO OTTO" e abaixo, menor, "O Otto vai fazê 1 aninho!". O Otto numa barraquinha de espetinhos, com uma plaquinha escrita "Almoço pra quem veio de longe, ó!", oferecendo um espetinho com cara simpática. Céu de meio-dia ensolarado.

### 2. Guloseimas — tarde, cabelo acobreado
O Otto numa mesa lotada de guloseimas juninas — paçoquinha, bolo de milho, pipoca — se lambuzando feliz, com migalhas grudadas no rosto.

### 3. Pescaria — tarde
O Otto na barraca de pescaria, super concentrado, segurando uma vara e fisgando um patinho de borracha, com expressão de orgulho exagerado. Barraquinhas e bandeirinhas ao fundo.

### 4. Quadrilha — fim de tarde dourado, cabelo acobreado
O Otto no meio da roda de quadrilha, sendo rodopiado no ar, gargalhando, com o chapéu de palha voando. Plaquinha ao lado escrita "O úrtimo que chegá é a muié do padre!". Sensação de movimento e alegria.

### 5. Sanfoneiro — entardecer
O Otto tentando tocar uma sanfona muito maior que ele, bochechas infladas, olhinhos fechados de pura "concentração musical". Palco rústico ao fundo.

### 6. Despedida / rodapé — anoitecer, luz de fogueira, cabelo quase ruivo
O Otto sentado perto de uma fogueirinha acenando tchau, expressão doce e sonolenta de fim de festa.

---

## Cenas reserva (caso alguma das principais não fique boa)

### A. Espiga gigante
O Otto mordendo uma espiga de milho enorme, maior que a própria cabeça, com grãos grudados no rosto e sorriso radiante. Mesa de comidas juninas atrás.

### B. Noivo do casamento caipira
O Otto vestido de "noivo caipira" com gravata borboleta torta e flor na lapela, expressão muito séria e confusa, como se não entendesse o próprio casamento da brincadeira. Humor sutil.

### C. Dono do arraiá
O Otto atrás de uma barraquinha com uma plaquinha escrita "Arraiá do Otto", fingindo ser o dono do negócio, mãozinha no balcão com ar de chefe.

---

## Textos que aparecem dentro das imagens (caipirês)

- ARRAIÁ DO OTTO
- O Otto vai fazê 1 aninho!
- Almoço pra quem veio de longe, ó!
- O úrtimo que chegá é a muié do padre!
- Arraiá do Otto (na plaquinha da barraca, cena reserva C)

> Dica: a IA borra texto pequeno e denso. Deixe-a renderizar só os textos grandes (título e plaquinhas curtas). Qualquer texto miúdo (data, endereço) fica melhor adicionado como texto de verdade no site, não dentro da imagem.

---

## Observação sobre o "mural único"

Tentamos um único mural vertical com todas as cenas (9:16 e também 1:4 em dois painéis), mas a consistência do rosto do Otto **não se manteve** entre as cenas numa só geração. Por isso a decisão final foi: **gerar cada cena separada** e costurar a continuidade (bandeirinhas, estradinha, gradiente meio-dia→fogueira) **no próprio site, via CSS** — onde isso funciona de graça e sem risco.
