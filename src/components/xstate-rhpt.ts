import { LitElement, html } from "lit";
import { customElement, state } from 'lit/decorators.js';
import { assign, createMachine, interpret } from '@xstate/fsm';
// import '@rhdc-fed/rh-product-trial';

export const rhProductTrialMachine = createMachine({
  id: 'rh-product-trial',
  initial: 'init',
  context: {
    state: null,
    initialized: null,
    isProcessing: null,
  },
  states: {
    init: {
      entry: assign({
        state: 'default',
        initialized: false,
        isProcessing: false,
      }),
      on: {
        INIT: { target: 'init' },
        DEFAULT: { target: 'default' },
        ACTIVATING: { target: 'activating' },
        TRIAL_SUCCESS: { target: 'trial_success' },
        TRIAL_IN_PROGRESS: { target: 'trial_in_progress' },
        TRIAL_EXPIRED: { target: 'trial_expired' },
      }
    },
    default: {
      entry: assign({
        state: 'default',
        initialized: true,
        isProcessing: false,
      }),
      on: {
        INIT: { target: 'init' },
        DEFAULT: { target: 'default' },
        ACTIVATING: { target: 'activating' },
        TRIAL_SUCCESS: { target: 'trial_success' },
        TRIAL_IN_PROGRESS: { target: 'trial_in_progress' },
        TRIAL_EXPIRED: { target: 'trial_expired' },
      }
    },
    activating: {
      entry: assign({
        state: 'default',
        initialized: true,
        isProcessing: true,
      }),
      on: {
        INIT: { target: 'init' },
        DEFAULT: { target: 'default' },
        ACTIVATING: { target: 'activating' },
        TRIAL_SUCCESS: { target: 'trial_success' },
        TRIAL_IN_PROGRESS: { target: 'trial_in_progress' },
        TRIAL_EXPIRED: { target: 'trial_expired' },
      }
    },
    trial_success: {
      entry: assign({
        state: 'trial_success',
        initialized: true,
        isProcessing: false,
      })
    },
    trial_in_progress: {
      entry: assign({
        state: 'trial_in_progress',
        initialized: true,
        isProcessing: false,
      })
    },
    trial_expired: {
      entry: assign({
        state: 'trial_expired',
        initialized: true,
        isProcessing: false,
      })
    },
  }
});

@customElement('xstate-rhpt')
class XstateRhpt extends LitElement {
  private rhProductTrialService = interpret(rhProductTrialMachine).start();
  @state() state: string;
  @state() initialized: boolean;
  @state() isProcessing: boolean;

  render() {
    return html`
      <rh-product-trial .state=${this.state} .initialized=${this.initialized} .isProcessing=${this.isProcessing}></rh-product-trial>
    `
  }
}
