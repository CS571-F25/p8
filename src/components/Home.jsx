import { useState, useEffect } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {

  const [photos, setPhotos] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLikedDelta = () => {
    try {
      const raw = localStorage.getItem("likedPhotosDelta");
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const loadUserPhotos = () => {
    try {
      const raw = localStorage.getItem("userPhotos");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const storedDelta = loadLikedDelta();
    const localPhotos = loadUserPhotos();

    fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/photo", {
      headers: {
        "X-CS571-ID": "bid_742c7c820564c4b9c731a52b47f87e522fd204a29950136f736656186cecefd3"
      }
    })
      .then(res => res.json())
      .then(data => {
        const apiPhotos = Object.values(data.results).flat();

        const all = [...localPhotos, ...apiPhotos].map(p => ({
          ...p,
          likes: (p.likes ?? 0) + (storedDelta[p.id] ?? 0)
        }));

        setPhotos(all);
        setLoading(false);

        if (all.length > 0) {
          const random = all[Math.floor(Math.random() * all.length)];
          setFeatured(random);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const likedPhotos = [...photos]
    .filter(p => (p.likes ?? 0) > 0)
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, 4);

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>

          <h1>Welcome to PhotoSphere!</h1>

          <p>
            PhotoSphere is an interactive photography sharing platform where users can explore
            creative works, appreciate artistic perspectives, and discover unique moments captured
            around the world. Browse inspiring galleries, preview your favorite pieces, and enjoy a
            curated collection of stunning visuals.
          </p>

          {loading && (
            <div className="d-flex align-items-center gap-2 mb-3">
              <Spinner animation="border" size="sm" />
              <span>Loading photos…</span>
            </div>
          )}

          {featured && (
            <Card className="mt-3 shadow-sm">
              <Card.Img
                variant="top"
                src={featured.url}
                alt={featured.description}
                style={{
                  maxHeight: "360px",
                  objectFit: "cover"
                }}
              />
              <Card.Body>
                <Card.Title>Featured Photo</Card.Title>
                <Card.Text>{featured.description}</Card.Text>
                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  {featured.category}
                </div>
              </Card.Body>
            </Card>
          )}

          <Row className="mt-4">
            <Col xs={12} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">Most Liked</h4>
                <small>
                  <Link to="/gallery">See all</Link>
                </small>
              </div>

              {likedPhotos.length === 0 ? (
                <p className="text-muted">No liked photos yet.</p>
              ) : (
                likedPhotos.map((photo, i) => (
                  <Card
                    key={photo.id ?? i}
                    className="mb-2 shadow-sm"
                    style={{ borderRadius: "8px", overflow: "hidden" }}
                  >
                    <Row className="g-0">
                      <Col xs={4}>
                        <Card.Img
                          src={photo.url}
                          alt={photo.description}
                          style={{
                            height: "90px",
                            width: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </Col>
                      <Col xs={8}>
                        <Card.Body className="py-2">
                          <Card.Text className="mb-1" style={{ fontSize: "0.9rem" }}>
                            {photo.description}
                          </Card.Text>
                          <div
                            className="text-muted d-flex justify-content-between"
                            style={{ fontSize: "0.8rem" }}
                          >
                            <span>{photo.category}</span>
                            <span>❤️ {photo.likes ?? 0}</span>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))
              )}
            </Col>
          </Row>

        </Col>
      </Row>
    </Container>
  );
}
