/*function Calculate() {
  const monto = document.querySelector("#monto").value;
  const interes = document.querySelector("#interes").value;
  const mes = document.querySelector("#mes").value;
  const interest = (monto * (interes * 0.01)) / mes;
  const total = ((monto / mes) + interest).toFixed(2);

  document.querySelector("#total")
      .innerHTML = "Total de Cuota: " + total;
}  */
class amigo{
  constructor(nombre, domicilio, edad, profesion){
    this.nombre = nombre;
    this.domicilio = domicilio;
    this.edad = edad;
    this.profesion = profesion;
  }
}
const amigos = [];
amigos.push(new amigo("Gabriel", "Primera Junta", 36, true));
amigos.push(new amigo("Franco", "Gurruchaga", 30, false));
amigos.push(new amigo("Bruno", "Solano", 40, true));
amigos.push(new amigo("Lucas", "Rucci", 39, true));
amigos.push(new amigo("Matias", "Ceres", 28, false));
amigos.push(new amigo("Cristian", "Ceci", 18, false));
amigos.push(new amigo("Ignacio", "Balbiano", 42, true));
console.log(amigos);









