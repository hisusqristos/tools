import { FilterType } from "../adjustFilters"
import { memo } from "react";
import { previewFilter } from "./previewFilter";

type CatalogueProps = { filter: FilterType, selectedFilter: FilterType, handleFilterSelect: any, image: HTMLImageElement };

const FilterCatalogue = ({ filter, selectedFilter, handleFilterSelect, image }: CatalogueProps) => {
    return (
        <button
            key={filter}
            onClick={() => handleFilterSelect(filter)}
            className={`flex flex-col items-center p-2 rounded-md border ${selectedFilter === filter
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
                }`}
        >
            <div className="w-full h-full aspect-square bg-gray-100 rounded-md mb-2 object-center overflow-hidden">
                <img src={previewFilter(filter, image)} alt="filter preview" className="h-full w-full object-cover" />
            </div>
            <span className="text-xs font-medium text-gray-700">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
        </button>
    );
};

export default memo(FilterCatalogue)