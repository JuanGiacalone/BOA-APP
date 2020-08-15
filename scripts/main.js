//MODAL

  // Obtiene el modal
  var modal = document.getElementById("miModal");

  // OnClick modal501() muestra el modal
function modal501(){
 
  modal.style.display = "block";

  // Cerrar cuando el usuario clickea afuera del modal
  window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    }
  }
  }
//MODAL