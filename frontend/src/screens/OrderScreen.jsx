import { Link, useParams } from "react-router-dom";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetCheckoutSessionMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51P4y50HPVRJk3r2Z56KHWCHxE7Lemxti5iCVU45JnJRPtINoB5LT4hdHrSSavuijoviMigfdpCztxyynxnAqhSua00xJq1Naxp"
);

function OrderScreen() {
  const { id: orderId } = useParams();

  const {
    data: order,
    error,
    isLoading,
    refetch,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [getCheckoutSession] = useGetCheckoutSessionMutation();

  async function handleOrder() {
    // 1) Get checkout session from API
    const session = await axios(`/api/orders/checkout-session/${orderId}`);

    console.log(session);

    // 2) Create checkout form + charge credit card
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    if (error) {
      toast.error(`Payment failed: ${error.message}`);
    }
  }

  useEffect(() => {
    function handleSuccess() {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get("success");

      if (paymentSuccess) {
        payOrder(orderId);
      }
    }

    handleSuccess();
  }, [orderId, payOrder]);

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
              {order.isPaid ? (
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
                  <div>
                    <Button type="button" className="btn btn-block">
                      Test Pay Order
                    </Button>

                    <div className="mt-3">
                      <Button
                        onClick={handleOrder}
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
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OrderScreen;
