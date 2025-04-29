import { FilterType } from "../adjustFilters"
import { ReactNode } from "react";
import { previewFilter } from "./previewFilter";

const FilterCatalogue = (filter: FilterType, selectedFilter: FilterType, handleFilterSelect: any, image: HTMLImageElement): ReactNode => {
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
                <div className={"h-full w-full rounded-md object-center overflow-hidden"} >
                    <img src={previewFilter(filter, image)} alt="filter preview" className="h-full w-full object-cover" />
                </div>
            </div>
            <span className="text-xs font-medium text-gray-700">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
        </button>
    );
};

export default FilterCatalogue