import { Component} from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import '../App.css';

class Reporte extends Component {

    constructor(props) {
        super(props)
        this.state = {
            temperatura: [],
            humedad: [],
            tablaData: [],
            mediaT: 0,
            mediaH:0,
            desEst: 0,
            tamMuestra: 0,
            medMuestra: 0,
            datosMuestra: [],
            z: 0,
            conclusion: 0,
            opcion: 0,
        }
        this.getTemp = this.getTemp.bind(this);
        this.getHum = this.getHum.bind(this);
    }

    verify = (value) => {
        if (value === 1) {
            this.getTemp(value);
            
        } if (value === 2) {
            this.getHum(value);  
        }
    }

    getTemp = (value) => {
        axios.get("https://192.168.97.49/django/datos/temperatura", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token'),
            },
        })
            .then(res => {
                this.setState({ temperatura: res.data });
                console.log(this.state.temperatura);
                setTimeout(() => { this.calculos(value); }, 100);
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    getHum = (value) => {
        axios.get("https://192.168.97.49/django/datos/humedad2", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token'),
            },
        })
            .then(res => {
                this.setState({ humedad: res.data });
                console.log(this.state.humedad);
                setTimeout(() => { this.calculos(value); }, 100);
            })
            .catch(error => {
                console.log(error.response);
            })
    }

    calculos = (value) => {
        let tamP = 0, tamM, error, z1 = 1.96, r, k, a, UV = 0.1, log, nClas;
        let datosOrden = [];

        if (value === 1) {
            tamP = this.state.temperatura.length;
            for (let i = tamP - 1; i >= tamP -200; i--) {         //Para pruebas, cambiar el i >= tamP - 200
                datosOrden.push(parseFloat(this.state.temperatura[i]["temperatura"]));
            }
        }
        if (value === 2) {
            tamP = this.state.humedad.length;
            for (let i = tamP -1; i >=  tamP -200; i--) {         //Para pruebas, cambiar el i >= tamP - 200
                datosOrden.push(parseFloat(this.state.humedad[i]["humedad"]));
            }
        }

        datosOrden.sort();
        console.log(datosOrden)
        tamP = datosOrden.length;

        r = datosOrden[datosOrden.length - 1] - datosOrden[0];
        log = 1 + 3.332 * Math.log10(tamP);
        k = Math.round(log)
        nClas = Math.round(k);
        if (nClas < k){
            nClas = nClas+1;
        }
        a = r / k;

        let aSrtr;

        aSrtr = a.toFixed(1);
        a = parseFloat(aSrtr);
        a = a + 0.1;
        
        let clases = [], limI = [], limS = [], limIE = [], limSE = [], MC = [], frec = [], frecAC = [], frecCMP = [];
        let mcFrec = 0, frecA = 0, acum = 0, limIStr, limSStr, limIEStr, limSEStr, MCStr;

        limI[0] = datosOrden[0];
        for (let i = 0; i < nClas; i++) {
            let frecc = 0;

            clases[i] = i + 1;
            limS[i] = limI[i] + (a - UV);
            limSStr = limS[i].toFixed(1);
            limS[i] = parseFloat(limSStr);


            limIE[i] = limI[i] - (UV / 2);
            limIEStr = limIE[i].toFixed(2);
            limIE[i] = parseFloat(limIEStr);

            limSE[i] = limS[i] + (UV / 2);
            limSEStr = limSE[i].toFixed(2);
            limSE[i] = parseFloat(limSEStr);

            MC[i] = (limIE[i] + limSE[i]) / 2;
            MCStr = MC[i].toFixed(2);
            MC[i] = parseFloat(MCStr);

            for (let j = 0; j < datosOrden.length; j++) {
                if (datosOrden[j] >= limI[i] && datosOrden[j] <= limS[i]) {
                    frecc = frecc + 1;
                }
            }

            frec[i] = frecc;
            frecA = frec[i] + frecA;
            frecAC[i] = frecA;
            frecCMP[i] = datosOrden.length - frecAC[i];

            mcFrec = frec[i] * MC[i];
            acum = acum + mcFrec;

            if (i < (datosOrden.length - 1)) {
                limI[i + 1] = limI[i] + a
                limIStr = limI[i+1].toFixed(1);
                limI[i+1] = parseFloat(limIStr);
            }
        }

        let medStr, media = 0;
        media = acum / tamP;
        medStr = media.toFixed(2);
        media = parseFloat(medStr); 

        if (isNaN(media) === false){
            if (value === 1) {
                this.setState ({mediaT : media});
            }if (value === 2) {
                this.setState ({mediaH : media});
            }
        }

        let empty = [];
        this.setState({ tablaData: empty})

        let dataVar = 0, data1, data2;

        for (let i = 0; i < clases.length; i++) {
            let arrayDatos = [];
            arrayDatos.push(clases[i]);
            arrayDatos.push(limI[i]);
            arrayDatos.push(limS[i]);
            arrayDatos.push(limIE[i]);
            arrayDatos.push(limSE[i]);
            arrayDatos.push(MC[i]);
            arrayDatos.push(frec[i]);
            arrayDatos.push(frecAC[i]);
            arrayDatos.push(frecCMP[i]);

            this.state.tablaData.push(arrayDatos);

            if (value === 1) {
                data1 = (MC[i] - this.state.mediaT);
            }if (value === 2) {
                data1 = (MC[i] - this.state.mediaH);
            }

            data2 = Math.pow(data1, 2);
            dataVar = dataVar + ( data2 * frec[i]);
        }

        let varZ = dataVar/tamP;
        let desE = Math.sqrt(varZ);
        let desEStr = desE.toFixed(2);
        desE = parseFloat(desEStr);

        this.state.desEst = 0;
        this.state.desEst = desE;
    
        console.log(this.state.tablaData);

        let z2 = Math.pow(z1, 2);
        error = Math.pow(0.05, 2);
        tamM = ( z2 * 0.5 * 0.5 * tamP)/ ((error * (tamP-1)+ z2 * 0.5 *0.5));
        tamM = Math.round(tamM);

        this.setState ({ tamMuestra: tamM});

        let cantStr, cant;
        cant = tamP/tamM;
        cantStr = cant.toFixed(2);
        cant = parseFloat(cantStr);
        
        console.log(cant);
        console.log(tamP);
        let maxMuestra = Math.round((tamP/cant));
        console.log(maxMuestra)

        let empty2 = []
        this.setState ( {datosMuestra: empty2})
       
        let valueM = 0
        for (let indx =  tamP - 1; indx >= tamP - maxMuestra; indx--) {
            let a = parseFloat("1")
            if (value === 1) {
                valueM = parseFloat(this.state.temperatura[indx]["temperatura"])
                if (isNaN(valueM) === false){
                    this.state.datosMuestra.push(valueM)
                }
                
            }if (value === 2) {
                valueM = parseFloat(this.state.humedad[indx]["humedad"])
                if (isNaN(valueM) === false){
                    this.state.datosMuestra.push(valueM)
                }
                
            }
        }

        console.log(this.state.datosMuestra);

        let sum = this.state.datosMuestra.reduce((previous, current) => current += previous);
        let medM = 0;
        medM = sum/this.state.datosMuestra.length;
        let medMStr = medM.toFixed(2);
        medM = parseFloat(medMStr);
        //this.setState ({medMuestra : medM});
        this.state.medMuestra = medM;

        this.setState ({ opcion: value})
        let zc = 0, conclusion = 0;
        
        if (value === 1){
            zc = ((this.state.medMuestra - this.state.mediaT)/(this.state.desEst/Math.sqrt(tamP)));
            if (zc < -1.96 || zc > 1.96){
                conclusion = 1
            }else {
                conclusion = 2
            }
            
            this.setState ( {conclusion : conclusion})
            this.state.z = zc;

            if(this.state.mediaT !==0){
                this.generarPDF();
            }else{
                alert("Error al generar reporte, intente nuevamente")
            }

        }if (value === 2){
            zc = ((this.state.medMuestra - this.state.mediaH)/(this.state.desEst/Math.sqrt(tamP)));
            if (zc < -1.96 || zc > 1.96){
                conclusion = 1
            }else {
                conclusion = 2
            }
        
            this.setState ( {conclusion : conclusion})
            this.state.z = zc;

            if(this.state.mediaH !==0){
                this.generarPDF();
            }else{
                alert("Error al generar reporte, intente nuevamente")
            }
        }
 
    }


    generarPDF () {
        let mediaString, nombreReporte, tipoData, tipoValor, valorZ, acpt, conclusion, hipA, hipN, concP;
        valorZ = this.state.z.toFixed(2);
        if (this.state.opcion === 1){
            mediaString = this.state.mediaT.toString();
            nombreReporte = "Reporte Temperatura";
            tipoData = "temperatura"
            tipoValor = "°C"
        }if (this.state.opcion === 2){
            mediaString = this.state.mediaH.toString();
            nombreReporte = "Reporte Humedad";
            tipoData = "humedad"
            tipoValor = "%"
        }

        hipN = "La planta se encuentra en un ambiente con una "+ tipoData +" de "+ mediaString+" "+ tipoValor+" en promedio"
        hipA = "La planta se encuentra en un ambiente con una "+ tipoData +" diferente de "+ mediaString+" "+ tipoValor+" en promedio"

        if(this.state.conclusion === 1){
            acpt = "se encuentra en la zona de rechazo"
            conclusion = "existe evidencia suficiente para rechazar la hipotesis nula y aceptar la alternativa."
            concP = hipA;
        } if(this.state.conclusion === 2){
            acpt = "se encuentra en la zona de aceptación"
            conclusion = "existe evidencia suficiente para aceptar la hipotesis nula."
            concP = hipN;
        }
        

        var columnas = [["Clase", "L. Inferior", "L.Superior", "L.Inf Exacto", "L.Sup Exacto","Marca Clase", "Frec", "Frec. Ac", "Frec. CMP"]];
        let content = {
            startY: 25,
            theme: 'grid',
            font: 'helvetica',
            pageBreak: 'auto',
            head: columnas,
            body: this.state.tablaData
        };
        const doc = new jsPDF();

        doc.setFontSize(11);
        doc.text(nombreReporte+" [ultimas 200 mediciones]", 15, 18);
        doc.autoTable(content);
        doc.text("Media de los datos: "+ mediaString, 15, 100);
        doc.text("Desviación estandar: "+ this.state.desEst.toString(), 15, 108);
        doc.text("Tamaño de muestra calculado: "+ this.state.tamMuestra.toString(), 15, 116);
        doc.text("Media de la muestra: "+ this.state.medMuestra.toString(), 15, 124);
        doc.text("Hipótesis Nula: "+ hipN, 15, 134);
        doc.text("Hipótesis Alternativa: "+hipA , 15, 140);
        doc.text("H0: M = "+mediaString, 15, 146);
        doc.text("H1: M != "+mediaString, 15, 152);
        doc.text("Nivel de significancia = 5% = 0.05", 15, 158);
        doc.text("Nivel de confianza = 95% = 0.95", 15, 164);
        doc.text("Nivel de confianza de la prueba de hipótesis = 0.5 - 0.025 = 0.475 --> +-1.96", 15, 170);
        doc.text("Transformando la media en un valor Z se obtuvo: "+valorZ , 15, 176);
        doc.text("Conclusión: El valor de Zc es de "+valorZ+" por lo que "+acpt+". Esto permite" , 15, 186);
        doc.text("llegar a la conclusión de que tras realizar un analisis estadistico con un 95% de confianza" , 15, 191);
        doc.text(conclusion , 15, 196);
        doc.text("Conclusión práctica: "+concP , 15, 204);

        let img = new Image();
        img.src = require('../img/graf.png')
        doc.addImage(img, "PNG", 30, 215, 140, 70);

        doc.addPage("a4","portrait");
        doc.text(nombreReporte+"- Gráfica frecuencia clases", 15, 18);

        let x = 15, y;
        for (let i = 0; i < this.state.tablaData.length; i++) {
            y= 250;
            for (let j = 0; j < this.state.tablaData[i][6]; j++) {
                doc.text("*********", x, y)
                y= y-2;
            } 
            x= x+20;
            doc.text(this.state.tablaData[i][6].toString(), x-15, 255);
            doc.text("Clase: "+this.state.tablaData[i][0].toString(), x-22, 260);
        }
        
        doc.save(nombreReporte+".pdf");
        
    }


    render() {
        return (
            <>
                <h3 className="subtitle">Reportes estadisticos</h3>
                <section className="data">

                    <div className='reporte' id='temp' onClick={() => this.verify(1)}>
                        <section className="textoReporte">Generar reporte de temperatura</section>
                    </div>
                    <div className='reporte' id='hum' onClick={() => this.verify(2)}>
                        <section className="textoReporte">Generar reporte de humedad</section>
                    </div>
                </section>
            </>
        );
    }

}

export default Reporte;
