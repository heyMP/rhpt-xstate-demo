import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, query } from 'lit/decorators.js';
import { interpret } from 'xstate';
import { inspect } from '@xstate/inspect';
import '@rhdc-fed/rh-product-trial';
import { productTrialMachine } from '../machines/productTrial';
import './xstate-service';

@customElement('xstate-app')
class XstateApp extends LitElement {
  private productTrialService = interpret(productTrialMachine, { devTools: true });
  @query('rh-product-trial') rhProductTrialElement;

  protected firstUpdated(): void {
    this.initMachine();
  }

  protected initMachine() {
    if (!this.rhProductTrialElement) return;
    this.rhProductTrialElement.initialized = false;

    // start the machine
    inspect({ iframe: false });

    this.productTrialService
      .onTransition(state => {
        if (['init'].includes(state.value)) {
          this.rhProductTrialElement.state = '';
          this.rhProductTrialElement.initialized = false;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (['try_it'].includes(state.value)) {
          this.rhProductTrialElement.state = 'default';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (['activate'].includes(state.value)) {
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = true;
        }
        if (['success'].includes(state.value)) {
          this.rhProductTrialElement.state = 'trial_success';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (['in_progress'].includes(state.value)) {
          this.rhProductTrialElement.state = 'trial_in_progress';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (['expired'].includes(state.value)) {
          this.rhProductTrialElement.state = 'trial_expired';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (['error'].includes(state.value)) {
          this.rhProductTrialElement.state = '';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
      })
      .start();
  }

  render() {
    const state = this.productTrialService?.state?.value;
    return html`
      <h1>XState TypeScript Example</h1>
      <xstate-service .service=${this.productTrialService}></xstate-service>
      ${(state === 'error') ? html`
        We have an error going on!
      `: html`
        <rh-product-trial></rh-product-trial>
      `
      }
    `
  }
}
