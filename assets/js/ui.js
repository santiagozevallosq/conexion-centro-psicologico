/* =========================================================
   Conexión — Interacciones de interfaz compartidas
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Menú móvil (página pública) --- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navPublica = document.querySelector('.nav-publica');
  if(menuToggle && navPublica){
    menuToggle.addEventListener('click', () => {
      navPublica.classList.toggle('abierto');
    });
  }

  /* --- Menú lateral móvil (zona del cuidador) --- */
  const sidebarToggle = document.querySelector('.topbar-movil button');
  const sidebar = document.querySelector('.sidebar');
  if(sidebarToggle && sidebar){
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('abierto');
    });
  }

  /* --- Modales genéricos: [data-abrir-modal="id"] / [data-cerrar-modal] --- */
  document.querySelectorAll('[data-abrir-modal]').forEach(boton => {
    boton.addEventListener('click', () => {
      const modal = document.getElementById(boton.getAttribute('data-abrir-modal'));
      if(modal) modal.classList.add('abierto');
    });
  });
  document.querySelectorAll('.modal-fondo').forEach(fondo => {
    fondo.addEventListener('click', (e) => {
      if(e.target === fondo) fondo.classList.remove('abierto');
    });
    fondo.querySelectorAll('[data-cerrar-modal]').forEach(boton => {
      boton.addEventListener('click', () => fondo.classList.remove('abierto'));
    });
  });

  /* --- Formularios de demostración: muestran un mensaje de confirmación en pantalla --- */
  document.querySelectorAll('form[data-confirmacion]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const mensaje = document.getElementById(form.getAttribute('data-confirmacion'));
      if(mensaje){
        mensaje.classList.add('visible');
        mensaje.scrollIntoView({ behavior:'smooth', block:'nearest' });
      }
      if(form.hasAttribute('data-reset-tras-envio')){
        setTimeout(() => form.reset(), 300);
      }
    });
  });

  /* --- Cerrar sesión: limpia la ruta y vuelve al inicio --- */
  document.querySelectorAll('[data-cerrar-sesion]').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = enlace.getAttribute('href') || '../index.html';
    });
  });
});
