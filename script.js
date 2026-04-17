const whatsappUrl = 'https://wa.me/5519991642207?text=Ol%C3%A1%20Liga%20do%20Bem%2C%20gostaria%20de%20saber%20mais%20sobre%20como%20participar.';
const instagramUrl = 'https://instagram.com/aligadobem';
const googleFormViewUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScU7L94DZblvDCBwXql4Toz4W7r7QTBqf5JsNMk7QRPMjuVKg/viewform';
const googleFormSubmitUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScU7L94DZblvDCBwXql4Toz4W7r7QTBqf5JsNMk7QRPMjuVKg/formResponse';
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const floatingCta = document.getElementById('floating-cta');
const heroSection = document.querySelector('.hero');
const contactSection = document.getElementById('contato');
const siteHeader = document.querySelector('.site-header');
const menuToggle = document.getElementById('menu-toggle');
const navItems = document.querySelectorAll('.nav-links a');

function scrollToForm() {
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeMobileMenu() {
  if (!siteHeader || !menuToggle) {
    return;
  }

  siteHeader.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle?.addEventListener('click', () => {
  if (!siteHeader) {
    return;
  }

  const willOpen = !siteHeader.classList.contains('menu-open');
  siteHeader.classList.toggle('menu-open', willOpen);
  menuToggle.setAttribute('aria-expanded', String(willOpen));
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      closeMobileMenu();
    }
  });
});

document.getElementById('btn-quero-ajudar')?.addEventListener('click', () => {
  scrollToForm();
});

document.getElementById('btn-instagram')?.addEventListener('click', () => {
  window.open(instagramUrl, '_blank');
});

document.getElementById('btn-participar-agora')?.addEventListener('click', () => {
  scrollToForm();
});

document.getElementById('btn-instagram-section')?.addEventListener('click', () => {
  window.open(instagramUrl, '_blank');
});

floatingCta?.addEventListener('click', (event) => {
  event.preventDefault();
  scrollToForm();
});

function updateFloatingCtaVisibility() {
  if (!floatingCta || !heroSection || !contactSection) {
    return;
  }

  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  if (!isMobile) {
    floatingCta.classList.remove('is-hidden-mobile');
    return;
  }

  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
  const passedHero = window.scrollY >= heroBottom;
  const reachedForm = window.scrollY + 120 >= contactSection.offsetTop;
  floatingCta.classList.toggle('is-hidden-mobile', !passedHero || reachedForm);
}

window.addEventListener('scroll', updateFloatingCtaVisibility, { passive: true });
window.addEventListener('resize', () => {
  updateFloatingCtaVisibility();
  if (!window.matchMedia('(max-width: 640px)').matches) {
    closeMobileMenu();
  }
});
updateFloatingCtaVisibility();

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const allowedConheceu = ['Instagram', 'Facebook', 'Familiares', 'Amigos', 'Outro'];
  const allowedAtividades = [
    'Brincadeiras',
    'Pintura Facial',
    'Suporte (organizar filas, entregar presentes, recolher material)',
    'Personagem Fantasiado',
  ];
  const allowedDisponibilidades = [
    'Montagens de sacolinhas (Geralmente realizadas a noite, 2 dias antes do evento)',
    'Ação Atual (Divulgada no grupo de voluntários)',
    'Ações Futuras (Dia das Mães, Dia dos Pais, Dia das Crianças, Natal)',
  ];

  const formData = new FormData(form);
  const nome = String(formData.get('nome') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const endereco = String(formData.get('endereco') || '').trim();
  const telefone = String(formData.get('telefone') || '').trim();
  const experiencia = String(formData.get('experiencia') || '').trim();
  const conheceu = String(formData.get('conheceu') || '').trim();
  const conheceuOutro = String(formData.get('conheceu_outro') || '').trim();
  const atividades = formData.getAll('atividade').map((item) => String(item).trim()).filter(Boolean);
  const atividadeOutro = String(formData.get('atividade_outro') || '').trim();
  const disponibilidades = formData.getAll('disponibilidade').map((item) => String(item).trim()).filter(Boolean);
  const atividadesValidas = atividades.filter((item) => allowedAtividades.includes(item));
  const disponibilidadesValidas = disponibilidades.filter((item) => allowedDisponibilidades.includes(item));

  if (!nome || !email || !endereco || !telefone) {
    formStatus.textContent = 'Preencha nome, e-mail, endereço e telefone.';
    formStatus.className = 'form-status is-error';
    return;
  }

  if (!conheceu) {
    formStatus.textContent = 'Selecione como conheceu o projeto.';
    formStatus.className = 'form-status is-error';
    return;
  }

  if (!allowedConheceu.includes(conheceu)) {
    formStatus.textContent = 'Seleção inválida em "Como conheceu".';
    formStatus.className = 'form-status is-error';
    return;
  }

  const conheceuEhOutro = conheceu === 'Outro';
  if (conheceuEhOutro && !conheceuOutro) {
    formStatus.textContent = 'Se marcou "Outro" em "Como conheceu", preencha o campo de texto.';
    formStatus.className = 'form-status is-error';
    return;
  }

  const incluiuAtividadeOutro = Boolean(atividadeOutro);
  const totalAtividades = atividadesValidas.length + (incluiuAtividadeOutro ? 1 : 0);

  if (totalAtividades === 0 || totalAtividades > 2) {
    formStatus.textContent = 'Selecione de 1 a 2 atividades.';
    formStatus.className = 'form-status is-error';
    return;
  }

  if (disponibilidadesValidas.length === 0) {
    formStatus.textContent = 'Selecione ao menos uma disponibilidade.';
    formStatus.className = 'form-status is-error';
    return;
  }

  const payload = new URLSearchParams();
  payload.append('entry.518304241', email);
  payload.append('entry.1258563751', nome);
  payload.append('entry.69194489', endereco);
  payload.append('entry.193750435', telefone);
  if (experiencia) {
    payload.append('entry.1203594912', experiencia);
  }
  if (conheceuEhOutro) {
    payload.append('entry.167906286', '__other_option__');
    payload.append('entry.167906286.other_option_response', conheceuOutro);
  } else {
    payload.append('entry.167906286', conheceu);
  }

  atividadesValidas.forEach((atividade) => payload.append('entry.1342325393', atividade));
  if (incluiuAtividadeOutro) {
    payload.append('entry.1342325393', '__other_option__');
    payload.append('entry.1342325393.other_option_response', atividadeOutro);
  }
  disponibilidadesValidas.forEach((item) => payload.append('entry.2081573839', item));

  formStatus.textContent = 'Enviando cadastro...';
  formStatus.className = 'form-status';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  fetch(googleFormSubmitUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: payload.toString(),
    signal: controller.signal,
  })
    .then(() => {
      clearTimeout(timeoutId);
      formStatus.textContent = 'Cadastro enviado com sucesso! Em breve nossa equipe entrará em contato.';
      formStatus.className = 'form-status is-success';
      form.reset();
    })
    .catch(() => {
      clearTimeout(timeoutId);
      formStatus.textContent = 'Não conseguimos confirmar o envio aqui. Vamos abrir o Google Forms para você concluir.';
      formStatus.className = 'form-status is-error';
      window.open(googleFormViewUrl, '_blank');
    });
});
