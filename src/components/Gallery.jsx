import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function Gallery() {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/photo", {
      headers: {
        "X-CS571-ID": "bid_742c7c820564c4b9c731a52b47f87e522fd204a29950136f736656186cecefd3"
      }
    })
      .then(res => res.json())
      .then(data => {
        const all = Object.values(data.results).flat();
        setPhotos(all);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Gallery</h1>

      {photos.length === 0 ? (
        <p>No photos loaded…</p>
      ) : (
        <Row>
          {photos.map((photo, i) => (
            <Col key={i} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex">
              <Card className="shadow-sm w-100" style={{ borderRadius: "8px", overflow: "hidden" }}>
                
                <Card.Img
                  variant="top"
                  src={photo.url}
                  alt={photo.description}
                  style={{
                    height: "240px",
                    width: "100%",
                    objectFit: "cover"
                  }}
                />

                <Card.Body>
                  <Card.Text>{photo.description}</Card.Text>
                  <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {photo.category}
                  </div>

                  <div className="d-flex gap-2 mt-2">
                    <Button size="sm" variant="outline-danger">
                      ❤️ {photo.likes}
                    </Button>
                    <Button size="sm" variant="outline-secondary">
                      💾 Save
                    </Button>
                  </div>

                </Card.Body>

              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
