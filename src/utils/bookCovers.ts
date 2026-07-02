const COVER_MAP: { [key: string]: string } = {
  'normandesign': 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg',
  'refactoring': 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg',
  'cleancode': 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
  'sapiens': 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
  'zerotoone': 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
  'atomichabits': 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  'thinkingfast': 'https://covers.openlibrary.org/b/isbn/9780374275631-L.jpg',
  'leanstartup': 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
  'startwithwhy': 'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg',
  'hobbit': 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
  'harrypotter': 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg',
  'percyjackson': 'https://covers.openlibrary.org/b/isbn/9780786838653-L.jpg',
  'educated': 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
  'stevejobs': 'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg'
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
