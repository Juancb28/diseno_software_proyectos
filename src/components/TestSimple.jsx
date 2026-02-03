import React from "react";

const TestSimple = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🧪 Test Simple de Importaciones
      </h1>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Verificando componentes básicos:
        </h2>
        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
          <li>✅ React importado</li>
          <li>✅ Componente renderizado</li>
          <li>✅ Estilos aplicados</li>
        </ul>
      </div>

      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#dcfce7', 
        borderRadius: '0.5rem',
        border: '1px solid #bbf7d0'
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
          🎉 ¡Éxito!
        </h2>
        <p style={{ color: '#15803d', margin: 0 }}>
          Si puedes ver esta página, significa que las importaciones básicas funcionan correctamente.
        </p>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={() => alert('¡Funciona!')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Probar Interactividad
        </button>
      </div>
    </div>
  );
};

export default TestSimple;
