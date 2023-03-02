import { LitElement, html, css, PropertyValueMap } from "lit";
import { property, customElement } from 'lit/decorators.js';

@customElement('xstate-service')
export class XstateService extends LitElement {
  @property({ type: Object })
  service = null;

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.service?.onTransition(() => {
      this.requestUpdate();
    });
  }

  render() {
    const nextEvents = this.service?.state?.nextEvents ?? [];
    const childServices = Array.from(this.service.children.values());
    return html`
      <p>Current state is ${this.service?.state?.value}</p>
      ${nextEvents.map((event:any) => html`
        <button ?disabled=${!this.service?.state?.can({ type: event })} @click=${this._nextEventHandler.bind(this)} data-event=${event}>${event}</button>
      `)}
      ${this.service?.state?.done ? html`
        Entered a final state
      ` : ''}
      ${childServices.map(service => html`
        <xstate-service .service=${service}></xstate-service>
      `)}
    `
  }

  _nextEventHandler(e:any) {
    const event = e.target.dataset.event;
    this.service.send(event);
  }
}
