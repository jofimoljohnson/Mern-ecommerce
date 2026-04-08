import { ProductDetailsDialog, ShoppingProductTile } from "@/components";
import { Input } from "@/components/ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { fetchProductDetails } from "@/store/shop/productSlice";
import { resetSearchResults, searchProducts } from "@/store/shop/searchSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const SearchProducts = () => {
    const [keyword, setKeyword] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useSelector((state) => state.auth);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
        const {productDetails } = useSelector((state) => state.shopProducts);


    const { searchResults } = useSelector((state) => state.shopSearch);
    const dispatch = useDispatch();

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

  const handleGetProductDetails = (getCurrentProductId) => {
        dispatch(fetchProductDetails(getCurrentProductId));
    };





    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(searchProducts(keyword));
            } else {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));

                dispatch(resetSearchResults());
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [keyword, dispatch, setSearchParams]);

    useEffect(() => {
        const keywordParam = searchParams.get("keyword");

        if (keywordParam) {
            setKeyword(keywordParam);
            dispatch(searchProducts(keywordParam));
        }
    }, []);

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);


    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            {/* 🔍 Search Input */}
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input
                        placeholder="Search Products..."
                        className="py-6"
                        value={keyword}
                        name="keyword"
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            {/* 🛍 Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.isArray(searchResults) && searchResults.length > 0 ? (
                    searchResults.map((item) => (
                        <ShoppingProductTile key={item._id} product={item} 
                        handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails} />
                    ))
                ) : (
                    <h1 className="text-3xl font-bold text-center col-span-full">No result found!</h1>
                )}
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    );
};

export default SearchProducts;
