'use strict';
const steps = [
  ['Received', '£450.00', 'A £450 customer payment appears in the bank feed.'],
  ['Matched', '£450.00', 'The payment matches invoice INV–1042 for the same amount.'],
  ['Reported', '£0.00 due', 'The invoice is paid. The monthly cash report includes the £450 received.']
];
const controls = Array.from(document.querySelectorAll('[data-step]'));
let currentStep = 0;
function renderStep(index) {
  currentStep = index;
  const [status, amount, description] = steps[index];
  document.querySelector('#stagestatus').textContent = status;
  document.querySelector('#stageamount').textContent = amount;
  document.querySelector('#stagedesc').textContent = description;
  controls.forEach((button, position) => button.setAttribute('aria-pressed', String(position === index)));
}
let stepTimer;
controls.forEach((button, index) => button.addEventListener('click', () => {
  clearInterval(stepTimer);
  renderStep(index);
}));
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  stepTimer = setInterval(() => {
    if (!document.hidden && !document.querySelector('#enquiry').open && running) renderStep((currentStep + 1) % steps.length);
  }, 6500);
}
