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
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
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

      reader.onload = (e) => {
        img.src = e.target.result;
      };
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

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
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
        source: "local"
      };

      const updated = [...existing, newPhoto];

      try {
        localStorage.setItem("userPhotos", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
        alert(
          "Your browser storage is full. Try removing some uploads or using a smaller image."
        );
        setUploading(false);
        return;
      }

      alert("Photo saved locally! It will now appear in your Gallery.");

      setFile(null);
      setPreviewUrl(null);
      setDesc("");
      setCat("");
      setUploading(false);

      navigate("/gallery");
    } catch (err) {
      console.error(err);
      alert("Failed to process the image file.");
      setUploading(false);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>

          <h1 className="mb-3">Upload Photo</h1>

          <p className="text-muted">
  Upload your own photos to make this gallery yours. They’re saved only in this browser
  and will appear in your Gallery as compressed previews.
          </p>

          <Card className="p-3 shadow-sm mt-3 w-100">
            <Form onSubmit={handleUpload}>

              <Form.Group className="mb-3">
                <Form.Label>Photo File</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>

              {previewUrl && (
                <div className="mb-3 text-center">
                  <div className="mb-2 fw-semibold">Preview</div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "240px",
                      objectFit: "cover",
                      borderRadius: "8px"
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
                  type="text"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  placeholder="e.g. Landscape, Portrait, Street…"
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={uploading}
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
