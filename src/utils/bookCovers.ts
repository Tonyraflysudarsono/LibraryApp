const COVER_MAP: { [key: string]: string } = {
  'normandesign': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1442277527i/840.jpg',
  'refactoring': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386920668i/351371.jpg',
  'cleancode': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg',
  'sapiens': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1595674533i/23692271.jpg',
  'zerotoone': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630067394i/18050143.jpg',
  'atomichabits': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988390i/40121378.jpg',
  'thinkingfast': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793930i/11468377.jpg',
  'leanstartup': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1629999184i/10127019.jpg',
  'startwithwhy': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1360558233i/5271661.jpg',
  'hobbit': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg',
  'harrypotter': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg',
  'percyjackson': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1400407761i/28187.jpg',
  'educated': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg',
  'stevejobs': 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1511281625i/11084145.jpg'
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
