// Clase 
class RolloAuditado {
    constructor(id, metrosTotales, metrosDefecto) {
        this.id = id;
        this.metrosTotales = parseFloat(metrosTotales);
        this.metrosDefecto = parseFloat(metrosDefecto);
        this.porcentajeMerma = this.PorDef();
        this.estadoCalidad = this.EstCal();
    }
    //Porcentaje de defecto
    PorDef() {
        return (this.metrosDefecto / this.metrosTotales) * 100;
    }
    //Estado visual de calidad
    EstCal() {
        if (this.porcentajeMerma <= 5) {
            return { texto: 'Aprobado (Óptimo)', clase: 'bg-success' };
        } else if (this.porcentajeMerma <= 15) {
            return { texto: 'Observación (Aceptable)', clase: 'bg-warning text-dark' };
        } else {
            return { texto: 'Rechazado (Alta Merma)', clase: 'bg-danger' };
        }
    }
}
// Referencias a los elementos del DOM
const inputIdRollo = document.getElementById('idRollo');
const inputMtsTotales = document.getElementById('mtsTotales');
const inputMtsDefecto = document.getElementById('mtsDefecto');
const btnAuditar = document.getElementById('btnAuditar');
const tablaMermas = document.getElementById('tablaMermas');
// Aqui cargo registros previos al iniciar
let auditorias = JSON.parse(localStorage.getItem('auditoriasTextiles')) || [];
// Guardo en LocalStorage
function guardar() {
    localStorage.setItem('auditoriasTextiles', JSON.stringify(auditorias));
}
// renderizo la tabla en el DOM
function renderizarTabla() {
    tablaMermas.innerHTML = '';

    auditorias.forEach((rollo) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="fw-bold">${rollo.id}</td>
            <td>${rollo.metrosTotales.toFixed(2)} m</td>
            <td>${rollo.porcentajeMerma.toFixed(2)}%</td>
            <td>
                <span class="badge ${rollo.estadoCalidad.clase}">
                    ${rollo.estadoCalidad.texto}
                </span>
            </td>
        `;
        tablaMermas.appendChild(fila);
    });
}
// Validaciones preventivas y evento de guardado
function registrarAuditoria() {
    const id = inputIdRollo.value.trim();
    const mtsTotales = parseFloat(inputMtsTotales.value);
    const mtsDefecto = parseFloat(inputMtsDefecto.value);
    // Valido campos vacíos o valores no numéricos
    if (!id || isNaN(mtsTotales) || isNaN(mtsDefecto)) {
        alert('Por favor, completa todos los campos con valores válidos.');
        return;
    }
    // Valido que los metros sean lógicos (> 0 y defectos >= 0)
    if (mtsTotales <= 0 || mtsDefecto < 0) {
        alert('Los metros totales deben ser mayores a 0 y los metros con defecto no pueden ser negativos.');
        return;
    }
    // Valido que los mts def. sean mayores que los mts tot.
    if (mtsDefecto > mtsTotales) {
        alert('Error :( Los metros con defecto no pueden ser mayores a los metros totales del rollo.');
        return;
    }

    // Creo objeto con la clase y lo guardo
    const nuevoRollo = new RolloAuditado(id, mtsTotales, mtsDefecto);
    auditorias.push(nuevoRollo);

    guardar();
    renderizarTabla();
    limpiar();
}
// limpio los inputs después de registrar
function limpiar() {
    inputIdRollo.value = '';
    inputMtsTotales.value = '';
    inputMtsDefecto.value = '';
    inputIdRollo.focus();
}
// Eventos
btnAuditar.addEventListener('click', registrarAuditoria);
document.addEventListener('DOMContentLoaded', renderizarTabla);