import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

const ShoppingAddressCard = ({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress,selectedId }) => {
    console.log("JOFIIII",selectedId)

    return (
        <div>
            <Card
                onClick={() => setCurrentSelectedAddress(addressInfo)}
                className={`cursor-pointer border-red-700 ${selectedId?._id===addressInfo?._id?'border-red-900 border-[4px]':'border-black'}`}
            >
                <CardContent className="grid p-4 gap-4">
                    <Label>Address:{addressInfo?.address}</Label>
                    <Label>City:{addressInfo?.city}</Label>
                    <Label>Pincode:{addressInfo?.pincode}</Label>
                    <Label>Phone:{addressInfo?.phone}</Label>
                    <Label>Notes:{addressInfo?.notes}</Label>
                </CardContent>
                <CardFooter className="flex justify-between p-3 pt-1 pb-1">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(addressInfo);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addressInfo);
                        }}
                    >
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ShoppingAddressCard;
