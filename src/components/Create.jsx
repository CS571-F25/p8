import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

export default function Create() {
  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        
        <Col xs={12} md={8} lg={6} xl={5}>
          
          <h1 className="mb-3">Upload Photo</h1>

          <p>
            Upload functionality coming soon! In future versions, you'll be able to upload your 
            own photographs, include descriptions, select a category, and contribute to the 
            PhotoSphere community.
          </p>

          <Card className="p-3 shadow-sm mt-3 w-100">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Photo File</Form.Label>
                <Form.Control type="file" disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} disabled placeholder="Coming soon..." />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control disabled placeholder="Coming soon..." />
              </Form.Group>

              <Button variant="secondary" disabled className="w-100">
                Upload (Coming Soon)
              </Button>
            </Form>
          </Card>

        </Col>
      </Row>
    </Container>
  );
}
