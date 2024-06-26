import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useTestPayOrderMutation,
} from "../slices/ordersApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";

const stripePromise = loadStripe(
  "pk_test_51P4y50HPVRJk3r2Z56KHWCHxE7Lemxti5iCVU45JnJRPtINoB5LT4hdHrSSavuijoviMigfdpCztxyynxnAqhSua00xJq1Naxp"
);

function OrderScreen() {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((user) => user.auth);

  const {
    data: order,
    error,
    isLoading,
    refetch,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [testPayOrder, { isLoading: loadingTestPayment }] =
    useTestPayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  async function handlePayment() {
    try {
      const session = await axios(
        `/api/orders/create-checkout-session/${orderId}`
      );

      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });

      if (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deliverOrderHandler() {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  useEffect(() => {
    const payOrderAndUpdate = async () => {
      const queryParams = new URLSearchParams(window.location.search);

      if (queryParams.get("success") === "true") {
        if (order?.isPaid === false) {
          await payOrder(orderId);

          toast.success("Payment successful");
        }
      } else if (
        queryParams.get("canceled") === "true" &&
        order?.isPaid !== true
      ) {
        toast.error("Payment canceled");
      }
    };

    payOrderAndUpdate();
  }, [order?.isPaid, orderId, payOrder, dispatch]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order #{order._id} </h1>

      <Row className="mt-4">
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong>
                {order.paymentMethod}
              </p>
              {loadingPay ? (
                <Loader />
              ) : order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid"
                      />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* PAY ORDER PLACEHOLDER */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {(loadingPay || loadingTestPayment) && <Loader />}

                  <div>
                    <Button
                      onClick={() => {
                        testPayOrder(orderId);

                        toast.success("Test payment successful");
                      }}
                      type="button"
                      className="btn btn-block"
                    >
                      Test Pay Order
                    </Button>

                    <div className="mt-3">
                      <Button
                        onClick={handlePayment}
                        variant="success"
                        type="button "
                        className="btn py-3 w-100 text-white"
                      >
                        Pay with Stripe
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              )}

              {/* MARK AS DELIVERED PLACEHOLDER */}
              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OrderScreen;
