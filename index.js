const IVA = 0.21
let monto, plazo, totalPagos, tasaAnual, fechaInicio, fechaPago, tasaMensual, mensualidad, intereses, impuestos,
  capital, insoluto, primerInteres, primerImpuesto, primerCapital, primerInsoluto, primerFechaPago, acumIntereses, acumImpuestos, acumCapital

const dinero = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
})

let establecerDatos = function () {
  primerInteres = 0, primerImpuesto = 0, primerCapital = 0, primerInsoluto = 0, primerFechaPago = true
  acumIntereses = 0, acumImpuestos = 0, acumCapital = 0

  monto = document.getElementById('monto').value
  periodo = document.getElementById('periodo').value
  plazo = document.getElementById('plazo').value
  tasaAnual = document.getElementById('interes').value
  fechaInicio = new Date(document.getElementById('fecha').value)
  fechaInicio.setDate(fechaInicio.getDate() + 1) // fecha actual

  let plazoMensual = document.getElementById('mensual').checked
  let plazoAnual = document.getElementById('anual').checked

  if ( plazoMensual === true ) {
    this.plazo = plazo
  } else if ( plazoAnual === true ) {
    this.plazo = plazo * 12
  } else {
    alert('No seleccionaste ningún tipo de plazo')
  }

  switch ( periodo ) {
    case 'semanal':
      let fechaFin = new Date(fechaInicio)
      fechaFin.setMonth(fechaFin.getMonth() + parseInt(plazo))
      let tiempo = fechaFin.getTime() - fechaInicio.getTime()
      let dias = Math.floor(tiempo / (1000 * 60 * 60 * 24))
      totalPagos = Math.ceil(dias / 7)
      break
    case 'quincenal':
      totalPagos = plazo * 2
      break
    case 'mensual':
      totalPagos = plazo
      break
    default:
      alert('No seleccionaste ningún periodo de pagos')
      break
  }
}

function calcularTasaMensual () {
  tasaMensual = (tasaAnual / 100) / 12
  return tasaMensual
}

function tasaMensualconIVA () {
  return (calcularTasaMensual() + (calcularTasaMensual() * IVA))
}

function PagoMensual () {
  let denominador = Math.pow((1 + tasaMensualconIVA()), totalPagos) - 1
  mensualidad = (tasaMensualconIVA() + (tasaMensualconIVA() / denominador)) * monto
  return mensualidad
}

function calcularTotalPrestamo () {
  let totalPrestamo = 0
  for ( let i = 0; i < totalPagos; i++ ) {
    totalPrestamo += mensualidad
  }
  return totalPrestamo
}

function obtenerPagoMensual () {
  return Math.round(PagoMensual(), 2)
}

function obtenerTotalPrestamo () {
  return Math.round(calcularTotalPrestamo(), 2)
}

function Intereses () {
  if ( primerInteres === 0 ) {
    intereses = tasaMensual * monto
    primerInteres = intereses
  } else {
    intereses = tasaMensual * insoluto
  }
  return intereses
}

function Impuestos () {
  if ( primerImpuesto === 0 ) {
    impuestos = primerInteres * IVA
    primerImpuesto = impuestos
  } else {
    impuestos = Intereses() * IVA
  }
  return impuestos
}

function Capital () {
  if ( primerCapital === 0 ) {
    capital = mensualidad - primerInteres - primerImpuesto
    primerCapital = capital
  } else {
    capital = mensualidad - Intereses() - Impuestos()
  }
  return capital
}

function SaldoInsoluto () {
  if ( primerInsoluto === 0 ) {
    insoluto = monto - primerCapital
    primerInsoluto = insoluto
  } else {
    insoluto -= Capital()
  }
  return insoluto
}

