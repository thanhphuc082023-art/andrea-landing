import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getStrapiMediaUrl } from '@/utils/helper';
import { useDebounce } from '@/hooks/useDebounce';

interface Book {
  id: number;
  title: string;
  slug: string;
  pdfFile?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  createdAt: string;
}

interface EProfileListPageProps {
  initialBooks: Book[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
  error?: string;
}

const EProfileListPage: React.FC<EProfileListPageProps> = ({
  initialBooks,
  pagination: initialPagination,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [pagination, setPagination] = useState(initialPagination);
  const [hasMore, setHasMore] = useState(
    initialPagination.page < initialPagination.pageCount
  );

  // Ref for intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Load more books function
  const loadMoreBooks = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      let apiUrl = `/api/search-books?page=${nextPage}&limit=12`;

      if (debouncedSearchTerm.trim()) {
        apiUrl += `&q=${encodeURIComponent(debouncedSearchTerm)}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Không thể tải thêm dữ liệu');
      }

      const data = await response.json();

      setBooks((prevBooks) => [...prevBooks, ...data.books]);
      setPagination(data.pagination);
      setHasMore(data.pagination.page < data.pagination.pageCount);
    } catch (err) {
      console.error('Load more error:', err);
      setSearchError('Không thể tải thêm dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, pagination.page, debouncedSearchTerm]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          loadMoreBooks();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore, loadMoreBooks]);

  // Perform search when debounced term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        setBooks(initialBooks);
        setPagination(initialPagination);
        setHasMore(initialPagination.page < initialPagination.pageCount);
        return;
      }

      setLoading(true);
      setSearchError('');

      try {
        const response = await fetch(
          `/api/search-books?q=${encodeURIComponent(debouncedSearchTerm)}&page=1&limit=12`
        );

        if (!response.ok) {
          throw new Error('Tìm kiếm thất bại');
        }

        const data = await response.json();
        setBooks(data.books);
        setPagination(data.pagination);
        setHasMore(data.pagination.page < data.pagination.pageCount);
      } catch (err) {
        console.error('Search error:', err);
        setSearchError('Không thể tìm kiếm. Vui lòng thử lại.');
        setBooks(initialBooks);
        setPagination(initialPagination);
        setHasMore(initialPagination.page < initialPagination.pageCount);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm, initialBooks, initialPagination]);

  if (error) {
    return (
      <>
        <Head>
          <title>Lỗi</title>
        </Head>
        <div className="max-sd:mt-[60px] mt-[65px] min-h-screen bg-gray-100 py-10">
          <div className="container mx-auto">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">Lỗi</h1>
              <p className="text-gray-600">{error}</p>
              <Link
                href="/e-profile"
                className="text-brand-orange mt-4 inline-flex items-center hover:text-blue-800"
              >
                Quay về danh sách
              </Link>
            </div>
          </div>
        </div>{' '}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Danh sách E-Profile</title>
        <meta
          name="description"
          content="Khám phá bộ sưu tập E-Profile - những cuốn sách điện tử tương tác 3D"
        />
      </Head>

      <div className="max-sd:mt-[60px] mt-[65px] min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Danh sách E-Profile
            </h1>
            <p className="text-gray-600">
              Khám phá bộ sưu tập E-Profile - những cuốn sách điện tử tương tác
              3D
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mb-8 max-w-md">
            <div className="relative flex items-center gap-1">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:border-brand-orange focus:ring-brand-orange rounded-10 w-full border border-gray-300 px-4 py-3 pl-10"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {loading && (
                <div className="absolute right-3 top-3.5">
                  <div className="border-brand-orange h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                </div>
              )}
              <Link
                href="/upload/e-profile"
                className="bg-brand-orange hover:bg-brand-orange-light rounded-10 inline-flex h-[50px] items-center p-3 font-semibold text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Link>
            </div>
            {searchError && (
              <p className="mt-2 text-sm text-red-600">{searchError}</p>
            )}
          </div>

          {/* Books Grid */}
          {loading ? (
            // Skeleton Loading
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {searchTerm.trim()
                  ? 'Không tìm thấy kết quả'
                  : 'Chưa có E-Profile nào'}
              </h3>
              <p className="text-gray-600">
                {searchTerm.trim()
                  ? 'Thử tìm kiếm với từ khóa khác hoặc tạo E-Profile mới'
                  : 'Hãy tạo E-Profile đầu tiên của bạn'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Load More Trigger */}
          {hasMore && !loading && (
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {loadingMore ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="border-brand-orange h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span>Đang tải thêm...</span>
                </div>
              ) : (
                <div className="text-gray-400">Cuộn xuống để tải thêm</div>
              )}
            </div>
          )}

          {/* End of results indicator */}
          {!hasMore && books.length > 0 && !loading && (
            <div className="mt-8 text-center text-gray-500">
              <div className="inline-flex items-center space-x-2">
                <div className="h-px w-16 bg-gray-300"></div>
                <span className="text-sm">
                  Đã hiển thị tất cả {pagination.total} kết quả
                </span>
                <div className="h-px w-16 bg-gray-300"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface BookCardProps {
  book: Book;
}

const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-10 overflow-hidden border bg-white shadow-md">
      {/* Skeleton Thumbnail */}
      <div className="mb-4 aspect-[3/4] animate-pulse bg-gray-200"></div>

      {/* Skeleton Content */}
      <div className="px-6 pb-6">
        <div className="h-6 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [copied, setCopied] = useState(false);
  const thumbnailUrl = book.thumbnail
    ? getStrapiMediaUrl(book.thumbnail)
    : null;
  const pdfUrl = book.pdfFile ? getStrapiMediaUrl(book.pdfFile) : null;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/e-profile/${book.slug}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/e-profile/${book.slug}`}>
      <div className="rounded-10 group relative cursor-pointer overflow-hidden border bg-white shadow-md transition-all duration-300 hover:shadow-lg">
        {/* Copy Button - Top Right */}
        <button
          onClick={handleCopyLink}
          className={`absolute right-3 top-3 z-10 rounded-md p-2 text-sm font-semibold transition-all duration-200 ${
            copied
              ? 'bg-green-100 text-green-700 shadow-md'
              : 'bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-white hover:shadow-md'
          }`}
          title={copied ? 'Đã sao chép!' : 'Sao chép link'}
        >
          {copied ? (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>

        {/* Thumbnail */}
        <div className="mb-4 aspect-[3/4] overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`${book.title} thumbnail`}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <h3
            className="group-hover:text-brand-orange text-lg font-semibold text-gray-900 transition-colors duration-200"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books?populate=*&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=12`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const books: Book[] = data.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      pdfFile: item.pdfFile,
      thumbnail: item.thumbnail,
      createdAt: item.createdAt,
    }));

    return {
      props: {
        initialBooks: books,
        pagination: data.meta?.pagination || {
          page: 1,
          pageSize: 12,
          pageCount: 1,
          total: books.length,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    return {
      props: {
        initialBooks: [],
        pagination: {
          page: 1,
          pageSize: 12,
          pageCount: 1,
          total: 0,
        },
        error: 'Không thể tải danh sách E-Profile. Vui lòng thử lại sau.',
      },
    };
  }
};

export default EProfileListPage;
