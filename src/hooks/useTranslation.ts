const translations = {
  nl: {
    home: {
      title: 'Thuis',
    },
  },
  en: {
    test: {
      test2: 't',
    },
    home: {
      title: 'Home',
    },
  },
};

type result =
  | {
      [key: string]: result;
    }
  | string;

function useTranslation(language: 'en' | 'nl' = 'en'): (key: string) => string {
  return (key: string): string => {
    const keys = key.split('.');
    const translation = translations[language];
    let current: result = translation;
    keys.forEach((pKey) => {
      if (!Object.keys(current).includes(pKey)) {
        current = key;
        return;
      }
      if (typeof current === 'string') {
        return;
      }
      current = current[pKey];
    });
    if (!(typeof current === 'string')) {
      current = key;
    }
    const result = current as unknown as string;
    return result;
  };
}

export default useTranslation;
