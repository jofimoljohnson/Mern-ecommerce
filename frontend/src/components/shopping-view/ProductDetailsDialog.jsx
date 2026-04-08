import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cartSlice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/productSlice";
import { Label } from "../ui/label";
import { StarRating } from "..";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/reviewSlice";

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const { reviews } = useSelector((state) => state.shopReview);

    const handleAddToCart = async (getCurrentProductId) => {
        const userId = user?._id || user?.id;

        if (!userId) {
            toast.error("Please Login First");
            return;
        }

        try {
            const res = await dispatch(
                addToCart({
                    userId,
                    productId: getCurrentProductId,
                    quantity: 1,
                }),
            ).unwrap();

            // success
            dispatch(fetchCartItems({ userId }));
            toast.success("Product is added to cart");
        } catch (err) {
            toast.error(err?.message || "Failed to add to cart");
        }
    };

    const handleDialogClose = () => {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg("");
    };

    const handleRatingChange = (getRating) => {
        setRating(getRating);
    };

    const handleAddReview = () => {
        dispatch(
            addReview({
                productId: productDetails?._id,
                userId: user?._id || user?.id,
                username: user?.username,
                reviewMessage: reviewMsg,
                reviewValue: rating,
            }),
        ).then((data) => {
            console.log(data);
            if (data?.payload?.success) {
                setRating(0)
                setReviewMsg('')
                dispatch(getReviews(productDetails?._id));
                toast.success("Review added successfully");
            }
        });
    };

    useEffect(() => {
        if (productDetails !== null) dispatch(getReviews(productDetails?._id));
    }, [productDetails]);

    console.log("reviews", reviews);

const averageReview = reviews && reviews.length>0?
reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length:0;



    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-[500px] md:max-w-[700px]">
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        className="aspect-square w-full max-h-[300px] object-cover"
                    />
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-xl font-bold">{productDetails?.title}</h1>

                    <p className="text-sm text-muted-foreground mt-2 mb-4">{productDetails?.description}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <p
                            className={`text-xl font-bold text-primary ${
                                productDetails?.salePrice > 0 ? "line-through" : ""
                            }`}
                        >
                            ${productDetails?.price}
                        </p>

                        {productDetails?.salePrice > 0 && (
                            <p className="text-lg font-semibold text-muted-foreground">${productDetails?.salePrice}</p>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="w-4 h-4 fill-primary" rating={averageReview} />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">(averageReview.toFixed(2))</span>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-4 mb-4">
                        {productDetails?.totalStock === 0 ? (
                            <Button
                                disabled // 🔥 FIX
                                className="w-full opacity-60 cursor-not-allowed"
                            >
                                Out of stock
                            </Button>
                        ) : (
                            <Button className="w-full" onClick={() => handleAddToCart(productDetails?._id)}>
                                Add to cart
                            </Button>
                        )}
                    </div>

                    <Separator />

                    {/* Reviews */}
                    <div className="max-h-[250px] overflow-y-auto mt-4 pr-2">
                        <h2 className="text-lg font-bold mb-3">Reviews</h2>
                        {reviews && reviews.length > 0 ? (
                            reviews.map((reviewItem) => (
                                <div className="flex gap-3 mb-3">
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback>{reviewItem?.username[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-sm">{reviewItem?.username}</h3>
                                        <p className="text-xs text-muted-foreground">{reviewItem?.reviewMessage}</p>
                                        <StarRating rating={reviewItem?.reviewValue}/>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h1>No Reviews</h1>
                        )}

                        {/* Add Review */}
                        <div className="mt-10 flex flex-col gap-2">
                            <Label>Write a review...</Label>
                            <div className="flex gap-2">
                                <StarRating rating={rating} handleRatingChange={handleRatingChange} />
                            </div>
                            <Input
                                name="reviewMsg"
                                value={reviewMsg}
                                onChange={(e) => setReviewMsg(e.target.value)}
                                placeholder="Write a review..."
                            />
                            <Button size="sm" disabled={reviewMsg.trim() === ""} onClick={handleAddReview}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsDialog;
