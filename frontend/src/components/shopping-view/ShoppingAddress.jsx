import { useEffect, useState } from "react";
import CommonForm from "../common/CommonForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/shop/addressSlice";
import { ShoppingAddressCard } from "..";
import { toast } from "sonner";

const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
};

const ShoppingAddress = ({setCurrentSelectedAddress,selectedId}) => {
    const [formData, setFormData] = useState(initialAddressFormData);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { addressList } = useSelector((state) => state.shopAddress);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const handleManageAddress = (event) => {
        event.preventDefault();
        if (addressList.length >= 3 && currentEditedId === null) {
            setFormData(initialAddressFormData);
            toast.error("You can add max 3 addresses");
            return;
        }
        currentEditedId !== null
            ? dispatch(
                  editAddress({
                      userId: user?.id || user?._id,
                      addressId: currentEditedId,
                      formData,
                  }),
              ).then((data) => {
                  if (data?.payload?.success) {
                      dispatch(fetchAllAddress({ userId: user?.id || user?._id }));
                      setCurrentEditedId(null);
                      setFormData(initialAddressFormData);
                      toast.success("Address updated successfully");
                  }
              })
            : dispatch(
                  addNewAddress({
                      ...formData,
                      userId: user?._id || user?.id,
                  }),
              ).then((data) => {
                  if (data?.payload?.success) {
                      dispatch(fetchAllAddress({ userId: user?.id || user?._id }));

                      setFormData(initialAddressFormData);
                      toast.success("Address added successfully");
                  }
              });
    };

    const isFormValid = () => {
        return Object.keys(formData)
            .map((key) => formData[key].trim() !== "")
            .every((item) => item);
    };

    const handleDeleteAddress = (getCurrentAddress) => {
        dispatch(deleteAddress({ userId: user?._id || user?.id, addressId: getCurrentAddress._id })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddress({ userId: user?.id || user?._id }));
                toast.success("Address deleted successfully");
            }
        });
    };

    const handleEditAddress = (getCurrentAddress) => {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes,
        });
    };

    useEffect(() => {
        const userId = user?._id || user?.id;

        if (userId) {
            dispatch(fetchAllAddress({ userId }));
        }
    }, [dispatch, user]);

    return (
        <>
            <Card>
                <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
                    {addressList && addressList.length > 0
                        ? addressList.map((singleAddressItem) => (
                              <ShoppingAddressCard
                              selectedId={selectedId}
                                  key={singleAddressItem._id}
                                  handleDeleteAddress={handleDeleteAddress}
                                  addressInfo={singleAddressItem}
                                  handleEditAddress={handleEditAddress}
                                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                              />
                          ))
                        : null}
                </div>
                <CardHeader>
                    <CardTitle>{currentEditedId !== null ? "Edit Address" : "Add New Address"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <CommonForm
                        formControls={addressFormControls}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={currentEditedId !== null ? "Edit" : "Add"}
                        onSubmit={handleManageAddress}
                        isBtnDisabled={!isFormValid()}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default ShoppingAddress;
