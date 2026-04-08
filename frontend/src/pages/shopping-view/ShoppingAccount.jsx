import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accimg from "../../assets/account.jpg";
import { ShoppingAddress, ShoppingOrders } from "@/components";

const ShoppingAccount = () => {
    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={accimg} alt="" className="h-full w-full object-cover object-center" />
            </div>
            <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
                <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                    <Tabs defaultValue="orders" className="w-full flex flex-col">
                        <TabsList className="flex w-fit p-0 m-0 gap-0 border-b">
                            <TabsTrigger value="orders">Orders</TabsTrigger>

                            <TabsTrigger value="address">Address</TabsTrigger>
                        </TabsList>

                        <TabsContent value="orders" className="mt-0">
                            <ShoppingOrders/>
                        </TabsContent>

                        <TabsContent value="address" className="mt-0">
                        <ShoppingAddress/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ShoppingAccount;
