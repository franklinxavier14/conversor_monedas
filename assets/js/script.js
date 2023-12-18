let myChart;

//obtenemos datos para graficos

async function obtenerDatosParaGrafico(moneda) {
    const respuesta = await fetch(`https://mindicador.cl/api/${moneda}`);
    if (!respuesta.ok) {
        throw new Error('Respuesta de la API no exitosa');
    }

    const data = await respuesta.json();
    if (!data || !data.serie || data.serie.length === 0) {
        throw new Error('Datos de la API no válidos o vacíos');
    }

    const valores = data.serie.slice(0, 10).map(dato => dato.valor);
    const fechas = data.serie.slice(0, 10).map(dato => new Date(dato.fecha).toLocaleDateString());


    return {
        labels: fechas,
        datasets: [{
            label: `Valor de ${moneda.charAt(0).toUpperCase() + moneda.slice(1)} en los últimos 10 días`,
            data: valores,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointRadius: 5,
            tension: 0.2,
            fill: false

        }]
    };
}

//renderizamos el grafico

async function renderizarGrafico() {
    const montoInput = document.getElementById('monto');
    const monedaSelect = document.getElementById('moneda');
    const resultadoElement = document.getElementById('resultado');

    const monto = montoInput.value;
    const moneda = monedaSelect.value;

    if (monto === '' || isNaN(monto)) {
        resultadoElement.textContent = 'Ingrese un monto válido.';
        return;
    }

    try {
        const datosGrafico = await obtenerDatosParaGrafico(moneda);
        const config = {
            type: 'line',
            data: {
                labels: datosGrafico.labels,
                datasets: datosGrafico.datasets
            },

        };

        const graficoCanvas = document.getElementById('grafico');
        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(graficoCanvas.getContext('2d'), config);

        const valorMoneda = datosGrafico.datasets[0].data[0];
        const resultado = monto / valorMoneda;

        resultadoElement.textContent = `El equivalente en ${moneda.charAt(0).toUpperCase() + moneda.slice(1)} es: $${resultado.toFixed(2)}`;
        console.log(resultadoElement);
    } catch (error) {
        console.error(`Error al procesar los datos de ${moneda}:`, error);
        resultadoElement.textContent = `Error al procesar los datos de ${moneda}.`;
    }
}

document.getElementById('botonConvertir').addEventListener('click', renderizarGrafico);
