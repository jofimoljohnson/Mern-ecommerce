import { ProductDetailsDialog, ProductFilter, ShoppingProductTile } from "@/components";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/productSlice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const createSearchParamsHelper = (filterParams) => {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
        }
    }

    return queryParams.join("&");
};

const ShoppingListing = () => {
    const dispatch = useDispatch();
    const { productList, productDetails } = useSelector((state) => state.shopProducts);

    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState("price-lowtohigh");
    const [searchParams, setSearchParams] = useSearchParams();

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const categorySearchParams = searchParams.get("category");
    const { cartItems } = useSelector((state) => state.shopCart);

    const handleSort = (value) => {
        setSort(value);
    };

    const handleFilter = (section, option) => {
        let updated = { ...filters };

        if (!updated[section]) {
            updated[section] = [option];
        } else {
            if (updated[section].includes(option)) {
                updated[section] = updated[section].filter((item) => item !== option);
            } else {
                updated[section].push(option);
            }
        }

        setFilters(updated);
        sessionStorage.setItem("filters", JSON.stringify(updated));
    };

    const handleGetProductDetails = (getCurrentProductId) => {
        dispatch(fetchProductDetails(getCurrentProductId));
    };

    







const handleAddToCart = (getCurrentProductId) => {
    const userId = user?._id || user?.id;

    if (!userId) {
        toast.error("Please Login First");
        return;
    }

  dispatch(addToCart({ userId, productId: getCurrentProductId, quantity: 1 }))
    .unwrap()
    .then(() => {
        dispatch(fetchCartItems({ userId }));
        toast.success("Product is added to cart");
    })
    .catch((error) => {
        console.log("CATCH ERROR:", error);
        toast.error(error?.message || "Only limited stock available");
    });
};








    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            const query = createSearchParamsHelper(filters);
            setSearchParams(query);
        }
    }, [filters]);

    // API call
    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }, [filters, sort, dispatch]);

    // initial load
    useEffect(() => {
        const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
        setFilters(savedFilters);
    }, [categorySearchParams]);

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    useEffect(() => {
        const userId = user?._id || user?.id;

        if (userId) {
            dispatch(fetchCartItems({ userId }));
        }
    }, [dispatch, user]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter filters={filters} handleFilter={handleFilter} />

            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Products</h2>

                    <div className="flex items-center gap-3">
                        <span>{productList?.length} Products</span>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    Sort by
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {sortOptions.map((item) => (
                                        <DropdownMenuRadioItem key={item.id} value={item.id}>
                                            {item.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
             
                    {productList.map((item) => {
                        const getCartItems = cartItems?.items || [];

                        const currentQty =
                            getCartItems.find((cartItem) => cartItem.productId.toString() === item._id.toString())
                                ?.quantity || 0;

                        return (
                            <ShoppingProductTile
                                handleGetProductDetails={handleGetProductDetails}
                                key={item._id}
                                product={item}
                                handleAddToCart={handleAddToCart}
                                currentQty={currentQty} 
                            />
                        );
                    })}
                </div>
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    );
};

export default ShoppingListing;



