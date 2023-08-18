import { useEffect, useState } from 'react';

export default function useDocumentTitle(title: string, restore = false) {
  const [originalTitle] = useState(document.title);

  useEffect(() => {
    document.title = title;
    return () => {
      if (restore) {
        document.title = originalTitle;
      }
    };
  }, [restore, title, originalTitle]);
}
