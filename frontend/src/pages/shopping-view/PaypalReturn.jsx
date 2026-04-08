import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCartItems } from "@/store/shop/cartSlice";
import { capturePayment } from "@/store/shop/orderSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const PaypalReturn = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
            console.log("orderId:", orderId);
            dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
                if (data?.payload?.success) {
                    sessionStorage.removeItem("currentOrderId");
                    dispatch(
                        fetchCartItems({
                            userId: user?._id || user?.id,
                        }),
                    );

                    window.location.href = "/shop/payment-success";
                }
            });
        }
    }, [paymentId, payerId, dispatch]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Processing Payment....Please wait!</CardTitle>
                </CardHeader>
            </Card>
        </>
    );
};

export default PaypalReturn;
