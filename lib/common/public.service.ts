export class PublicService {
  static href(url: string) {
    console.log({
      t: window.location.href,
      url,
      url2: new URL(url, window.location.href).href,
    });
    return new URL(url, window.location.href).href;
  }
}
