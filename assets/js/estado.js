/* =========================================================
   Conexión — Estado de la zona del cuidador
   Maneja todo el estado persistente en localStorage del navegador:
   acceso, etapas de progreso, bitácora, citas y recompensa.
   ========================================================= */

const CLAVE_ESTADO = 'conexionEstado';

const SESION_06 = {
  numero: 6,
  fecha: '12 de noviembre',
  area: 'Comunicación y juego estructurado',
  profesional: 'Profesional a cargo del área de comunicación',
  resumen: 'Trabajamos actividades de espera, seguimiento de indicaciones y uso de pictogramas a través del juego.',
  actividades: [
    'Armado de un rompecabezas de 12 piezas, siguiendo el orden sugerido.',
    'Encaje de colores y formas, nombrando cada pieza antes de colocarla.',
    'Uso de pictogramas para pedir continuar o descansar la actividad.',
    'Práctica breve de espera entre un turno y otro.',
    'Seguimiento de indicaciones simples de un paso.'
  ],
  practicarCasa: [
    'Repetir el armado del rompecabezas dos o tres veces durante la semana.',
    'Usar un pictograma sencillo en casa para pedir una pausa.',
    'Dar una sola indicación a la vez y esperar antes de repetirla.'
  ]
};

function estadoPorDefecto(){
  return {
    version: 1,
    etapas: [
      {
        id: 1,
        nombre: 'Conociendo a mi niño',
        descripcion: 'Primeros acercamientos para entender intereses, rutinas y formas de comunicación.',
        estado: 'completada',
        avance: 100
      },
      {
        id: 2,
        nombre: 'Comunicación y conexión',
        descripcion: 'Actividades para fortalecer la comunicación y el juego compartido en casa.',
        estado: 'en-progreso',
        avance: 55,
        actividadSemanaRef: 6
      },
      {
        id: 3,
        nombre: 'Rutinas en casa',
        descripcion: 'Organización de rutinas simples que acompañan lo trabajado en sesión.',
        estado: 'pendiente',
        avance: 0
      },
      {
        id: 4,
        nombre: 'Bienestar del cuidador',
        descripcion: 'Espacios y recursos para cuidar también de tu propio bienestar.',
        estado: 'pendiente',
        avance: 0
      }
    ],
    actividadSemana: {
      etapaId: 2,
      titulo: 'Practicar el uso de pictogramas para pedir una pausa',
      respuesta: null // null | 'realizada' | 'con-apoyo' | 'duda'
    },
    bitacora: {
      sesiones: [
        { numero: 6, ...SESION_06, respuesta: null, observacion: '' },
        {
          numero: 5, fecha: '5 de noviembre', area: 'Terapia ocupacional',
          profesional: 'Profesional a cargo del área ocupacional',
          resumen: 'Actividades de coordinación motora fina y tolerancia a distintas texturas.',
          actividades: ['Juego con masa moldeable.', 'Ensartado de cuentas grandes.'],
          practicarCasa: ['Dedicar 10 minutos al día a juegos con masa o arena.'],
          respuesta: 'realizada', observacion: ''
        },
        {
          numero: 4, fecha: '29 de octubre', area: 'Terapia de lenguaje y comunicación',
          profesional: 'Profesional a cargo del área de lenguaje',
          resumen: 'Ejercicios de imitación de sonidos y gestos para iniciar un intercambio comunicativo.',
          actividades: ['Juego de imitación frente al espejo.', 'Canciones con gestos simples.'],
          practicarCasa: ['Cantar la misma canción con gestos cada noche antes de dormir.'],
          respuesta: 'con-apoyo', observacion: ''
        }
      ]
    },
    citas: [
      {
        id: 'c-001',
        tipo: 'Terapia de lenguaje y comunicación',
        fecha: '19 de noviembre',
        hora: '10:00 a. m.',
        estado: 'confirmada',
        observacion: '',
        origen: 'agenda'
      }
    ],
    recompensa: {
      solicitada: false
    }
  };
}

function obtenerEstado(){
  try{
    const guardado = localStorage.getItem(CLAVE_ESTADO);
    if(!guardado) {
      const inicial = estadoPorDefecto();
      guardarEstado(inicial);
      return inicial;
    }
    return JSON.parse(guardado);
  }catch(e){
    const inicial = estadoPorDefecto();
    guardarEstado(inicial);
    return inicial;
  }
}

function guardarEstado(estado){
  localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado));
}

function reiniciarEstado(){
  localStorage.removeItem(CLAVE_ESTADO);
  return obtenerEstado();
}

/* ---------- Ayudas de progreso ---------- */

function avanceGlobal(estado){
  const total = estado.etapas.reduce((suma, e) => suma + e.avance, 0);
  return Math.round(total / estado.etapas.length);
}

function etapasCompletadas(estado){
  return estado.etapas.filter(e => e.estado === 'completada').length;
}

function recompensaHabilitada(estado){
  return etapasCompletadas(estado) === estado.etapas.length;
}

function actualizarEstadoEtapa(idEtapa, nuevoEstado){
  const estado = obtenerEstado();
  const etapa = estado.etapas.find(e => e.id === idEtapa);
  if(!etapa) return estado;
  etapa.estado = nuevoEstado;
  etapa.avance = nuevoEstado === 'completada' ? 100 : (nuevoEstado === 'en-progreso' ? Math.max(etapa.avance, 40) : 0);
  guardarEstado(estado);
  return estado;
}

function registrarRespuestaSesion(numeroSesion, respuesta, observacion){
  const estado = obtenerEstado();
  const sesion = estado.bitacora.sesiones.find(s => s.numero === numeroSesion);
  if(sesion){
    sesion.respuesta = respuesta;
    sesion.observacion = observacion || '';
  }
  if(numeroSesion === 6){
    const mapa = { 'realizada': 'realizada', 'con-apoyo': 'con-apoyo', 'duda': 'duda', 'pendiente': null };
    estado.actividadSemana.respuesta = mapa[respuesta] ?? respuesta;
    if(respuesta === 'realizada'){
      const etapa = estado.etapas.find(e => e.id === estado.actividadSemana.etapaId);
      if(etapa && etapa.estado !== 'completada'){ etapa.estado = 'completada'; etapa.avance = 100; }
    }
  }
  guardarEstado(estado);
  return estado;
}

/* ---------- Citas ---------- */

function agregarCita(cita){
  const estado = obtenerEstado();
  const id = 'c-' + Math.random().toString(36).slice(2, 8);
  estado.citas.unshift({ id, estado: 'pendiente', ...cita });
  guardarEstado(estado);
  return estado;
}

function solicitarReprogramacion(idCita, fecha, hora, motivo){
  const estado = obtenerEstado();
  const cita = estado.citas.find(c => c.id === idCita);
  if(cita){
    cita.estado = 'reprogramacion';
    cita.reprogramacion = { fecha, hora, motivo: motivo || '' };
  }
  guardarEstado(estado);
  return estado;
}

function solicitarRecompensa(fecha, hora){
  const estado = obtenerEstado();
  estado.recompensa.solicitada = true;
  estado.citas.unshift({
    id: 'c-' + Math.random().toString(36).slice(2, 8),
    tipo: 'Sesión de bienestar para el cuidador',
    fecha, hora,
    estado: 'pendiente',
    observacion: 'Solicitada desde Mi recompensa.',
    origen: 'recompensa'
  });
  guardarEstado(estado);
  return estado;
}
