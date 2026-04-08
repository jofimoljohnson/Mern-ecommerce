import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OrderDetails } from "..";
import { Badge } from "../ui/badge";
import { getAllOrdersByAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/orderSlice";

const AdminManageOrders = () => {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
    const dispatch = useDispatch();

    const handleFetchOrderDetails = (getId) => {
        dispatch(getOrderDetailsForAdmin(getId));
    };

    console.log("order details", orderDetails);

    useEffect(() => {
        dispatch(getAllOrdersByAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-semibold">All Orders</CardTitle>
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
                                                  <OrderDetails orderDetails={orderDetails} />
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

export default AdminManageOrders;
