import { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

export default function Home() {

  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/photo", {
      headers: {
        "X-CS571-ID": "bid_742c7c820564c4b9c731a52b47f87e522fd204a29950136f736656186cecefd3"
      }
    })
      .then(res => res.json())
      .then(data => {
        const key = Object.keys(data.results)[0];
        const arr = data.results[key];
        setFeatured(arr[Math.floor(Math.random() * arr.length)]);
      });
  }, []);

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>

          <h1>Welcome to PhotoSphere!</h1>

          <p>
            PhotoSphere is an interactive photography sharing platform where users can explore
            creative works, appreciate artistic perspectives, and discover unique moments captured
            around the world. Browse inspiring galleries, save your favorite pieces, and enjoy a
            curated collection of stunning visuals.
          </p>




        </Col>
      </Row>
    </Container>
  );
}
