import { useNavigate } from "react-router-dom";
import { CartItemsContent } from "..";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const CartWrapper = ({ cartItems, setOpenCartSheet }) => {
    const navigate = useNavigate();
    const totalAmount =
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

    return (
        <SheetContent className="sm:max-w-md flex flex-col h-full">
            {/* Header */}
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>

            {/* Scrollable Cart Items */}
            <div className="mt-6 space-y-4 overflow-y-auto flex-1 pr-2">
                {cartItems.items && cartItems.items.length > 0 ? (
                    cartItems.items.map((item) => <CartItemsContent key={item.productId} cartItem={item} />)
                ) : (
                    <p className="text-center text-gray-500">Cart is empty</p>
                )}
            </div>

            {/* ✅ TOTAL SECTION */}
            {cartItems.items && cartItems.items.length > 0 && (
                <div className="pt-4 border-t flex justify-between items-center">
                    <h2 className="text-lg font-bold">Total</h2>
                    <p className="text-lg font-semibold">${totalAmount.toFixed(2)}</p>
                </div>
            )}

            {/* Checkout Button */}
            <div className="pt-4">
                <Button
                    onClick={() => {
                        navigate("/shop/checkout");
                        setOpenCartSheet(false);
                    }}
                    className="w-full"
                >
                    Checkout
                </Button>
            </div>
        </SheetContent>
    );
};

export default CartWrapper;
