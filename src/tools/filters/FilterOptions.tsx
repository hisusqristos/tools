import { FilterType } from "./adjustFilters"
import { ReactNode } from "react";

const filterCatalogue = ( filter: FilterType, selectedFilter: FilterType, handleFilterSelect: any): ReactNode => {
    return (
        <button
            key={filter}
            onClick={() => handleFilterSelect(filter)}
            className={`flex flex-col items-center p-2 rounded-md border ${selectedFilter === filter
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
                }`}
        >
            <div className="w-full aspect-square bg-gray-100 rounded-md mb-2">
                <div
                    className={`w-full h-full rounded-md ${filter === "none"
                        ? "bg-white"
                        : filter === "sepia"
                            ? "bg-amber-100"
                            : filter === "vintage"
                                ? "bg-orange-50"
                                : filter === "noir"
                                    ? "bg-gray-800"
                                    : filter === "cool"
                                        ? "bg-blue-100"
                                        : filter === "warm"
                                            ? "bg-orange-100"
                                            : filter === "faded"
                                                ? "bg-gray-100"
                                                : filter === "dramatic"
                                                    ? "bg-indigo-200"
                                                    : "bg-yellow-50" // polaroid
                        }`}
                ></div>
            </div>
            <span className="text-xs font-medium text-gray-700">{filter}</span>
        </button>
    );
};

export { filterCatalogue }