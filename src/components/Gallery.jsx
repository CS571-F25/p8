import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

export default function Gallery() {

  const [photos, setPhotos] = useState([]);
  const [likedDelta, setLikedDelta] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const loadLikedDelta = () => {
    try {
      const raw = localStorage.getItem("likedPhotosDelta");
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const loadUserPhotos = () => {
    try {
      const raw = localStorage.getItem("userPhotos");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const storedDelta = loadLikedDelta();
    const localPhotos = loadUserPhotos();
    setLikedDelta(storedDelta);

    fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/photo", {
      headers: {
        "X-CS571-ID":
          "bid_742c7c820564c4b9c731a52b47f87e522fd204a29950136f736656186cecefd3"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const apiPhotos = Object.values(data.results)
          .flatMap((group) => Object.values(group));

        const combined = [...localPhotos, ...apiPhotos].map((p) => ({
          ...p,
          likes: (p.likes ?? 0) + (storedDelta[p.id] ?? 0)
        }));

        setPhotos(combined);
      })
      .catch((err) => console.error(err));
  }, []);


  const handleLike = (photoId) => {
    if (!photoId) return;

    setLikedDelta((prev) => {
      const currentlyLiked = !!prev[photoId];
      const updated = { ...prev };

      const change = currentlyLiked ? -1 : 1;

      if (currentlyLiked) delete updated[photoId];
      else updated[photoId] = 1;

      localStorage.setItem("likedPhotosDelta", JSON.stringify(updated));

      setPhotos((old) =>
        old.map((p) =>
          p.id === photoId ? { ...p, likes: (p.likes ?? 0) + change } : p
        )
      );

      return updated;
    });
  };


  const handlePreview = (photo) => {
    if (!photo?.url) return;
    setPreviewPhoto(photo);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewPhoto(null);
  };


  const handleDelete = (photoId) => {
    if (!photoId) return;

    if (!window.confirm("Delete this photo from your local uploads?")) return;

    const existing = loadUserPhotos();
    const updatedLocal = existing.filter((p) => p.id !== photoId);
    localStorage.setItem("userPhotos", JSON.stringify(updatedLocal));

    setPhotos((prev) => prev.filter((p) => p.id !== photoId));

    setLikedDelta((prev) => {
      if (!prev[photoId]) return prev;
      const newDelta = { ...prev };
      delete newDelta[photoId];
      localStorage.setItem("likedPhotosDelta", JSON.stringify(newDelta));
      return newDelta;
    });
  };


  const isLocalPhoto = (photo) =>
    photo.source === "local" ||
    (typeof photo.id === "string" && photo.id.startsWith("local-"));


  return (
    <Container className="mt-4">
      <h1 className="mb-4"  style={{ fontFamily: "'Playfair Display', serif" }}>Gallery</h1>

      {photos.length === 0 ? (
        <p>No photos loaded…</p>
      ) : (
        <>
          <Row>
            {photos.map((photo, i) => (
              <Col
                key={photo.id ?? i}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4 d-flex"
              >
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
                    <Card.Text style={{ fontWeight: 600 }}>{photo.description}</Card.Text>

                    <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {photo.category}
                    </div>

                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleLike(photo.id)}
                      >
                        ❤️ {photo.likes ?? 0}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handlePreview(photo)}
                      >
                        Preview
                      </Button>

                      {isLocalPhoto(photo) && (
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => handleDelete(photo.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Modal show={showPreview} onHide={handleClosePreview} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Photo Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {previewPhoto && (
                <img
                  src={previewPhoto.url}
                  alt={previewPhoto.description}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                    borderRadius: "8px",

                  }}
                />
              )}
              {previewPhoto?.description && (
                <div className="mt-2 text-muted">{previewPhoto.description}</div>
              )}
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
}
