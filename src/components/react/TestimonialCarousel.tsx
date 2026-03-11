import { useState, useEffect, useRef, useCallback, type CSSProperties, type KeyboardEvent } from 'react';
import './TestimonialCarousel.css';

interface Testimonial {
    id: number;
    quote: string;
    author: string;
}

interface TrackStyle extends CSSProperties {
    '--current-index': number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "I never knew there were so many types of T-Rex cats! Found my dream pet.",
        author: "Sarah Jenkins",
    },
    {
        id: 2,
        quote: "The favorites feature helped me narrow down my choices with my partner. I like cats with big ears.",
        author: "Mike T.",
    },
    {
        id: 3,
        quote: "Clean, fast, and simply purrfect. Love the design! Have been chasing a cat for a long time",
        author: "Jerry M.",
    },
    {
        id: 4,
        quote: "I never knew there were so many types of T-Rex cats! Found my dream pet.",
        author: "Sarah Jenkins",
    },
    {
        id: 5,
        quote: "The favorites feature helped me narrow down my choices with my partner. I like cats with big ears.",
        author: "Mike T.",
    },
    {
        id: 6,
        quote: "Clean, fast, and simply purrfect. Love the design! Have been chasing a cat for a long time",
        author: "Jerry M.",
    },
    {
        id: 7,
        quote: "I never knew there were so many types of T-Rex cats! Found my dream pet.",
        author: "Sarah Jenkins",
    },
    {
        id: 8,
        quote: "The favorites feature helped me narrow down my choices with my partner. I like cats with big ears.",
        author: "Mike T.",
    },
    {
        id: 9,
        quote: "Clean, fast, and simply purrfect. Love the design! Have been chasing a cat for a long time",
        author: "Jerry M.",
    },
];

export default function TestimonialCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1025) setVisibleCards(3);
            else if (window.innerWidth >= 768) setVisibleCards(2);
            else setVisibleCards(1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, testimonials.length - visibleCards);

    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxIndex));
    }, [maxIndex]);

    const [paused, setPaused] = useState(false);
    const directionRef = useRef(1);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }, [maxIndex]);

    // Auto-rotate with direction reversal at edges
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev >= maxIndex) directionRef.current = -1;
                if (prev <= 0) directionRef.current = 1;
                return prev + directionRef.current;
            });
        }, 4000);
        return () => clearInterval(id);
    }, [paused, maxIndex]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
        }
    };

    const trackStyle: TrackStyle = { '--current-index': currentIndex };

    return (
        <section className="section testimonial-section" aria-labelledby="testimonial-heading">
            <div className="container">
                <h2 id="testimonial-heading" className="text-center font-bold testimonial-title">
                    What people say
                </h2>

                <div
                    className="carousel-container"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                    role="region"
                    aria-label="Testimonials carousel — use left and right arrow keys to navigate"
                    aria-roledescription="carousel"
                >
                    <div className="carousel-track" style={trackStyle} aria-live="polite">
                        {testimonials.map((t, i) => (
                            <article
                                key={t.id}
                                className="card testimonial-card"
                                aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
                            >
                                <blockquote className="testimonial-quote">
                                    <p>&ldquo;{t.quote}&rdquo;</p>
                                </blockquote>
                                <p className="font-bold testimonial-author">
                                    &mdash;&nbsp;{t.author}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="carousel-controls" role="group" aria-label="Carousel navigation">
                    <button
                        onClick={handlePrev}
                        aria-label="Previous testimonial"
                        className="carousel-btn carousel-btn--active"
                    >
                        <span aria-hidden="true">&lt;</span>
                    </button>
                    <button
                        onClick={handleNext}
                        aria-label="Next testimonial"
                        className="carousel-btn carousel-btn--active"
                    >
                        <span aria-hidden="true">&gt;</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
