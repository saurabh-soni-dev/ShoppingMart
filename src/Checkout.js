import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Container,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Spinner,
  Table,
  ThemeProvider
} from "react-bootstrap";
import { getStoreItems } from "./getDataService";


const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  onIncrease,
  onDecrease,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name ? name : "------"}</td>
      <td>{availableCount ? availableCount : 0}</td>
      <td>₹{price ? price : 0}</td>
      <td>{orderedQuantity ? orderedQuantity : 0}</td>
      <td>₹{total ? total.toFixed(2) : 0}</td>
      <td>
        <Button
          variant="primary"
          size="sm"
          onClick={onIncrease}
          disabled={orderedQuantity >= availableCount}
        >
          Add
        </Button>{"  "}
        <Button
          variant="danger"
          size="sm"
          onClick={onDecrease}
          disabled={orderedQuantity <= 0}
        >
          Remove
        </Button>
      </td>
    </tr>
  );
};

const Header = () => {
  return (
    <Navbar expand="lg">
      <Navbar.Brand href="#">JS & RJS Sons. Shopping Mart</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavItem>
            <NavLink href="#"></NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#"></NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#"></NavLink>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const Footer = () => {
  return (
    <footer>
      <p>Copyright 2023 JS & RJS Sons. Shopping Mart</p>
    </footer>
  );
};

const Checkout = () => {
  const [productList, setproductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await getStoreItems();
    if (res) {
      setproductList(
        res.map((item) => ({ ...item, orderedQuantity: 0, total: 0 }))
      );
      setIsLoading(false);
    }
  };

  const handleQuantity = (type, id) => {
    const shallowCopy = [...productList];
    const updatedData = shallowCopy.map((item) => {
      if (item.id === id) {
        let orderedQuantity = item.orderedQuantity;
        switch (type) {
          case "increase":
            orderedQuantity = Math.min(
              item.availableCount,
              orderedQuantity + 1
            );
            break;
          case "decrease":
            orderedQuantity = Math.max(0, orderedQuantity - 1);
            break;
          default:
            console.error(`Invalid type: ${type}`);
            return item;
        }
        return {
          ...item,
          orderedQuantity,
          total: item.price * orderedQuantity,
        };
      } else {
        return item;
      }
    });
    setproductList(updatedData);
  };

  const totalAmount = useMemo(() => {
    return productList.reduce((acc, item) => acc + item.total, 0);
  }, [productList]);

  const gstAmount = useMemo(() => {
    return totalAmount > 1000 ? (18 / 100) * totalAmount : 0;
  }, [totalAmount]);

  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs"
    >
      <Container fluid>
        <Header />
        <main>
          {isLoading ? (
            <Spinner animation="grow" />
          ) : (
            <div>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Available</th>
                    <th>Price (₹) </th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productList?.map((item, index) => (
                    <Product
                      key={index}
                      id={item.id}
                      name={item.name}
                      availableCount={item.availableCount}
                      price={item.price}
                      orderedQuantity={item.orderedQuantity}
                      total={item.total}
                      onIncrease={() => handleQuantity("increase", item.id)}
                      onDecrease={() => handleQuantity("decrease", item.id)}
                    />
                  ))}
                </tbody>
              </Table>
              <Card>
                <Card.Body>
                  <h2>Order Details</h2>
                  {<p>GST: ₹ {gstAmount.toFixed(2)}</p>}
                  <p>Total: ₹ {(totalAmount + gstAmount).toFixed(2)}</p>
                </Card.Body>
              </Card>
            </div>
          )}
        </main>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default Checkout;
