const COVER_MAP: { [key: string]: string } = {
  'normandesign': 'https://books.google.com/books/content?id=vl6yDwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'refactoring': 'https://books.google.com/books/content?id=1D5SDwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'cleancode': 'https://books.google.com/books/content?id=hjEFCAAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'sapiens': 'https://books.google.com/books/content?id=FmyBAwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'zerotoone': 'https://books.google.com/books/content?id=y414AwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'atomichabits': 'https://books.google.com/books/content?id=fayeDwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'thinkingfast': 'https://books.google.com/books/content?id=Zu5dNS4ALaAC&printsec=frontcover&img=1&zoom=1',
  'leanstartup': 'https://books.google.com/books/content?id=hV9QHR534tQC&printsec=frontcover&img=1&zoom=1',
  'startwithwhy': 'https://books.google.com/books/content?id=7w2gAwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'hobbit': 'https://books.google.com/books/content?id=p7q2AAAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'harrypotter': 'https://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1',
  'percyjackson': 'https://books.google.com/books/content?id=3d9yDwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'educated': 'https://books.google.com/books/content?id=3c81DwAAQBAJ&printsec=frontcover&img=1&zoom=1',
  'stevejobs': 'https://books.google.com/books/content?id=8U2GDwAAQBAJ&printsec=frontcover&img=1&zoom=1'
};

/**
 * Returns a high-quality real book cover URL for the given cover seed.
 * Falls back to a seed-based picsum placeholder if the seed is unrecognized.
 */
export const getBookCover = (coverSeed: string | undefined): string => {
  if (!coverSeed) {
    return 'https://picsum.photos/seed/defaultbook/400/600';
  }
  const cleanSeed = coverSeed.toLowerCase().trim();
  return COVER_MAP[cleanSeed] || `https://picsum.photos/seed/${cleanSeed}/400/600`;
};
