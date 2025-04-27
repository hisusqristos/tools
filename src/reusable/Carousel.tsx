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
        <div className="flex items-center gap-2">
            <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="p-3 rounded-md border bg-white shadow-md disabled:opacity-50 disabled:bg-gray-50 hover:bg-gray-100"
            >
                <img className="size-4 text-white" src="assets/chevron-left.svg" alt="left" />
            </button>
            <div className="flex flex-col flex-1">
                {label && (
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className={`grid grid-cols-${visibleCount} gap-3 flex-1`}>
                    {visibleChildren}
                </div>
            </div>
            <button
                onClick={handleNext}
                disabled={startIndex >= children.length - visibleCount}
                className="p-3 rounded-md border bg-white shadow-md disabled:opacity-50 disabled:bg-gray-50 hover:bg-gray-100"
            >
                <img className="size-4 text-white" src="assets/chevron-right.svg" alt="right" />
            </button>
        </div>
    );
};

export default Carousel 