function simularPrestamo () {
  establecerDatos()
  PagoMensual()
  calcularTotalPrestamo()

  var columnas = [ 'No.', 'Fecha', 'Mensualidad', 'Intereses', 'Impuestos', 'Capital', 'Insoluto' ]

  let amortizaciones = document.getElementById('amortizaciones')
  let tabla = document.createElement('table')
  let cabeceraTabla = document.createElement('thead')
  let cuerpoTabla = document.createElement('tbody')
  let pieTabla = document.createElement('tfoot')
  let fila = document.createElement('tr')

  // Header de tabla
  for ( let j = 0; j < columnas.length; j++ ) {
    let celda = document.createElement('td')
    let texto = columnas[j]
    let textoCelda = document.createTextNode(texto)
    celda.appendChild(textoCelda)
    fila.appendChild(celda)
  }
  cabeceraTabla.appendChild(fila)

  // Cuerpo de tabla
  for ( let i = 0; i < totalPagos; i++ ) {
    let intereses = Intereses(), impuestos = Impuestos(), capital = Capital(), insoluto = SaldoInsoluto()
    acumIntereses += intereses
    acumImpuestos += impuestos
    acumCapital += capital

    let fila = document.createElement('tr')
    for ( let j = 0; j < columnas.length; j++ ) {
      let celda = document.createElement('td')
      let texto

      switch ( columnas[j] ) {
        case 'No.':
          texto = (i + 1)
          break
        case 'Fecha':
          if ( primerFechaPago === true ) {
            fechaPago = new Date(fechaInicio)
            primerFechaPago = false
          } else {
            if ( periodo === 'semanal' ) {
              fechaPago.setDate(fechaPago.getDate() + 7)
            } else if ( periodo === 'quincenal' ) {
              fechaPago.setDate(fechaPago.getDate() + 15)
            } else if ( periodo === 'mensual' ) {
              fechaPago.setMonth(fechaPago.getMonth() + 1)
            }
          }
          texto = fechaPago.toLocaleDateString()
          break
        case 'Mensualidad':
          texto = dinero.format(mensualidad)
          break
        case 'Intereses':
          texto = dinero.format(intereses)
          break
        case 'Impuestos':
          texto = dinero.format(impuestos)
          break
        case 'Capital':
          texto = dinero.format(capital)
          break
        case 'Insoluto':
          texto = dinero.format(Math.abs(insoluto))
          break
        default:
          texto = null
          break
      }
      let textoCelda = document.createTextNode(texto)
      celda.appendChild(textoCelda)
      fila.appendChild(celda)
    }
    cuerpoTabla.appendChild(fila)
  }

  // Footer de tabla
  for ( let j = 0; j < columnas.length; j++ ) {
    let celda = document.createElement('td')
    let texto
    switch ( columnas[j] ) {
      case 'No.':
        texto = totalPagos
        break
      case 'Intereses':
        texto = dinero.format(acumIntereses)
        break
      case 'Impuestos':
        texto = dinero.format(acumImpuestos)
        break
      case 'Capital':
        texto = dinero.format(acumCapital)
        break
      default:
        texto = ''
        break
    }
    let textoCelda = document.createTextNode(texto)
    celda.appendChild(textoCelda)
    pieTabla.appendChild(celda)
  }

  tabla.appendChild(cabeceraTabla)
  tabla.appendChild(cuerpoTabla)
  tabla.appendChild(pieTabla)
  amortizaciones.appendChild(tabla)
}
//Navbar//
// define all UI variable
const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.site-navbar ul');
const navLinks = document.querySelectorAll('.site-navbar a');

// load all event listners
allEventListners();

// functions of all event listners
function allEventListners() {
  // toggler icon click event
  navToggler.addEventListener('click', togglerClick);
  // nav links click event
  navLinks.forEach( elem => elem.addEventListener('click', navLinkClick));
}

// togglerClick function
function togglerClick() {
  navToggler.classList.toggle('toggler-open');
  navMenu.classList.toggle('open');
}

// navLinkClick function
function navLinkClick() {
  if(navMenu.classList.contains('open')) {
    navToggler.click();
  }
}

//Sweat Alert//
let boton = document.getElementById("button-blue");
boton.addEventListener("click", () => {
  Swal.fire(
    'Mensaje enviado!',
    'Muchas Gracias!',
    'Felicidades'
  )
})

//form
function SendMail(){
  let params = {
      from_name : document.getElementById("fullName").value,
      email_id : document.getElementById("email_id").value,
      message : document.getElementById("message").value
  }
  emailjs.send("service_vfxoxum", "template_p7e2nfq", params).then(function(res){
      alert("Gracias por tu mensaje" + res.status);
  })
}
// Sweat Alert Form que quiero utilizar en la linea 287
Swal.fire('Any fool can use a computer')

