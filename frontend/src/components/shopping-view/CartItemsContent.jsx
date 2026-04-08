// import { Minus, Plus, Trash } from "lucide-react";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteCartItems, updateCart } from "@/store/shop/cartSlice";
// import { toast } from "sonner";

// const CartItemsContent = ({ cartItem }) => {
//     const { user } = useSelector((state) => state.auth);

//     const dispatch = useDispatch();

//     const handleCartItemDelete = (getCartItem) => {
//         dispatch(deleteCartItems({ userId: user?._id || user?.id, productId: getCartItem?.productId })).then((data) => {
//             if (data?.payload?.success) {
//                 toast.success("Cart item is deleted sucessfully");
//             }
//         });
//     };

//     const handleUpdateQuantity = (getCartItem, typeOfAction) => {
//         dispatch(
//             updateCart({
//                 userId: user?._id || user?.id,
//                 productId: getCartItem?.productId,
//                 quantity: typeOfAction === "plus" ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1,
//             }),
//         ).then((data) => {
//             if (data?.payload?.success) {
//                 toast.success("Cart item is updated sucessfully");
//             }
//         });
//     };

//     return (
//         <div className="flex items-center space-x-4">
//             <img src={cartItem?.image} alt={cartItem?.title} className="w-20 h-20 rounded object-cover" />
//             <div className="flex-1">
//                 <h3 className="font-extrabold">{cartItem?.title}</h3>
//                 <div className="flex items-center mt-1 gap-2">
//                     <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8 rounded-full"
//                         disabled={cartItem?.quantity === 1}
//                         onClick={() => handleUpdateQuantity(cartItem, "minus")}
//                     >
//                         <Minus className="w-4 h-4" />
//                         <span className="sr-only">Decrease</span>
//                     </Button>
//                     <span className="font-semibold">{cartItem?.quantity}</span>
//                     <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-8 w-8 rounded-full"
//                         onClick={() => handleUpdateQuantity(cartItem, "plus")}
//                     >
//                         <Plus className="w-4 h-4" />
//                         <span className="sr-only">Increase</span>
//                     </Button>
//                 </div>
//             </div>

//             <div className="flex flex-col items-end">
//                 <p className="font-semibold">
//                     ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
//                 </p>
//                 <Trash onClick={() => handleCartItemDelete(cartItem)} className="cursor-pointer mt-1" size={20} />
//             </div>
//         </div>
//     );
// };

// export default CartItemsContent;

import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItems, updateCart } from "@/store/shop/cartSlice";
import { toast } from "sonner";

const CartItemsContent = ({ cartItem }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const userId = user?._id || user?.id;

    const handleCartItemDelete = async (item) => {
        try {
            await dispatch(
                deleteCartItems({
                    userId,
                    productId: item?.productId,
                }),
            ).unwrap();

            toast.success("Cart item deleted successfully");
        } catch (err) {
            toast.error(err?.message);
        }
    };

    const handleUpdateQuantity = async (item, type) => {
        const newQty = type === "plus" ? item.quantity + 1 : item.quantity - 1;

        if (newQty < 1) return;

        // 🔥 CRITICAL CHECK
        if (!item.totalStock) {
            toast.error("Only 6 items available");
            return;
        }

        if (newQty > item.totalStock) {
            toast.error(`Only ${item.totalStock} items available`);
            return; // ❌ STOP API CALL
        }

        try {
            await dispatch(
                updateCart({
                    userId,
                    productId: item.productId,
                    quantity: newQty,
                }),
            ).unwrap();

            toast.success("Cart updated");
        } catch (err) {
            toast.error(err?.message);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <img src={cartItem?.image} className="w-20 h-20 rounded object-cover" />

            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem?.title}</h3>

                <div className="flex items-center gap-2 mt-1">
                    <Button
                        size="icon"
                        variant="outline"
                        disabled={cartItem.quantity === 1}
                        onClick={() => handleUpdateQuantity(cartItem, "minus")}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>

                    <span>{cartItem.quantity}</span>

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                            if (cartItem.quantity >= cartItem.totalStock) {
                                toast.error(`Only ${cartItem.totalStock} items available`);
                                return;
                            }

                            handleUpdateQuantity(cartItem, "plus");
                        }}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <p className="font-semibold">
                    ${((cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price) * cartItem.quantity).toFixed(2)}
                </p>

                <Trash size={20} className="cursor-pointer mt-1" onClick={() => handleCartItemDelete(cartItem)} />
            </div>
        </div>
    );
};

export default CartItemsContent;
