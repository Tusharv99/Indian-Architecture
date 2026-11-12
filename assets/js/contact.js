/**
 * ==============================================================================
 * ROYAL INDIAN ARCHITECTURE - CONTACT & INQUIRY CONTROLLER
 * Form validation, interactive toast notification, and FAQ accordion
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
});

/**
 * Handles contact form validation and interactive submission feedback
 */
function initContactForm() {
  const form = document.getElementById('architectureInquiryForm');
  const toast = document.getElementById('submissionToast');
  const toastMessage = document.getElementById('toastMessage');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const eraSelect = document.getElementById('interestEra');
    const messageInput = document.getElementById('inquiryMessage');

    // Simple validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    // Email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }

    // Success response
    const sender = nameInput.value.trim();
    const era = eraSelect ? eraSelect.value : 'Indian Architecture';
    
    showToast(`Thank you, ${sender}! Your inquiry regarding ${era} has been received. Our architectural heritage curator will respond shortly.`, 'success');
    
    // Reset form
    form.reset();
  });
}

/**
 * Displays a sleek glassmorphism toast notification
 */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  
  toast.className = `p-4 rounded-2xl glass-panel shadow-2xl border transition-all duration-300 transform translate-y-4 opacity-0 flex items-start gap-3 ${
    isSuccess ? 'border-red-600/40 text-neutral-100 bg-[#17110f]/95' : 'border-red-700/60 text-red-200 bg-[#1a0c0c]/95'
  }`;

  toast.innerHTML = `
    <div class="p-2 rounded-full ${isSuccess ? 'bg-gradient-to-tr from-red-700 to-amber-600 text-white' : 'bg-red-900/40 text-red-300'} mt-0.5">
      ${isSuccess ? `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      ` : `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      `}
    </div>
    <div class="flex-1">
      <h5 class="text-sm font-semibold font-royal ${isSuccess ? 'text-amber-300' : 'text-red-400'}">
        ${isSuccess ? 'Inquiry Dispatched' : 'Attention Required'}
      </h5>
      <p class="text-xs text-neutral-300 mt-0.5 leading-relaxed">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-neutral-400 hover:text-white text-xs p-1">
      &times;
    </button>
  `;

  toastContainer.appendChild(toast);

  // Fade in
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Interactive FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!questionBtn || !answerDiv) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = !answerDiv.classList.contains('hidden');

      // Close all others
      faqItems.forEach(otherItem => {
        const otherAnswer = otherItem.querySelector('.faq-answer');
        const otherIcon = otherItem.querySelector('.faq-icon');
        if (otherAnswer) otherAnswer.classList.add('hidden');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        answerDiv.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
