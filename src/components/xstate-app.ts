import { LitElement, html } from "lit";
import { customElement, query, state } from 'lit/decorators.js';
import { interpret } from 'xstate';
import { inspect } from '@xstate/inspect';
import '@rhdc-fed/rh-product-trial';
import { productTrialMachine } from '../machines/productTrial';
import './xstate-service';
/* import { RESPONSE_TYPES } from "../machines/activate"; */

@customElement('xstate-app')
export class XstateApp extends LitElement {
  private productTrialService = interpret(
    productTrialMachine.withContext({
      ...productTrialMachine.context,
      selectedOffer: '12134',
      hasBypass: false
    }), { devTools: true })
    /* .start('Idle'); */
  @query('rh-product-trial') rhProductTrialElement: any;

  @state() error: boolean = false;
  @state() complianceError: boolean = false;

  @state() _showDefaultOptions: boolean = false;

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
        if (state.matches('Initializing')) {
          this.rhProductTrialElement.state = '';
          this.rhProductTrialElement.initialized = false;
          this.rhProductTrialElement.isProcessing = true;
          this._showDefaultOptions = false;
        }
        if (state.matches('Initialized')) {
          this.rhProductTrialElement.state = '';
          this.rhProductTrialElement.initialized = false;
          this.rhProductTrialElement.isProcessing = true;
          this._showDefaultOptions = false;
        }
        if (state.matches('Idle')) {
          this.rhProductTrialElement.state = 'default';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
          this._showDefaultOptions = true;
        }
        if (state.matches('Activating')) {
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = true;
          this._showDefaultOptions = false;
        }
        if (state.matches('success')) {
          this.rhProductTrialElement.state = 'trial_success';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
          this._showDefaultOptions = false;
        }
        if (state.matches('in_progress')) {
          this.rhProductTrialElement.state = 'trial_in_progress';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
          this._showDefaultOptions = false;
        }
        if (state.matches('expired')) {
          this.rhProductTrialElement.state = 'trial_expired';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
          this._showDefaultOptions = false;
        }
        if (state.matches('error')) {
          this.rhProductTrialElement.state = '';
          this.rhProductTrialElement.initialized = true;
          this.rhProductTrialElement.isProcessing = false;
          this._showDefaultOptions = false;
        }

        // update local error state
        this.error = state.value === 'error';
        this.complianceError = state.value === 'compliance';
      })
      .start();
  }

  private _sendStatusCodeEvt(status) {
    /* this.productTrialService.send({ type: 'ACTIVATE', status }); */
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('rh-product-trial:offer-selected', () => console.log('hi'));
  }

  render() {
    console.log(this.productTrialService);
    return html`
      <h1>XState TypeScript Example</h1>
      <xstate-service .service=${this.productTrialService}></xstate-service>
      ${this.productTrialService?.state?.matches('Error') ? html`
        <p>We have an error going on!</p>
      `:
      this.complianceError ? html`
        <p>We need to redirect the user to a compliance page here!</p>
      `:
      html`
        <rh-product-trial></rh-product-trial>
      `
      }
    `
  }
}
