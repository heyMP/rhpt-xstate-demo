import { LitElement, html, css, PropertyValueMap } from "lit";
import { customElement } from 'lit/decorators.js';
import { service } from "../machines/app";
import './xstate-service';

@customElement('xstate-app')
class XstateApp extends LitElement {
  private service = service.start();

  constructor() {
    super();
  }

  render() {
    const nextEvents = this.service.state.nextEvents;
    return html`
      <h1>XState TypeScript Example</h1>
      <xstate-service .service=${this.service}></xstate-service>
    `
  }

  _nextEventHandler(e) {
    const event = e.target.dataset.event;
    this.service.send(event);
    console.log(this.service.state.value)
  }
}
