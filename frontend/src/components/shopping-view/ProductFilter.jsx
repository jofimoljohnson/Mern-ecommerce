



import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const ProductFilter = ({ filters, handleFilter }) => {
    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>

            <div className="p-4 space-y-4">
                {Object.keys(filterOptions).map((keyItem) => (
                    <div key={keyItem}>
                        <h3 className="font-bold">{keyItem}</h3>

                        <div className="grid gap-2 mt-2">
                            {filterOptions[keyItem].map((option) => (
                                <Label key={option.id} className="flex items-center gap-2">

                                    <Checkbox
                                        checked={
                                            filters[keyItem]?.includes(option.id) || false
                                        }
                                        onCheckedChange={() =>
                                            handleFilter(keyItem, option.id)
                                        }
                                    />

                                    {option.label}
                                </Label>
                            ))}
                        </div>

                        <Separator className="mt-3" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductFilter;