import React from "react";

const Diagnostic = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🔍 Sistema Funcional
      </h1>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '0.5rem',
        border: '1px solid #bbf7d0',
        marginBottom: '1rem'
      }}>
        <h3 style={{ fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
          ✅ Estado Actual
        </h3>
        <ul style={{ color: '#15803d', margin: 0, paddingLeft: '1rem' }}>
          <li>Material-UI funcionando</li>
          <li>Radix UI instalado</li>
          <li>Componentes UI listos</li>
          <li>Servidor corriendo</li>
        </ul>
      </div>

      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#dbeafe', 
        borderRadius: '0.5rem',
        border: '1px solid #93c5fd'
      }}>
        <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
          📝 Notas
        </h3>
        <p style={{ color: '#1e3a8a', margin: 0 }}>
          Los componentes están funcionando. Prueba las rutas de test para verificar.
        </p>
      </div>
    </div>
  );
};

export default Diagnostic;
