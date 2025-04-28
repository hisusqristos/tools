import { useState } from "react";

type CarouselProps = { children: React.ReactNode[]; visibleCount: number, label?: string; };

const Carousel = ({ children, visibleCount, label }: CarouselProps) => {
    const [startIndex, setStartIndex] = useState(0);

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setStartIndex((prev) =>
            Math.min(prev + 1, children.length - visibleCount)
        );
    };

    const visibleChildren = children.slice(startIndex, startIndex + visibleCount);

    return (
        <div className="flex justify-center items-center gap-2">
            <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="p-3 rounded-md border mt-7 bg-white shadow-md disabled:opacity-50 disabled:bg-gray-50 hover:bg-gray-100"
            >
                <img className="size-4 text-white" src="assets/chevron-left.svg" alt="left" />
            </button>
            <div className="flex flex-col flex-1">
                {label && (
                    <label className="text-sm font-medium text-gray-700 mb-3">
                        {label}
                    </label>
                )}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
                        gap: "0.75rem",
                        flex: "1"
                    }}
                >
                    {visibleChildren}
                </div>
            </div>
            <button
                onClick={handleNext}
                disabled={startIndex >= children.length - visibleCount}
                className="p-3 rounded-md border mt-7 bg-white shadow-md disabled:opacity-50 disabled:bg-gray-50 hover:bg-gray-100"
            >
                <img className="size-4 text-white" src="assets/chevron-right.svg" alt="right" />
            </button>
        </div>
    );
};

export default Carousel 