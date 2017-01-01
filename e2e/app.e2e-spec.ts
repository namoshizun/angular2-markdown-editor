import { YzBlogPage } from './app.po';

describe('yz-blog App', function() {
  let page: YzBlogPage;

  beforeEach(() => {
    page = new YzBlogPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
