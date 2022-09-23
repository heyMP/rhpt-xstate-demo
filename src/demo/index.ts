// @ts-nocheck
import { productTrialService } from '../machines/app';
import { states } from '@rhdc-fed/rh-product-trial/dist/src/states.js';

customElements.whenDefined('rh-product-trial').then(() => {
  const el = document.querySelector('rh-product-trial');
  el.initialized = false;

  productTrialService.onTransition(state => {
    if (['init'].includes(state.value)) {
      el.state = '';
      el.initialized = false;
      el.isProcessing = false;
    }
    if (['try_it'].includes(state.value)) {
      el.state = 'default';
      el.initialized = true;
      el.isProcessing = false;
    }
    if (['activate'].includes(state.value)) {
      el.initialized = true;
      el.isProcessing = true;
    }
    if (['success'].includes(state.value)) {
      el.state = 'trial_success';
      el.initialized = true;
      el.isProcessing = false;
    }
    if (['in_progress'].includes(state.value)) {
      el.state = 'trial_in_progress';
      el.initialized = true;
      el.isProcessing = false;
    }
    if (['error'].includes(state.value)) {
      el.state = 'trial_expired';
      el.initialized = true;
      el.isProcessing = false;
    }
  });
});
