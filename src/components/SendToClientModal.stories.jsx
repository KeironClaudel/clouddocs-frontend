import React from "react";
import SendToClientModal from "./SendToClientModal";

export default {
  title: "Components/SendToClientModal",
  component: SendToClientModal,
};

/**
 * @typedef {Object} SendToClientModalProps
 * @property {string} documentName - Nombre del documento
 * @property {string} clientName - Cliente destinatario
 * @property {string} subject - Asunto del correo
 * @property {string} message - Mensaje a enviar
 */

export const Default = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [subject, setSubject] = React.useState(
    "CloudDocs: Documento Importante.pdf",
  );
  const [message, setMessage] = React.useState(
    "Adjuntamos el documento solicitado para su revisión.",
  );

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>Abrir modal</button>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <SendToClientModal
        documentName="Documento Importante.pdf"
        clientName="Acme Corp"
        subject={subject}
        message={message}
        onSubjectChange={setSubject}
        onMessageChange={setMessage}
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          console.log("Enviando:", { subject, message });
          setIsOpen(false);
        }}
        sending={false}
      />
    </div>
  );
};

export const Sending = () => (
  <div style={{ padding: "20px" }}>
    <SendToClientModal
      documentName="Estado Financiero.pdf"
      clientName="Globex"
      subject="CloudDocs: Estado Financiero.pdf"
      message="Estamos procesando el envio del documento."
      onSubjectChange={() => {}}
      onMessageChange={() => {}}
      onCancel={() => {}}
      onConfirm={() => {}}
      sending={true}
    />
  </div>
);

Default.storyName = "SendToClientModal";
Default.parameters = {
  docs: {
    description: {
      component: `
# SendToClientModal Component

Modal para enviar documentos a clientes con opciones de asunto y mensaje.

## Propiedades

- **documentName**: Nombre del documento
- **clientName**: Cliente destino
- **subject**: Asunto editable
- **message**: Mensaje editable
- **onCancel**: Callback al cerrar
- **onConfirm**: Callback al confirmar
- **sending**: Estado de envio en progreso

## Características

- Resumen del documento y cliente
- Campo para asunto
- Área de texto para mensaje
- Estados de carga

## Ejemplo de uso

\`\`\`jsx
const [subject, setSubject] = React.useState('');
const [message, setMessage] = React.useState('');

<SendToClientModal
  documentName={selectedDocument.originalFileName}
  clientName={selectedDocument.clientName}
  subject={subject}
  message={message}
  onSubjectChange={setSubject}
  onMessageChange={setMessage}
  onCancel={() => setIsOpen(false)}
  onConfirm={handleConfirmSendToClient}
  sending={isSending}
/>
\`\`\`
      `,
    },
  },
};
