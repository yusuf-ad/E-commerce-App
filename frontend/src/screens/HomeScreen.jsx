// External libraries
import { Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

// Internal components
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductsCarousel";

// Internal slices/hooks
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Meta from "../components/Meta";

function HomeScreen() {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber,
    keyword,
  });

  const { products, page, pages } = data ?? {};

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-3">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <div>
          <Meta />
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate page={page} pages={pages} keyword={keyword ?? ""} />
        </div>
      )}
    </>
  );
}

export default HomeScreen;
