import { CartItemsContent, ShoppingAddress } from "@/components";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState,useEffect } from "react";
import { createNewOrder } from "@/store/shop/orderSlice";
import { toast } from "sonner";

const ShoppingCheckout = () => {
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const { approvalURL } = useSelector((state) => state.shopOrder);

    const dispatch = useDispatch();

    const totalCartAmount =
        cartItems?.items && cartItems.items.length > 0
            ? cartItems.items.reduce(
                  (sum, currentItem) =>
                      sum +
                      (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity,
                  0,
              )
            : 0;

    if (!cartItems) {
        return <p className="text-center">Loading...</p>;
    }

    const handleInitiatePaypalPayment = () => {
        if (!cartItems?.items || cartItems.items.length === 0) {
            toast("Your cart is empty. Please add items to proceed");
            return;
        }

        if (currentSelectedAddress === null) {
            toast("Please select one address to proceed");
            return;
        }
        const orderData = {
            userId: user?.id || user?._id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map((singleCartItem) => ({
                productId: singleCartItem?.productId,
                title: singleCartItem?.title,
                image: singleCartItem?.image,
                price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
                quantity: singleCartItem?.quantity,
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "pending",
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: "",
            payerId: "",
        };
        dispatch(createNewOrder(orderData)).then((data) => {
            if (data?.payload?.success) {
                setIsPaymentStart(true);
            } else {
                setIsPaymentStart(false);
            }
        });
    };

  useEffect(() => {
    if (approvalURL) {
        window.location.href = approvalURL;
    }
}, [approvalURL]);

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} alt="" className="h-full w-full object-cover object-center" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <ShoppingAddress selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
                <div className="flex flex-col gap-4">
                    {cartItems && cartItems.items && cartItems.items.length > 0
                        ? cartItems.items.map((item) => <CartItemsContent cartItem={item} />)
                        : null}
                    <div className="mt-8 space-y-4">
                        {cartItems.items && cartItems.items.length > 0 && (
                            <div className="pt-4 border-t flex justify-between items-center">
                                <h2 className="text-lg font-bold">Total</h2>
                                <p className="text-lg font-semibold">${totalCartAmount.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 w-full">
                        <Button onClick={handleInitiatePaypalPayment} className="w-full">
                            {
                                isPaymentStart?'Processing Paypal Payment...':'Checkout with paypal'
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCheckout;
