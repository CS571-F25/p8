import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const loadUserPhotos = () => {
    try {
      const raw = localStorage.getItem("userPhotos");
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);

    if (f) {
      const objUrl = URL.createObjectURL(f);
      setPreviewUrl(objUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const compressImageToDataUrl = (file, maxSize = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => (img.src = e.target.result);
      reader.onerror = reject;

      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a photo file.");
      return;
    }

    setUploading(true);

    try {
      const dataUrl = await compressImageToDataUrl(file);
      const existing = loadUserPhotos();

      const newPhoto = {
        id: "local-" + Date.now(),
        url: dataUrl,
        description: desc,
        category: cat || "User Upload",
        likes: 0,
        source: "local",
      };

      const updated = [...existing, newPhoto];

      try {
        localStorage.setItem("userPhotos", JSON.stringify(updated));
      } catch {
        alert("Storage is full! Try deleting some photos.");
        setUploading(false);
        return;
      }

      alert("Photo saved locally! It will appear in your Gallery.");
      setFile(null);
      setPreviewUrl(null);
      setDesc("");
      setCat("");

      navigate("/gallery");
    } catch (err) {
      console.error(err);
      alert("Failed to process the image.");
    } finally {
      setUploading(false);
    }
  };

  const ACCENT = "#3A4F39";

  const buttonStyle = {
    background: "black",
    border: "1px solid black",
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    letterSpacing: "1px",
    padding: "10px",
    height: "42px",
    transition: "all 0.25s",
  };

  const buttonHover = {
    background: ACCENT,
    borderColor: ACCENT,
  };

  return (
    <Container fluid className="mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>

          <h1 className="mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Upload Photo
          </h1>

          <p className="text-muted" style={{ fontSize: "14px" }}>
            Upload your own photos to personalize your gallery.  
            Your uploads stay **only in this browser** and are never sent to a server.
          </p>

          <Card className="p-3 shadow-sm mt-3 w-100">
            <Form onSubmit={handleUpload}>
              <Form.Group className="mb-3">
                <Form.Label>Photo File</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              </Form.Group>

              {previewUrl && (
                <div className="mb-3 text-center">
                  <div className="mb-2 fw-semibold">Preview</div>
                  <img
                    src={previewUrl}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "260px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe your photo…"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  placeholder="e.g. Landscape, Portrait, Street…"
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={uploading}
                style={buttonStyle}
                onMouseEnter={(e) => Object.assign(e.target.style, buttonHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
                className="w-100"
              >
                {uploading ? "Saving…" : "Save to Gallery"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
