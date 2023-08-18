import useTranslation from './useTranslation';

describe('test the useTranslation hook', () => {
  it('tests english translation hook', () => {
    const t = useTranslation('en');

    expect(t('home.title')).toStrictEqual('Home');
  });
  it('tests dutch translation hook', () => {
    const t = useTranslation('nl');

    expect(t('home.title')).toStrictEqual('Thuis');
  });
  it('tests default translation hook', () => {
    const t = useTranslation();

    expect(t('home.title')).toStrictEqual('Home');
  });
  it('tests unknown key translation hook', () => {
    const t = useTranslation();
    const key = 'unknown.key';

    expect(t(key)).toStrictEqual(key);
  });
  it('tests key nesting to far ', () => {
    const t = useTranslation();
    const key = 'home.title.test';

    expect(t(key)).toStrictEqual(key);
  });

  it('tests key nesting to far should work', () => {
    const t = useTranslation();
    const key = 'test.test2.test3';

    expect(t(key)).toStrictEqual('Waarde');
  });
  it('tests key nesting not far enough far ', () => {
    const t = useTranslation();
    const key = 'home';

    expect(t(key)).toStrictEqual(key);
  });
});
