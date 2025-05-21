import "./App.css";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const ejercicios = [
  "press_de_pecho",
  "jalon_al_pecho",
  "jalon_al_pecho_estricto",
  "jalon_agarre_cerrado",
  "remo_sentado",
  "remo_amplio",
  "press_de_hombros",
  "curl_biceps_polea",
  "triceps_polea_frontal",
  "triceps_polea_trasera",
  "face_pull",
  "elevaciones_laterales",
];

function App() {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [esp32Ip, setEsp32Ip] = useState("192.168.0.184");

  const buildUrl = (endpoint) => `http://${esp32Ip}/${endpoint}`;

  const sendToESP32 = async (exercise) => {
    setStatus("Enviando...");
    try {
      const response = await fetch(buildUrl("ejercicio"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ejercicio: exercise }),
      });
      if (response.ok) {
        setStatus("Ejercicio enviado con éxito.");
      } else {
        setStatus("Error al enviar ejercicio.");
      }
    } catch (error) {
      setStatus("No se pudo conectar con el ESP32.");
    }
  };

  const handleStart = async () => {
    setStatus("Iniciando . . .");
    try {
      const response = await fetch(buildUrl("start"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setStatus("Ok");
      } else {
        setStatus("Error al iniciar.");
      }
    } catch (error) {
      setStatus("No se pudo iniciar");
    }
  };

  const handleStop = async () => {
    setStatus("Deteniendo . . .");
    try {
      const response = await fetch(buildUrl("stop"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setStatus("Ok");
      } else {
        setStatus("Error al detener.");
      }
    } catch (error) {
      setStatus("No se pudo detener");
    }
  };

  return (
    <Container className="p-4">
      <Row>
        <h1 style={{ textAlign: "center" }}>Detección de movimientos</h1>

        {/* Input para ingresar la IP */}
        <Row className="mb-3 justify-content-center">
          <Col xs="auto">
            <Form.Group>
              <Form.Label>IP del ESP32</Form.Label>
              <Form.Control
                type="text"
                value={esp32Ip}
                onChange={(e) => setEsp32Ip(e.target.value)}
                placeholder="Ej: 192.168.0.184"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs="auto">
            <div className="d-flex gap-2 justify-content-center">
              <Button onClick={handleStart} variant="success">
                Iniciar programa
              </Button>
              <Button onClick={handleStop} variant="danger">
                Detener programa
              </Button>
            </div>
          </Col>
        </Row>
      </Row>

      <h1 className="text-2xl font-bold mb-4">Selecciona un Ejercicio</h1>
      <Row xs={1} sm={2} md={3} className="g-4">
        {ejercicios.map((ej) => (
          <Col key={ej}>
            <Card
              className={`cursor-pointer ${
                selected === ej ? "bg-primary text-white" : ""
              }`}
              onClick={() => setSelected(ej)}
            >
              <Card.Body className="p-3 ejercicio">
                <Card.Text className="capitalize">
                  {ej.replaceAll("_", " ")}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-4">
        <Button
          variant="primary"
          disabled={!selected}
          onClick={() => sendToESP32(selected)}
        >
          Enviar ejercicio al ESP32
        </Button>
        {status && <p className="mt-2 text-muted">{status}</p>}
      </div>
    </Container>
  );
}

export default App;
