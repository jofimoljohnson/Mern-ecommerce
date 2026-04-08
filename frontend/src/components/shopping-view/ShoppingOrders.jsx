import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShoppingOrderDetails from "./ShoppingOrderDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/orderSlice";
import { Badge } from "../ui/badge";

const ShoppingOrders = () => {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

    const handleFetchOrderDetails = (getId) => {
        dispatch(getOrderDetails(getId));
    };

    console.log("ORDER DETAILS", orderDetails);

    useEffect(() => {
        if (user?.id || user?._id) {
            dispatch(getAllOrdersByUserId(user?.id || user?._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (orderDetails !== null) {
            setOpenDetailsDialog(true);
        }
    }, [orderDetails]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-semibold">Order History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Order Date</TableHead>
                                <TableHead>Order Staus</TableHead>
                                <TableHead>Order Price</TableHead>
                                <TableHead>
                                    <span className="sr-only">Details</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderList && orderList.length > 0
                                ? orderList.map((orderItem) => (
                                      <TableRow>
                                          <TableCell>{orderItem?._id}</TableCell>
                                          <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                                          <TableCell>
                                              <Badge
                                                  className={`py-1 px-3 ${
                                                      orderItem?.orderStatus === "confirmed"
                                                          ? "bg-green-500"
                                                          : orderItem?.orderStatus === "rejected"
                                                            ? "bg-red-600"
                                                            : "bg-black"
                                                  }`}
                                              >
                                                  {orderItem?.orderStatus}
                                              </Badge>
                                          </TableCell>
                                          <TableCell>${orderItem?.totalAmount}</TableCell>
                                          <TableCell>
                                              <Dialog
                                                  open={openDetailsDialog}
                                                  onOpenChange={() => {
                                                      setOpenDetailsDialog(false);
                                                      dispatch(resetOrderDetails());
                                                  }}
                                              >
                                                  <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                                                      View Details
                                                  </Button>
                                                  <ShoppingOrderDetails orderDetails={orderDetails} />
                                              </Dialog>
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : null}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};

export default ShoppingOrders;
