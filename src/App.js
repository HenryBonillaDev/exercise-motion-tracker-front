import "./App.css";
import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

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

  const sendToESP32 = async (exercise) => {
    setStatus("Enviando...");
    try {
      const response = await fetch("http://192.168.0.184/ejercicio", {
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

  return (
    <Container className="p-4">
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
        {/* <Button
          className="m-2"
          variant="warning"
          onClick={() => calibrateSensors()}
        >
          Calibrar sensores
        </Button> */}
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
