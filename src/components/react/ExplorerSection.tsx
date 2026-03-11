import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './ExplorerSection.css';

interface Breed {
  breed: string;
  country: string;
  origin: string;
  coat: string;
  pattern: string;
}

interface BreedsResponse {
  data: Breed[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
}

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
];

function getColumnsForWidth(width: number): number {
  if (width >= 1025) return 4;
  if (width >= 768) return 3;
  return 2;
}

export default function ExplorerSection() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [columns, setColumns] = useState(() =>
    getColumnsForWidth(typeof window !== 'undefined' ? window.innerWidth : 1200),
  );
  const [visibleCount, setVisibleCount] = useState(columns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCoat, setSelectedCoat] = useState('');
  const [coatDropdownOpen, setCoatDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const newCols = getColumnsForWidth(window.innerWidth);
      setColumns(newCols);
      setVisibleCount((prev) => {
        const rounded = Math.ceil(prev / newCols) * newCols;
        return Math.max(newCols, rounded);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch('https://catfact.ninja/breeds?limit=20', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch breeds');
        return res.json() as Promise<BreedsResponse>;
      })
      .then((data) => {
        setBreeds(data.data);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCoatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const coatOptions = useMemo(() => {
    const coats = new Set(breeds.map((b) => b.coat).filter(Boolean));
    return Array.from(coats).sort();
  }, [breeds]);

  const filteredBreeds = useMemo(() => {
    const term = search.toLowerCase().trim();
    return breeds.filter((b) => {
      const matchesSearch = !term || b.breed.toLowerCase().includes(term);
      const matchesCoat = !selectedCoat || b.coat === selectedCoat;
      return matchesSearch && matchesCoat;
    });
  }, [breeds, search, selectedCoat]);

  useEffect(() => {
    setVisibleCount(columns);
  }, [search, selectedCoat, columns]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + columns, filteredBreeds.length));
  };

  const selectCoat = useCallback((coat: string) => {
    setSelectedCoat(coat);
    setCoatDropdownOpen(false);
    filterBtnRef.current?.focus();
  }, []);

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCoatDropdownOpen(false);
      filterBtnRef.current?.focus();
      return;
    }

    if (!coatDropdownOpen) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = dropdownRef.current?.querySelectorAll<HTMLButtonElement>('.dropdown__item');
      if (!items?.length) return;
      const focused = document.activeElement as HTMLElement;
      const currentIdx = Array.from(items).indexOf(focused as HTMLButtonElement);
      const nextIdx = e.key === 'ArrowDown'
        ? Math.min(currentIdx + 1, items.length - 1)
        : Math.max(currentIdx - 1, 0);
      items[nextIdx].focus();
    }
  };

  const visibleBreeds = filteredBreeds.slice(0, visibleCount);
  const resultCount = filteredBreeds.length;

  return (
    <section className="section explorer-section" id="explore" aria-labelledby="explorer-heading">
      <div className="container">
        <div className="explorer-header">
          <h2 id="explorer-heading" className="explorer-title">Breed Explorer</h2>
          <div className="explorer-actions">
            <label htmlFor="breed-search" className="sr-only">Search breeds</label>
            <input
              type="search"
              id="breed-search"
              placeholder="Search breeds..."
              className="input explorer-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            <div className="explorer-filter-wrapper" ref={dropdownRef} onKeyDown={handleDropdownKeyDown}>
              <button
                ref={filterBtnRef}
                className={`btn btn--md ${selectedCoat ? 'btn--primary' : 'btn--ghost'}`}
                onClick={() => setCoatDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={coatDropdownOpen}
              >
                {selectedCoat || 'Filter by Coat'}
                <svg
                  className={`explorer-filter-chevron ${coatDropdownOpen ? 'explorer-filter-chevron--open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {coatDropdownOpen && (
                <ul className="dropdown" role="listbox" aria-label="Filter by coat type">
                  <li role="option" aria-selected={!selectedCoat}>
                    <button
                      className={`dropdown__item ${!selectedCoat ? 'dropdown__item--active' : ''}`}
                      onClick={() => selectCoat('')}
                    >
                      All Coats
                    </button>
                  </li>
                  {coatOptions.map((coat) => (
                    <li key={coat} role="option" aria-selected={selectedCoat === coat}>
                      <button
                        className={`dropdown__item ${selectedCoat === coat ? 'dropdown__item--active' : ''}`}
                        onClick={() => selectCoat(coat)}
                      >
                        {coat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <p className="explorer-loading" role="status">Loading breeds&hellip;</p>
        )}

        {error && (
          <p className="explorer-error" role="alert">Could not load breeds.</p>
        )}

        {!loading && !error && (
          <>
            <p className="sr-only" role="status" aria-live="polite">
              {resultCount === 0
                ? 'No breeds match your filters.'
                : `Showing ${visibleBreeds.length} of ${resultCount} breeds.`}
            </p>

            {resultCount === 0 ? (
              <p className="explorer-empty">No breeds match your filters.</p>
            ) : (
              <ul className="explorer-grid" aria-label="Cat breeds">
                {visibleBreeds.map((breed, index) => (
                  <li key={breed.breed + index} className="card breed-card">
                    <div
                      className="breed-card-img"
                      role="img"
                      aria-label={`${breed.breed} placeholder`}
                      style={{
                        background: GRADIENT_COLORS[index % GRADIENT_COLORS.length],
                      }}
                    />
                    <div className="breed-card-content">
                      <div className="breed-card-header">
                        <h3 className="breed-card-title">{breed.breed}</h3>
                        <a
                          href={`#${breed.breed.toLowerCase().replace(/\s+/g, '-')}`}
                          className="icon-btn"
                          aria-label={`View ${breed.breed}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M1.5 7H12.5M12.5 7L7.5 2M12.5 7L7.5 12"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                      <ul className="breed-card-tags" aria-label={`${breed.breed} details`}>
                        {breed.country && (
                          <li className="tag">{breed.country}</li>
                        )}
                        {breed.coat && (
                          <li className="tag">{breed.coat}</li>
                        )}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {visibleCount < resultCount && (
              <div className="text-center load-more-container">
                <button className="btn btn--lg btn--gradient" onClick={handleLoadMore}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
