export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  year: number;
  stock: number;
  maxStock: number;
  description: string;
  coverSeed: string;
}

export interface BorrowRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  fine?: number;
  status: 'borrowed' | 'pending_return' | 'returned';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  pass: string;
  role: 'member' | 'admin';
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Bookmark {
  id: string;
  bookId: string;
  userId: string;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string;
  status: 'waiting' | 'ready';
  queuePosition: number;
}

export interface SpaceBooking {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'cancelled';
}

export interface LibraryEvent {
  id: string;
  title: string;
  category: string;
  dateStr: string;
  timeStr: string;
  location: string;
  coverSeed: string;
  rotation: number;
}

const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    publisher: 'Basic Books',
    category: 'Design',
    year: 2013,
    stock: 3,
    maxStock: 5,
    description: 'A deep-dive into the cognitive psychology behind good design, explaining why some products satisfy customers while others frustrate them.',
    coverSeed: 'normandesign'
  },
  {
    id: '2',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    publisher: 'Addison-Wesley',
    category: 'Technology',
    year: 2018,
    stock: 2,
    maxStock: 4,
    description: 'The definitive guide to refactoring patterns, showing developers how to restructure code without changing its external behavior.',
    coverSeed: 'refactoring'
  },
  {
    id: '3',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    category: 'Technology',
    year: 2008,
    stock: 0,
    maxStock: 3,
    description: 'A handbook containing practical rules and real-world case studies for writing elegant, clean, and maintainable software.',
    coverSeed: 'cleancode'
  },
  {
    id: '4',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    publisher: 'Harper',
    category: 'History',
    year: 2015,
    stock: 4,
    maxStock: 6,
    description: 'An exploration of the history of humans from the evolution of archaic human species in the Stone Age up to the twenty-first century.',
    coverSeed: 'sapiens'
  },
  {
    id: '5',
    title: 'Zero to One: Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel',
    publisher: 'Crown Business',
    category: 'Business',
    year: 2014,
    stock: 2,
    maxStock: 2,
    description: 'An optimistic view of the future of progress in America and a new way of thinking about innovation: it starts by learning to think for yourself.',
    coverSeed: 'zerotoone'
  },
  {
    id: '6',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    author: 'James Clear',
    publisher: 'Avery',
    category: 'Self-Improvement',
    year: 2018,
    stock: 5,
    maxStock: 5,
    description: 'A practical framework for forming good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results.',
    coverSeed: 'atomichabits'
  },
  {
    id: '7',
    title: 'Infinite Ladders: Reaching the Sky of Innovation',
    author: 'Christopher Epstein',
    publisher: 'Crown Publishing',
    category: 'Self-Improvement',
    year: 2021,
    stock: 2,
    maxStock: 4,
    description: 'A study on architectural logic and creative innovation to reach ladders of career growth.',
    coverSeed: 'ladders'
  },
  {
    id: '8',
    title: 'My Dear Buddy: A Tale of Friendship and Loyalty',
    author: 'Jonathan Kent',
    publisher: 'Penguin Books',
    category: 'Fiction',
    year: 2020,
    stock: 3,
    maxStock: 3,
    description: 'A moving narrative of friendship, emotional bonding, and lifelong loyalty.',
    coverSeed: 'buddy'
  },
  {
    id: '9',
    title: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    publisher: 'Reynal & Hitchcock',
    category: 'Children',
    year: 1943,
    stock: 4,
    maxStock: 4,
    description: 'Sebuah cerita klasik tentang seorang pangeran muda yang mengunjungi berbagai planet di luar angkasa, termasuk Bumi, dan membahas tema persahabatan, cinta, dan kehilangan.',
    coverSeed: 'littleprince'
  },
  {
    id: '10',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    publisher: 'Macmillan',
    category: 'Children',
    year: 1865,
    stock: 3,
    maxStock: 3,
    description: 'Kisah petualangan Alice yang jatuh ke dalam lubang kelinci dan memasuki dunia fantasi aneh yang dihuni oleh makhluk-makhluk antropomorfik yang tidak biasa.',
    coverSeed: 'alice'
  },
  {
    id: '11',
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    publisher: 'Scholastic',
    category: 'Teen',
    year: 1997,
    stock: 5,
    maxStock: 5,
    description: 'Kisah seorang anak yatim piatu bernama Harry Potter yang mengetahui bahwa dirinya adalah seorang penyihir pada hari ulang tahunnya yang ke-11 dan bersekolah di Hogwarts.',
    coverSeed: 'harrypotter1'
  },
  {
    id: '12',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    publisher: 'George Allen & Unwin',
    category: 'Teen',
    year: 1937,
    stock: 2,
    maxStock: 2,
    description: 'Petualangan Bilbo Baggins, seorang hobbit yang menyukai kenyamanan, yang dipaksa keluar dari rumahnya untuk membantu sekelompok kurcaci merebut kembali gunung mereka dari naga Smaug.',
    coverSeed: 'hobbit'
  },
  {
    id: '13',
    title: 'Peter Pan',
    author: 'J.M. Barrie',
    publisher: 'Hodder & Stoughton',
    category: 'Children',
    year: 1911,
    stock: 3,
    maxStock: 3,
    description: 'Kisah petualangan Peter Pan, anak laki-laki yang menolak untuk tumbuh dewasa, bersama Wendy dan saudara-saudaranya di pulau ajaib Neverland.',
    coverSeed: 'peterpan'
  },
  {
    id: '14',
    title: 'Percy Jackson: The Lightning Thief',
    author: 'Rick Riordan',
    publisher: 'Miramax Books',
    category: 'Teen',
    year: 2005,
    stock: 4,
    maxStock: 4,
    description: 'Percy Jackson, seorang anak laki-laki berusia 12 tahun yang menderita disleksia, menemukan bahwa dirinya adalah seorang demigod, putra dari dewa Poseidon, dan dituduh mencuri petir Zeus.',
    coverSeed: 'percyjackson'
  }
];

