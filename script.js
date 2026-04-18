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
const phoneInput = document.getElementById('telefone');
const conheceuOutroInput = document.getElementById('conheceu-outro');
const conheceuOutroError = document.getElementById('conheceu-outro-error');
const atividadeInputs = Array.from(document.querySelectorAll('input[name="atividade"]'));
const atividadeOutroInput = document.getElementById('atividade-outro');
const disponibilidadeInputs = Array.from(document.querySelectorAll('input[name="disponibilidade"]'));
const submitButton = form?.querySelector('button[type="submit"]');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const enderecoInput = document.getElementById('endereco');
const nomeError = document.getElementById('nome-error');
const emailError = document.getElementById('email-error');
const telefoneError = document.getElementById('telefone-error');
const enderecoError = document.getElementById('endereco-error');

function showFieldError(input, errorEl, message) {
  if (!input || !errorEl) {
    return;
  }
  input.classList.add('is-invalid');
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearFieldError(input, errorEl) {
  if (!input || !errorEl) {
    return;
  }
  input.classList.remove('is-invalid');
  errorEl.textContent = '';
  errorEl.hidden = true;
}

function getFieldErrorMessage(input) {
  if (!input.value.trim()) {
    if (input.id === 'nome') return 'Preencha seu nome.';
    if (input.id === 'email') return 'Preencha seu e-mail.';
    if (input.id === 'telefone') return 'Preencha o celular com DDD.';
    if (input.id === 'endereco') return 'Preencha seu endereço.';
  }
  if (input.id === 'email') return 'Informe um e-mail válido.';
  if (input.id === 'telefone') return 'Celular inválido.';
  if (input.id === 'nome') return 'Mínimo 3 caracteres.';
  if (input.id === 'endereco') return 'Mínimo 5 caracteres.';
  return 'Campo inválido.';
}

function clearConheceuOutroErrorState() {
  if (!conheceuOutroInput) {
    return;
  }

  conheceuOutroInput.classList.remove('is-invalid');
  const wrapper = conheceuOutroInput.closest('.choice-other');
  wrapper?.classList.remove('has-error');

  if (conheceuOutroError) {
    conheceuOutroError.textContent = '';
    conheceuOutroError.hidden = true;
  }
}

function getAtividadeCount() {
  const selecionadas = atividadeInputs.filter((item) => item.checked).length;
  return selecionadas + (hasAtividadeOutroValue() ? 1 : 0);
}

function updateSubmitButtonState() {
  if (!submitButton) {
    return;
  }

  const requiredFieldsValid = [nomeInput, emailInput, phoneInput, enderecoInput]
    .every((input) => input && input.value.trim() && input.checkValidity());

  const atividadeCount = getAtividadeCount();
  const atividadeValida = atividadeCount >= 1 && atividadeCount <= 2;
  const disponibilidadeValida = disponibilidadeInputs.some((item) => item.checked);

  submitButton.disabled = !(requiredFieldsValid && atividadeValida && disponibilidadeValida);
}

function hasAtividadeOutroValue() {
  return Boolean(String(atividadeOutroInput?.value || '').trim());
}

function updateAtividadeLimitState() {
  const selecionadas = atividadeInputs.filter((item) => item.checked);
  const totalSelecionado = selecionadas.length + (hasAtividadeOutroValue() ? 1 : 0);
  const atingiuLimite = totalSelecionado >= 2;

  atividadeInputs.forEach((item) => {
    const deveDesabilitar = atingiuLimite && !item.checked;
    item.disabled = deveDesabilitar;

    const label = item.closest('label');
    if (label) {
      label.classList.toggle('is-disabled', deveDesabilitar);
      label.setAttribute('aria-disabled', String(deveDesabilitar));
    }
  });

  if (atividadeOutroInput) {
    const deveDesabilitarOutro = atingiuLimite && !hasAtividadeOutroValue();
    atividadeOutroInput.disabled = deveDesabilitarOutro;

    const otherWrapper = atividadeOutroInput.closest('.choice-other');
    if (otherWrapper) {
      otherWrapper.classList.toggle('is-disabled', deveDesabilitarOutro);
      otherWrapper.setAttribute('aria-disabled', String(deveDesabilitarOutro));
    }
  }
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function formatBrazilPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidBrazilPhone(value) {
  const digits = onlyDigits(value);
  return digits.length === 11;
}

function scrollToForm() {
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

phoneInput?.addEventListener('input', () => {
  phoneInput.setCustomValidity('');
  phoneInput.value = formatBrazilPhone(phoneInput.value);
  if (phoneInput.checkValidity()) {
    clearFieldError(phoneInput, telefoneError);
  }
  updateSubmitButtonState();
});

phoneInput?.addEventListener('blur', () => {
  phoneInput.setCustomValidity('');
  if (!phoneInput.checkValidity()) {
    showFieldError(phoneInput, telefoneError, getFieldErrorMessage(phoneInput));
  } else {
    clearFieldError(phoneInput, telefoneError);
  }
});

phoneInput?.addEventListener('invalid', () => {
  if (!phoneInput.value) {
    phoneInput.setCustomValidity('Preencha o celular com DDD.');
    return;
  }

  if (!isValidBrazilPhone(phoneInput.value)) {
    phoneInput.setCustomValidity('Informe um celular válido no formato (19) 99999-9999.');
  }
});

conheceuOutroInput?.addEventListener('input', () => {
  conheceuOutroInput.setCustomValidity('');
  clearConheceuOutroErrorState();
});

const fieldErrorMap = [
  [nomeInput, nomeError],
  [emailInput, emailError],
  [enderecoInput, enderecoError],
];

fieldErrorMap.forEach(([input, errorEl]) => {
  input?.addEventListener('input', () => {
    if (input.checkValidity()) {
      clearFieldError(input, errorEl);
    }
    updateSubmitButtonState();
  });

  input?.addEventListener('blur', () => {
    if (!input.checkValidity()) {
      showFieldError(input, errorEl, getFieldErrorMessage(input));
    } else {
      clearFieldError(input, errorEl);
    }
  });
});

atividadeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    atividadeInputs.forEach((item) => item.setCustomValidity(''));
    atividadeOutroInput?.setCustomValidity('');
    updateAtividadeLimitState();
    updateSubmitButtonState();
  });
});

