import React from "react";
import SendToClientModal from "./SendToClientModal";

export default {
  title: "Components/SendToClientModal",
  component: SendToClientModal,
};

/**
 * @typedef {Object} SendToClientModalProps
 * @property {Object} document - Documento a enviar
 * @property {boolean} isOpen - Estado del modal (abierto/cerrado)
 * @property {Function} onClose - Callback al cerrar modal
 * @property {Function} onSend - Callback al enviar
 */

const mockDocument = {
  id: "123",
  name: "Documento Importante.pdf",
  size: "2.5MB",
};

export const Default = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
      <SendToClientModal
        document={mockDocument}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSend={(data) => {
          console.log("Enviando:", data);
          setIsOpen(false);
        }}
      />
    </div>
  );
};

Default.storyName = "SendToClientModal";
Default.parameters = {
  docs: {
    description: {
      component: `
# SendToClientModal Component

Modal para enviar documentos a clientes con opciones de asunto y mensaje.

## Propiedades

- **document**: Objeto con información del documento
- **isOpen**: Boolean para controlar visibilidad del modal
- **onClose**: Callback ejecutado al cerrar
- **onSend**: Callback ejecutado al enviar el documento

## Características

- Formulario de envío con validación
- Campo para asunto
- Área de texto para mensaje
- Selección de cliente
- Estados de carga
- Manejo de errores

## Ejemplo de uso

\`\`\`jsx
const [isOpen, setIsOpen] = React.useState(false);

<SendToClientModal
  document={selectedDocument}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSend={async (data) => {
    await sendDocumentToClient(data);
  }}
/>
\`\`\`
      `,
    },
  },
};