const libraryEvents: LibraryEvent[] = [
  { id: 'e1', title: 'Annual Summer Book Sale', category: 'BOOK SALE', dateStr: 'Wed, Jun 10', timeStr: '09.00 AM - 05.00 PM', location: 'AtmaLibrary Front Yard', coverSeed: 'booksstack', rotation: -3 },
  { id: 'e2', title: 'Preschool Storytime', category: 'STORYTELLING', dateStr: 'Mon, Sep 24', timeStr: '10.00 AM - 11.30 AM', location: 'Children Section', coverSeed: 'fatherdaughter', rotation: 0 },
  { id: 'e3', title: 'Family Storytime', category: 'STORYTELLING', dateStr: 'Wed, Sep 26', timeStr: '04.00 PM - 05.30 PM', location: 'Children Section', coverSeed: 'familyreading', rotation: 3 },
  { id: 'e4', title: 'Toddler Storytime', category: 'STORYTELLING', dateStr: 'Fri, Sep 28', timeStr: '09.30 AM - 10.30 AM', location: 'Children Section', coverSeed: 'motherdaughter', rotation: -2 },
  { id: 'e5', title: "AtmaLibrary's Book Club", category: 'DISCUSSION', dateStr: 'Fri, Oct 05', timeStr: '07.00 PM - 08.30 PM', location: 'Meeting Room 2', coverSeed: 'bookclub', rotation: 2 },
  { id: 'e6', title: 'Holiday Community Yard Sale', category: 'COMMUNITY', dateStr: 'Mon, Dec 03', timeStr: '08.00 AM - 04.00 PM', location: 'AtmaLibrary Front Yard', coverSeed: 'yardsale', rotation: -1 }
];

const INITIAL_USERS: UserAccount[] = [
  { id: 'MEM001', name: 'Adrian Wijaya', email: 'adrian@atmalibrary.org', phone: '+62 812-3456-7890', pass: 'password', role: 'member', status: 'active', joinDate: '2025-03-12' },
  { id: 'MEM002', name: 'Budi Santoso', email: 'budi@atmalibrary.org', phone: '+62 813-4567-8901', pass: 'password', role: 'member', status: 'active', joinDate: '2025-04-15' },
  { id: 'MEM003', name: 'Citra Lestari', email: 'citra@atmalibrary.org', phone: '+62 814-5678-9012', pass: 'password', role: 'member', status: 'active', joinDate: '2025-05-20' },
  { id: 'ADM001', name: 'Admin Perpustakaan', email: 'admin@atmalibrary.org', phone: '+62 811-1111-1111', pass: 'password', role: 'admin', status: 'active', joinDate: '2025-01-01' }
];

