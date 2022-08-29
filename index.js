function Calculate() {
  const monto = document.querySelector("#monto").value;
  const interes = document.querySelector("#interes").value;
  const mes = document.querySelector("#mes").value;
  const interest = (monto * (interes * 0.01)) / mes;
  const total = ((monto / mes) + interest).toFixed(2);

  document.querySelector("#total")
      .innerHTML = "Total de Cuota: " + total;
}  







