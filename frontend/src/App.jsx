import { Route, Routes } from "react-router-dom";
import { AdminLayout, AuthLayout, CheckAuth, ShoppingLayout } from "./components";
import {
    AdminDashboard,
    AdminFeatures,
    AdminOrders,
    AdminProducts,
    Login,
    NotFound,
    PaymentSuccess,
    PaypalReturn,
    Register,
    SearchProducts,
    ShoppingAccount,
    ShoppingCheckout,
    ShoppingHome,
    ShoppingListing,
    UnauthPage,
} from "./pages";
import { Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/authSlice";
import { Skeleton } from "./components/ui/skeleton";

const App = () => {
    const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (isLoading)
        return (
            <div>
                {" "}
                <Skeleton className="w-[800px] bg-black h-[600px] rounded-full" />
            </div>
        );

    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <Toaster position="top-right" richColors />

            <Routes>
                <Route path="/"
                 element={
                        <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
                        </CheckAuth>
                    }
                />
                <Route
                    path="/auth"
                    element={
                        <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
                            <AuthLayout />
                        </CheckAuth>
                    }
                >
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                <Route
                    path="/admin"
                    element={
                        <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
                            <AdminLayout />
                        </CheckAuth>
                    }
                >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="features" element={<AdminFeatures />} />
                </Route>

                <Route
                    path="/shop"
                    element={
                        <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={isLoading}>
                            <ShoppingLayout />
                        </CheckAuth>
                    }
                >
                    <Route path="home" element={<ShoppingHome />} />
                    <Route path="listing" element={<ShoppingListing />} />
                    <Route path="checkout" element={<ShoppingCheckout />} />
                    <Route path="account" element={<ShoppingAccount />} />
                    <Route path="paypal-return" element={<PaypalReturn />} />
                    <Route path="payment-success" element={<PaymentSuccess />} />
                    <Route path="search" element={<SearchProducts/>}/>
                </Route>
                <Route path="*" element={<NotFound />} />
                <Route path="/unauth-page" element={<UnauthPage />} />
            </Routes>
        </div>
    );
};

export default App;
