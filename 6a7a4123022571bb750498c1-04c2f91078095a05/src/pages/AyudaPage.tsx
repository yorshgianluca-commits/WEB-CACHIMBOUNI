import { useState } from "react";
import Icon from "../components/Icon";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import type { NavigateFn } from "../lib/router";

type Props = {
  navigate: NavigateFn;
  path: string;
};

type Faq = {
  id: string;
  tag: string;
  question: string;
  answer: string;
};

const FAQS: Faq[] = [
  {
    id: "cepreuni",
    tag: "CEPREUNI",
    question: "¿Qué me puede servir si estoy en CEPREUNI?",
    answer:
      "Practicar con exámenes pasados, principalmente los parciales. También puede servirte un ciclo paralelo, que está en la sección Recursos.",
  },
  {
    id: "transporte",
    tag: "Transporte",
    question: "¿Qué carro puedo tomar para ir a la CEPREUNI?",
    answer: "Próximamente XD.",
  },
  {
    id: "estudiar",
    tag: "Método",
    question: "¿Cómo estudiar?",
    answer:
      "Depende, pero generalmente es prestar atención a la clase y después practicar full ejercicios en general. Dale poco tiempo al tema que te tocó; con esto me refiero a que no todo es importante. Por eso te recomiendo practicar con exámenes pasados para que te des cuenta de cómo viene o para que tengas una noción.",
  },
];

export default function AyudaPage({ navigate, path }: Props) {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="page ayuda-page">
      <SiteHeader navigate={navigate} path={path} variant="solid" />

      <section className="faq-section">
        <div className="faq-inner">
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <button onClick={() => navigate("/")} aria-label="Volver al inicio">
              <Icon name="arrowLeft" size={15} /> Inicio
            </button>
            <span aria-hidden="true">/</span>
            <strong>Ayuda</strong>
          </nav>

          <div className="faq-head">
            <span className="faq-kicker">Preguntas</span>
            <h1>
              Ayuda y
              <br />
              <em>Preguntas.</em>
            </h1>
            <p>
              Las dudas más comunes de quienes se preparan para la UNI, respondidas de forma directa
              y sin rodeos. Haz clic en una pregunta para ver la respuesta.
            </p>
          </div>

          <div className="faq-list">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className={isOpen ? "faq-item is-open" : "faq-item"}>
                  <button
                    className="faq-question"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-button-${faq.id}`}
                  >
                    <span className="faq-toggle" aria-hidden="true">
                      <i className="faq-toggle-bar faq-toggle-bar--h" />
                      <i className="faq-toggle-bar faq-toggle-bar--v" />
                    </span>
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-tag">{faq.tag}</span>
                  </button>

                  <div
                    className="faq-answer"
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-button-${faq.id}`}
                    hidden={!isOpen}
                  >
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                      {faq.id === "cepreuni" && (
                        <button className="faq-link" onClick={() => navigate("/recursos/examenes")}>
                          Ir a exámenes en Recursos <Icon name="arrow" size={14} />
                        </button>
                      )}
                      {faq.id === "estudiar" && (
                        <button className="faq-link" onClick={() => navigate("/camino-rapido")}>
                          Ver el camino más rápido <Icon name="arrow" size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="faq-footer">
            <div>
              <span className="faq-kicker">¿No está tu pregunta?</span>
              <p>Escríbeme y la agrego a esta lista para que ayude a más postulantes.</p>
            </div>
            <a className="faq-contact" href="mailto:giankluccas@gmail.com?subject=Pregunta%20desde%20CachimboUNI">
              <Icon name="mail" size={16} /> giankluccas@gmail.com
            </a>
          </div>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
