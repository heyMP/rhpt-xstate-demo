import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement } from 'lit/decorators.js';
import { productTrialService } from "../machines/app";
import './xstate-service';

@customElement('xstate-app')
class XstateApp extends LitElement {
  private productTrialService = productTrialService.start();

  constructor() {
    super();
  }

  render() {
    return html`
      <h1>XState TypeScript Example</h1>
      <xstate-service .service=${this.productTrialService}></xstate-service>
    `
  }
}
