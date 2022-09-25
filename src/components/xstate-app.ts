import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement, query, state } from 'lit/decorators.js';
import { interpret } from 'xstate';
import { inspect } from '@xstate/inspect';
import '@rhdc-fed/rh-product-trial';
import { productTrialMachine } from '../machines/productTrial';
import './xstate-service';

@customElement('xstate-app')
class XstateApp extends LitElement {
  private productTrialService = interpret(productTrialMachine, { devTools: true });
  @query('rh-product-trial') rhProductTrialElement;

  @state() error: boolean = false;

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
        if (state.matches('init')) {
          this.rhProductTrialElement.state = '';
          this.rhProductTrialElement.initialized = false;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (state.matches('try_it')) {
          this.rhProductTrialElement.state = 'default';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (state.matches('activate')) {
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = true;
        }
        if (state.matches('success')) {
          this.rhProductTrialElement.state = 'trial_success';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (state.matches('in_progress')) {
          this.rhProductTrialElement.state = 'trial_in_progress';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (state.matches('expired')) {
          this.rhProductTrialElement.state = 'trial_expired';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }
        if (state.matches('error')) {
          this.rhProductTrialElement.state = '';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
        }

        // update local error state
        this.error = state.value === 'error';
      })
      .start();
  }

  render() {
    return html`
      <h1>XState TypeScript Example</h1>
      <xstate-service .service=${this.productTrialService}></xstate-service>
      ${this.error ? html`
        <p>We have an error going on!</p>
      `: html`
        <rh-product-trial></rh-product-trial>
      `
      }
    `
  }
}
