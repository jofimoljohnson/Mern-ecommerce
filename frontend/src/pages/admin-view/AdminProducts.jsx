import { AdminProductTile, ProductImageUpload } from "@/components";
import CommonForm from "@/components/common/CommonForm";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/productsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
};

const AdminProducts = () => {
    const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadImageUrl, setUploadImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const { productList } = useSelector((state) => state.adminProducts);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const dispatch = useDispatch();

    const onSubmit = (event) => {
        event.preventDefault();
        currentEditedId !== null
            ? dispatch(
                  editProduct({
                      id: currentEditedId,
                      formData,
                  }),
              ).then((data) => {
                  if (data?.payload.success) {
                      dispatch(fetchAllProducts());
                      setFormData(initialFormData);
                      setOpenCreateProductDialog(false);
                      setCurrentEditedId(null);
                  }
              })
            : dispatch(
                  addNewProduct({
                      ...formData,
                      image: uploadImageUrl,
                  }),
              ).then((data) => {
                  console.log(data);
                  if (data?.payload?.success) {
                      dispatch(fetchAllProducts());
                      setOpenCreateProductDialog(false);
                      setImageFile(null);
                      setFormData(initialFormData);
                      toast.success("Product added successfully");
                  }
              });
    };



    const isFormValid=()=>{
        return Object.keys(formData).map(key=>formData[key]!=='').every(item=>item)
    }



    const handleDelete=(getCurrentProductId)=>{
console.log(getCurrentProductId)
dispatch(deleteProduct(getCurrentProductId))
.then(data=>{
    if(data?.payload?.success){
        dispatch(fetchAllProducts())
    }
})
    }




    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

  ;

    return (
        <div className="w-full">
            <div className="flex justify-end mb-2">
                <Button onClick={() => setOpenCreateProductDialog(true)}>Add New Product</Button>
            </div>

            <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                {productList && productList.length > 0
                    ? productList.map((productItem) => (
                          <AdminProductTile
                              setCurrentEditedId={setCurrentEditedId}
                              setOpenCreateProductDialog={setOpenCreateProductDialog}
                              setFormData={setFormData}
                              key={productItem._id}
                              product={productItem}
                              handleDelete={handleDelete}
                          />
                      ))
                    : null}
            </div>

            <Sheet
                open={openCreateProductDialog}
                onOpenChange={() => {
                    setOpenCreateProductDialog(false);
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                }}
            >
                <SheetContent side="right" className=" overflow-auto">
                    <SheetHeader>
                        <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadImageUrl={uploadImageUrl}
                        setUploadImageUrl={setUploadImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />

                    <div className="py-2 px-2">
                        <CommonForm
                            formControls={addProductFormElements}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? "Edit" : "Add"}
                            onSubmit={onSubmit}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default AdminProducts;
