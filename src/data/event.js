// Single source of truth for the event. Facts here are fixed — see CLAUDE.md.
// Copy is caipirês (SPEC §5). Run the humanizer skill over guest-facing strings
// before final launch.

export const event = {
  baby: "Otto",
  title: "Arraiá do Otto",
  subtitle: "O Otto vai fazê 1 aninho!",
  welcome: "Cês tão tudo convidado, sô!",

  // Saturday, 27 June 2026, 12:00–18:00, America/Sao_Paulo (fixed -03:00 in June).
  start: "2026-06-27T12:00:00-03:00",
  end: "2026-06-27T18:00:00-03:00",
  dateLabel: "Sábado, 27 de junho de 2026",
  timeLabel: "das 12h às 18h",

  venue: "Arena Bombinhas",
  venueDetail: "salão",
  address: "Rua Araçá, 551, Sertãozinho",

  // Caipirês recadinhos sprinkled through the page.
  recados: {
    ctaRsvp: "Confirma a presença, ó!",
    espetinho: "O úrtimo que chegá é a muié do padre!",
    comidas: "Tem espetinho, paçoca, bolo de milho e muita farra!",
    espera: "Esperamo cê lá, viu?",
    quentao: "Vai tê quentão pros grandi e muita brincadeira pros pequeno!",
    mapaTitle: "Pra num se perdê no caminho",
    confirmado:
      "Oba! Tá confirmado, ó! Agora é só num atrasá — lembra: o úrtimo que chegá é a muié do padre! 🔥",
    assinatura: "Fei'to com muito amô pela mamãe e pelo papai do Otto 💛",
  },
};

// Programação scenes → maps to the generated Otto images (see docs/IMAGES.md).
export const scenes = [
  {
    id: "guloseimas",
    img: "/img/prog-guloseimas.webp",
    title: "Guloseima pra todo lado",
    recado: "Tem espetinho, paçoca, bolo de milho e muita farra!",
    alt: "Otto numa mesa lotada de guloseimas juninas, se lambuzando feliz.",
  },
  {
    id: "pescaria",
    img: "/img/prog-pescaria.webp",
    title: "Pescaria",
    recado: "Fisga um patinho e leva uma lembrancinha, ó!",
    alt: "Otto na barraca de pescaria fisgando um patinho de borracha, orgulhoso.",
  },
  {
    id: "quadrilha",
    img: "/img/prog-quadrilha.webp",
    title: "Quadrilha",
    recado: "O úrtimo que chegá é a muié do padre!",
    alt: "Otto rodopiado no ar no meio da quadrilha, gargalhando, chapéu de palha voando.",
  },
  {
    id: "sanfoneiro",
    img: "/img/prog-sanfoneiro.webp",
    title: "Forró pra dançá",
    recado: "Vai tê quentão pros grandi e muita brincadeira pros pequeno!",
    alt: "Otto tentando tocar uma sanfona maior que ele, bochechas infladas.",
  },
];
