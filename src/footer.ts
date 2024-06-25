export default class Footer {
  footer: HTMLElement;

  constructor(elid: string) {
    this.footer = document.querySelector(elid) as HTMLElement;
  }

  render(time: Date) {
    this.footer.innerText = time.toLocaleString();
  }
}