atividadeOutroInput?.addEventListener('input', () => {
  atividadeInputs.forEach((item) => item.setCustomValidity(''));
  atividadeOutroInput.setCustomValidity('');
  updateAtividadeLimitState();
  updateSubmitButtonState();
});

disponibilidadeInputs.forEach((input) => {
  input.addEventListener('change', updateSubmitButtonState);
});

updateAtividadeLimitState();
updateSubmitButtonState();

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
  formStatus.textContent = '';
  formStatus.className = 'form-status';

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

  if (conheceu && !allowedConheceu.includes(conheceu)) {
    formStatus.textContent = 'Seleção inválida em "Como conheceu".';
    formStatus.className = 'form-status is-error';
    return;
  }

  const conheceuEhOutro = conheceu === 'Outro';
  if (conheceuEhOutro && !conheceuOutro) {
    if (conheceuOutroInput) {
      const errorMessage = 'Preencha este campo ao selecionar "Outro".';
      conheceuOutroInput.classList.add('is-invalid');
      const wrapper = conheceuOutroInput.closest('.choice-other');
      wrapper?.classList.add('has-error');

      if (conheceuOutroError) {
        conheceuOutroError.textContent = errorMessage;
        conheceuOutroError.hidden = false;
      }

      conheceuOutroInput.setCustomValidity(errorMessage);
      conheceuOutroInput.reportValidity();
      conheceuOutroInput.focus();
      conheceuOutroInput.setCustomValidity('');
    }
    return;
  }

  clearConheceuOutroErrorState();

  const incluiuAtividadeOutro = Boolean(atividadeOutro);
  const totalAtividades = atividadesValidas.length + (incluiuAtividadeOutro ? 1 : 0);

  if (totalAtividades === 0 || totalAtividades > 2) {
    const alvoAtividade = atividadeOutroInput && atividadeOutro === '' ? atividadeInputs[0] : atividadeOutroInput || atividadeInputs[0];
    if (alvoAtividade) {
      alvoAtividade.setCustomValidity('Selecione de 1 a 2 atividades.');
      alvoAtividade.reportValidity();
      alvoAtividade.setCustomValidity('');
      alvoAtividade.focus();
    }
    return;
  }

  if (disponibilidadesValidas.length === 0) {
    formStatus.textContent = 'Selecione ao menos uma disponibilidade.';
    formStatus.className = 'form-status is-error';
    return;
  }

  const payload = new URLSearchParams();
  payload.append('entry.1649451105', email);
  payload.append('entry.1258563751', nome);
  payload.append('entry.69194489', endereco);
  payload.append('entry.193750435', telefone);
  if (experiencia) {
    payload.append('entry.1203594912', experiencia);
  }
  if (conheceu) {
    if (conheceuEhOutro) {
      payload.append('entry.167906286', '__other_option__');
      payload.append('entry.167906286.other_option_response', conheceuOutro);
    } else {
      payload.append('entry.167906286', conheceu);
    }
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

  fetch('/.netlify/functions/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: payload.toString(),
    signal: controller.signal,
  })
    .then((response) => {
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }

      const successModal = document.getElementById('success-modal');
      form.reset();
      updateAtividadeLimitState();
      updateSubmitButtonState();
      successModal?.showModal();

      document.getElementById('success-modal-close')?.addEventListener('click', () => successModal?.close(), { once: true });
      successModal?.addEventListener('close', () => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, { once: true });
      successModal?.addEventListener('click', (e) => {
        if (e.target === successModal) successModal.close();
      }, { once: true });
    })
    .catch(() => {
      clearTimeout(timeoutId);
      const errorModal = document.getElementById('error-modal');
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      errorModal?.showModal();

      document.getElementById('error-modal-close')?.addEventListener('click', () => errorModal?.close(), { once: true });
      errorModal?.addEventListener('click', (e) => {
        if (e.target === errorModal) errorModal.close();
      }, { once: true });
    });
});
