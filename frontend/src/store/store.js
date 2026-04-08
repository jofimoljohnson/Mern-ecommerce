import { configureStore } from "@reduxjs/toolkit";
import authReucer from "./authSlice";
import adminProductSlice from "./admin/productsSlice";
import shopProductSlice from "./shop/productSlice";
import shopCartSlice from "./shop/cartSlice";
import shopAddressSlice from "./shop/addressSlice";
import shopOrderSlice from "./shop/orderSlice";
import adminOrderSlice from "./admin/orderSlice";
import shopSearchSlice from './shop/searchSlice'
import shopReviewSlice from './shop/reviewSlice'
import featureSlice from './common/index'

const store = configureStore({
    reducer: {
        auth: authReucer,
        adminProducts: adminProductSlice,
        adminOrder: adminOrderSlice,

        shopProducts: shopProductSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch:shopSearchSlice,
        shopReview:shopReviewSlice,
        feature:featureSlice
    },
});

export default store;