const initStorage = () => {
  const storedBooks = localStorage.getItem('lib_books');
  if (!storedBooks) {
    localStorage.setItem('lib_books', JSON.stringify(INITIAL_BOOKS));
  } else {
    try {
      const parsed = JSON.parse(storedBooks);
      if (parsed.length < INITIAL_BOOKS.length) {
        localStorage.setItem('lib_books', JSON.stringify(INITIAL_BOOKS));
      }
    } catch (e) {
      localStorage.setItem('lib_books', JSON.stringify(INITIAL_BOOKS));
    }
  }
  if (!localStorage.getItem('lib_borrows')) {
    localStorage.setItem('lib_borrows', JSON.stringify([]));
  }
  if (!localStorage.getItem('lib_bookmarks')) {
    localStorage.setItem('lib_bookmarks', JSON.stringify([]));
  }
  if (!localStorage.getItem('lib_reservations')) {
    localStorage.setItem('lib_reservations', JSON.stringify([]));
  }
  if (!localStorage.getItem('lib_space_bookings')) {
    localStorage.setItem('lib_space_bookings', JSON.stringify([]));
  }
  if (!localStorage.getItem('lib_users')) {
    localStorage.setItem('lib_users', JSON.stringify(INITIAL_USERS));
  }
};

export const mockDb = {
  getBooks: (): Book[] => {
    initStorage();
    return JSON.parse(localStorage.getItem('lib_books') || '[]');
  },

  getBorrowRequests: (userId: string): BorrowRequest[] => {
    initStorage();
    const all: BorrowRequest[] = JSON.parse(localStorage.getItem('lib_borrows') || '[]');
    return all.filter(r => r.userId === userId);
  },

  borrowBook: (bookId: string, userId: string): { success: boolean; message: string } => {
    initStorage();
    const books: Book[] = JSON.parse(localStorage.getItem('lib_books') || '[]');
    const borrows: BorrowRequest[] = JSON.parse(localStorage.getItem('lib_borrows') || '[]');

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
      return { success: false, message: 'Book not found.' };
    }

    const book = books[bookIndex];
    if (book.stock <= 0) {
      return { success: false, message: 'This book is currently out of stock.' };
    }

    // Active borrows count limit (max 3)
    const activeBorrows = borrows.filter(b => b.userId === userId && b.status !== 'returned');
    if (activeBorrows.length >= 3) {
      return { success: false, message: 'You have reached your limit of 3 active borrows.' };
    }

    // Check if already borrowing this book
    const alreadyBorrowed = activeBorrows.some(b => b.bookId === bookId);
    if (alreadyBorrowed) {
      return { success: false, message: 'You are already borrowing an active copy of this book.' };
    }

    // Update stock
    book.stock -= 1;
    books[bookIndex] = book;

    // Create borrow log
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14); // 14-day limit

    const newBorrow: BorrowRequest = {
      id: Math.random().toString(36).substring(2, 9),
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      userId,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'borrowed'
    };

    borrows.unshift(newBorrow);

    localStorage.setItem('lib_books', JSON.stringify(books));
    localStorage.setItem('lib_borrows', JSON.stringify(borrows));

    return { success: true, message: 'Book borrowed successfully.' };
  },

  requestReturn: (borrowId: string): { success: boolean; message: string } => {
    initStorage();
    const borrows: BorrowRequest[] = JSON.parse(localStorage.getItem('lib_borrows') || '[]');
    const borrowIndex = borrows.findIndex(b => b.id === borrowId);

    if (borrowIndex === -1) {
      return { success: false, message: 'Borrow record not found.' };
    }

    borrows[borrowIndex].status = 'pending_return';
    localStorage.setItem('lib_borrows', JSON.stringify(borrows));

    return { success: true, message: 'Permintaan pengembalian dikirim. Menunggu verifikasi admin.' };
  },

  // --- V2 Features ---
  getBookmarks: (userId: string): Bookmark[] => {
    initStorage();
    const all: Bookmark[] = JSON.parse(localStorage.getItem('lib_bookmarks') || '[]');
    return all.filter(b => b.userId === userId);
  },

  toggleBookmark: (bookId: string, userId: string): { isBookmarked: boolean } => {
    initStorage();
    const bookmarks: Bookmark[] = JSON.parse(localStorage.getItem('lib_bookmarks') || '[]');
    const existingIndex = bookmarks.findIndex(b => b.bookId === bookId && b.userId === userId);
    
    if (existingIndex !== -1) {
      bookmarks.splice(existingIndex, 1);
      localStorage.setItem('lib_bookmarks', JSON.stringify(bookmarks));
      return { isBookmarked: false };
    } else {
      bookmarks.push({ id: Math.random().toString(36).substring(2, 9), bookId, userId });
      localStorage.setItem('lib_bookmarks', JSON.stringify(bookmarks));
      return { isBookmarked: true };
    }
  },

  getReservations: (userId: string): Reservation[] => {
    initStorage();
    const all: Reservation[] = JSON.parse(localStorage.getItem('lib_reservations') || '[]');
    return all.filter(r => r.userId === userId);
  },

  reserveBook: (bookId: string, userId: string): { success: boolean; message: string } => {
    initStorage();
    const books: Book[] = JSON.parse(localStorage.getItem('lib_books') || '[]');
    const reservations: Reservation[] = JSON.parse(localStorage.getItem('lib_reservations') || '[]');
    
    const book = books.find(b => b.id === bookId);
    if (!book) return { success: false, message: 'Book not found' };

    const existing = reservations.find(r => r.bookId === bookId && r.userId === userId);
    if (existing) return { success: false, message: 'You are already on the waitlist for this book.' };

    const queuePosition = reservations.filter(r => r.bookId === bookId).length + 1;

    reservations.push({
      id: Math.random().toString(36).substring(2, 9),
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      userId,
      status: 'waiting',
      queuePosition
    });

    localStorage.setItem('lib_reservations', JSON.stringify(reservations));
    return { success: true, message: `Joined waitlist. You are number ${queuePosition} in queue.` };
  },

  getSpaceBookings: (userId: string): SpaceBooking[] => {
    initStorage();
    const all: SpaceBooking[] = JSON.parse(localStorage.getItem('lib_space_bookings') || '[]');
    return all.filter(b => b.userId === userId);
  },

  bookSpace: (roomId: string, roomName: string, userId: string, date: string, timeSlot: string): { success: boolean; message: string } => {
    initStorage();
    const bookings: SpaceBooking[] = JSON.parse(localStorage.getItem('lib_space_bookings') || '[]');
    
    const isConflict = bookings.some(b => b.roomId === roomId && b.date === date && b.timeSlot === timeSlot && b.status === 'confirmed');
    if (isConflict) return { success: false, message: 'This slot is already booked.' };

    bookings.push({
      id: Math.random().toString(36).substring(2, 9),
      roomId,
      roomName,
      userId,
      date,
      timeSlot,
      status: 'confirmed'
    });

    localStorage.setItem('lib_space_bookings', JSON.stringify(bookings));
    return { success: true, message: `Space booked successfully for ${date} at ${timeSlot}.` };
  },

  getRecommendations: (): Book[] => {
    // Simple mock: return 3 random books
    const books: Book[] = JSON.parse(localStorage.getItem('lib_books') || '[]');
    return [...books].sort(() => 0.5 - Math.random()).slice(0, 3);
  },

  getEvents: (): LibraryEvent[] => {
    return [...libraryEvents];
  },

  resetDb: () => {
    localStorage.setItem('lib_books', JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem('lib_borrows', JSON.stringify([]));
    localStorage.setItem('lib_bookmarks', JSON.stringify([]));
    localStorage.setItem('lib_reservations', JSON.stringify([]));
    localStorage.setItem('lib_space_bookings', JSON.stringify([]));
    localStorage.setItem('lib_users', JSON.stringify(INITIAL_USERS));
  },

  // --- Admin Functions ---
  getUsers: (): UserAccount[] => {
    initStorage();
    return JSON.parse(localStorage.getItem('lib_users') || '[]');
  },

  getMembers: (): UserAccount[] => {
    initStorage();
    const users: UserAccount[] = JSON.parse(localStorage.getItem('lib_users') || '[]');
    return users.filter(u => u.role === 'member');
  },

  addMember: (member: Omit<UserAccount, 'joinDate'>): { success: boolean; message: string } => {
    initStorage();
    const users: UserAccount[] = JSON.parse(localStorage.getItem('lib_users') || '[]');
    
    if (users.some(u => u.id.toLowerCase() === member.id.toLowerCase())) {
      return { success: false, message: 'ID Anggota sudah terdaftar.' };
    }

    users.push({
      ...member,
      joinDate: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('lib_users', JSON.stringify(users));
    return { success: true, message: 'Anggota baru berhasil didaftarkan.' };
  },

  updateMember: (member: UserAccount): { success: boolean; message: string } => {
    initStorage();
    const users: UserAccount[] = JSON.parse(localStorage.getItem('lib_users') || '[]');
    const idx = users.findIndex(u => u.id === member.id);
    if (idx === -1) return { success: false, message: 'Anggota tidak ditemukan.' };

    users[idx] = member;
    localStorage.setItem('lib_users', JSON.stringify(users));
    return { success: true, message: 'Data anggota berhasil diperbarui.' };
  },

  addBook: (book: Omit<Book, 'id'>): { success: boolean; message: string; book?: Book } => {
    initStorage();
    const books: Book[] = JSON.parse(localStorage.getItem('lib_books') || '[]');
    
    const newId = (books.length > 0 ? Math.max(...books.map(b => parseInt(b.id) || 0)) + 1 : 1).toString();
    const newBook: Book = {
      ...book,
      id: newId
    };

    books.push(newBook);
    localStorage.setItem('lib_books', JSON.stringify(books));
    return { success: true, message: 'Buku baru berhasil ditambahkan.', book: newBook };
  },

  updateBook: (book: Book): { success: boolean; message: string } => {
    initStorage();
    const books: Book[] = JSON.parse(localStorage.getItem('lib_books') || '[]');
    const idx = books.findIndex(b => b.id === book.id);
    if (idx === -1) return { success: false, message: 'Buku tidak ditemukan.' };

    books[idx] = book;
    localStorage.setItem('lib_books', JSON.stringify(books));
    return { success: true, message: 'Data buku berhasil diperbarui.' };
  },

  deleteBook: (bookId: string): { success: boolean; message: string } => {
    initStorage();
    const books: Book[] = JSON.parse(localStorage.getItem('lib_books') || '[]');
    const filtered = books.filter(b => b.id !== bookId);
    if (filtered.length === books.length) return { success: false, message: 'Buku tidak ditemukan.' };

    localStorage.setItem('lib_books', JSON.stringify(filtered));
    return { success: true, message: 'Buku berhasil dihapus.' };
  },

  getAllTransactions: (): BorrowRequest[] => {
    initStorage();
    return JSON.parse(localStorage.getItem('lib_borrows') || '[]');
  },

  adminVerifyReturn: (borrowId: string): { success: boolean; message: string; fine?: number } => {
    initStorage();
    const borrows: BorrowRequest[] = JSON.parse(localStorage.getItem('lib_borrows') || '[]');
    const books: Book[] = JSON.parse(localStorage.getItem('lib_books') || '[]');
    const borrowIndex = borrows.findIndex(b => b.id === borrowId);

    if (borrowIndex === -1) {
      return { success: false, message: 'Transaksi tidak ditemukan.' };
    }

    const borrow = borrows[borrowIndex];
    if (borrow.status === 'returned') {
      return { success: false, message: 'Buku sudah diverifikasi kembali.' };
    }

    // Calculate fine (Rp 5.000 per day if overdue)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(borrow.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    let fine = 0;
    if (today > dueDate) {
      const diffTime = Math.abs(today.getTime() - dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 5000;
    }

    // Update borrow log
    borrow.status = 'returned';
    borrow.returnDate = today.toISOString().split('T')[0];
    borrow.fine = fine;
    borrows[borrowIndex] = borrow;

    // Update book stock
    const bookIndex = books.findIndex(b => b.id === borrow.bookId);
    if (bookIndex !== -1) {
      books[bookIndex].stock = Math.min(books[bookIndex].stock + 1, books[bookIndex].maxStock);
    }

    localStorage.setItem('lib_borrows', JSON.stringify(borrows));
    localStorage.setItem('lib_books', JSON.stringify(books));

    return { 
      success: true, 
      message: fine > 0 
        ? `Pengembalian sukses diverifikasi. Terlambat dikenakan denda Rp ${fine.toLocaleString('id-ID')}` 
        : 'Pengembalian sukses diverifikasi tanpa denda.', 
      fine 
    };
  }
};
