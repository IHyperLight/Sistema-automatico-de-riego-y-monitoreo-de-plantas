import { Component } from 'react';
import { NavLink } from "react-router-dom"
import axios from "axios";
import '../App.css';

import reload from '../img/reload.png';
import Slider from './Slider';
import Reporte from './Reporte';

class Main extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      datos: [],
      temperatura: [],
      humedad: [],
    }
    this.get = this.get(this)
  }

  
  get() {
    axios.get("https://192.168.97.49/django/datos/actual", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      },
    })
      .then(res => {
        this.setState({ datos: res.data })
      })
      .catch(error => {
        console.log(error.response);
      })
  }

  getReload = () => {
    axios.get("https://192.168.97.49/django/datos/actual", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      },
    })
      .then(res => {
        this.setState({ datos: res.data })
        window.location.reload();
      })
      .catch(error => {
        console.log(error.response);
      })
  }

  
  render() {
    return (
      <body id='body'>
        <div className="img">
          <header>
            <nav id='nav'>
              <div><NavLink className="link" to="/datos"><h5>Softness</h5></NavLink></div>
              <div id='navText'><NavLink className="link" to="/historial">Historial</NavLink></div>
            </nav>
          </header>

          <main>
            <div id="top">
              <h2>Monitoreo de Planta</h2>
              <div id="details">
                <a href="#info-plant"><button className="main-button">Ver datos de la planta</button></a>
                <img src={reload} alt="error" id="reload" onClick={() => this.getReload()}/>
              </div>
              <div id="img2">
                <div className="circle" id="c1"></div>
                <div className="infoHide" id="info1">Nivel de agua: {this.state.datos.nivelA}</div>
                <div className="circle" id="c2"></div>
                <div className="infoHide" id="info2">Humedad del suelo: {this.state.datos.humedadS}</div>
                <div className="circle" id="c3"></div>
                <div className="infoHide" id="info3">Temperatura: {this.state.datos.temperatura}°C</div>
                <div className="circle" id="c4"></div>
                <div className="infoHide" id="info4">Humedad: {this.state.datos.humedad}%</div>
              </div>
            </div>
          </main>

          <section id="info-plant">
            <div id="bottom">
              <h3 className="subtitle">Datos de la planta</h3>
              <section className="data">
                <div className="info">
                  <h5>Nivel de agua</h5>
                  <h2>{this.state.datos.nivelA}%</h2>
                </div>
                <div className="info">
                  <h5>Humedad del suelo</h5>
                  <h2>{this.state.datos.humedadS}%</h2>
                </div>
                <div className="info">
                  <h5>Temperatura</h5>
                  <h2>{this.state.datos.temperatura}°C</h2>
                </div>
                <div className="info">
                  <h5>Humedad</h5>
                  <h2>{this.state.datos.humedad}%</h2>
                </div>
              </section>
            </div>
            <div id="bottom2">
              <div id="slider">
                <Slider></Slider>
              </div>
              <div id="infoSlider">
                <h3 className="subtitle">Imagenes de la planta</h3>
              </div>
            </div>
            <div id="bottom3">
             <Reporte></Reporte>
            </div>
          </section>

          <footer>
            <p>203420 - 203721 - 191287</p>
            <br/>
            <h4>Proyecto Integrador 6° Cuatrimestre</h4>
          </footer>
        </div>
      </body>
    );
  }

}

export default Main;
