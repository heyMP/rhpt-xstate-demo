import { LitElement, html, css, PropertyValueMap } from "lit";
import { state } from "lit/decorators/state.js"
import { service } from "../machines/app"

class XstateApp extends LitElement {
  private service = service.start();

  constructor() {
    super();
    this.service.onTransition(state => {
      this.requestUpdate();
    })
  }

  render() {
    const nextEvents = this.service.state.nextEvents;
    return html`
      <h1>XState TypeScript Example</h1>
      <p>Current state is ${this.service.state.value}</p>
      ${nextEvents.map(event => html`
        <button @click=${this._nextEventHandler.bind(this)} data-event=${event}>${event}</button>
      `)}
      ${this.service.state.done ? html`
        Entered a final state
      ` : ''}
    `
  }

  _nextEventHandler(e) {
    const event = e.target.dataset.event;
    this.service.send(event);
    console.log(this.service.state.value)
  }
}

customElements.define('xstate-app', XstateApp);
