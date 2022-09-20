import { LitElement, html, css, PropertyValueMap } from "lit";
import { property, customElement } from 'lit/decorators.js';

@customElement('xstate-service')
class XstateService extends LitElement {
  @property({ type: Object })
  service = null;

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.service?.onTransition(state => {
      console.log(state.toStrings());
      this.requestUpdate();
    })
  }

  render() {
    const nextEvents = this.service?.state?.nextEvents ?? [];
    return html`
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
