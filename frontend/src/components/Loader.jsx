import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "80px",
        height: "80px",
        margin: "auto",
        display: "block",
      }}
    ></Spinner>
  );
}

export default Loader;
