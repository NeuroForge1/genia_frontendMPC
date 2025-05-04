import React from 'react';

const Chat: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in font-inter">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-genia-black">Genia CEO (Chat)</h1>
        <p className="text-genia-gray-dark">Interfaz de chat con el asistente principal.</p>
      </div>

      {/* Placeholder for chat interface - Apply branding styles */}
      <div className="bg-genia-white rounded-2xl shadow-lg p-6 h-[70vh] flex flex-col">
        {/* Chat messages area - Placeholder */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {/* Example messages */}
          <div className="flex justify-start">
            <div className="bg-genia-gray-light p-3 rounded-lg max-w-xs">
              <p className="text-sm text-genia-black">Hola, ¿en qué puedo ayudarte hoy?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-genia-blue text-genia-white p-3 rounded-lg max-w-xs">
              <p className="text-sm">Necesito crear un funnel para captar leads de mi curso de marketing.</p>
            </div>
          </div>
        </div>

        {/* Chat input area - Placeholder */}
        <div className="mt-auto flex items-center border-t border-genia-gray-medium/50 pt-4">
          <input 
            type="text" 
            placeholder="Escribe tu mensaje aquí..." 
            className="flex-1 px-4 py-2 border border-genia-gray-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-genia-blue focus:border-genia-blue mr-2"
          />
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-genia-white bg-genia-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-genia-blue">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

