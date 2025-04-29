import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"
import categorySlice from "./categorySlice.js"
import subCategorySlice from "./subCategorySlice.js"
import productSlice from "./productSlice.js"
import cartSlice from "./cartSlice.js"
import addressSlice from "./addressSlice.js"
import orderSlice from "./orderSlice.js"

export const store = configureStore({
    reducer:{
        auth: userSlice,
        category: categorySlice,
        subCategory: subCategorySlice,
        product: productSlice,
        cart: cartSlice,
        address: addressSlice,
        order: orderSlice,
    }
})