import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../App.css';

function Login () {
    let navigate = useNavigate();

    const login = () => {
        const request_options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        var post_data = {
            username: document.getElementById('user').value,
            password: document.getElementById('passw').value
        }

        axios
            .post("https://192.168.97.49/django/login", post_data, request_options)
            .then(response => {
                localStorage.setItem('token', response.data.token);
                navigate('/datos', { replace: true });
            })
            .catch((error) => {
                alert("Verifique los datos de ingreso")
            });
    }
    return (
        <body>
            <div className="form-boxUser">
                <h1 id="title-user">Softness Plants</h1>
                <div className="form-user">
                    <label className="labelUser">Usuario:</label> 
                    <input className="inputUser" id="user" type="text" name= "usuario" placeholder="Usuario"/> 
                    <label className="labelUser">Contraseña:</label> 
                    <input className="inputUser" id="passw" type="password" name= "password" placeholder="Contraseña"/>
                    <br/><button className="buttonUser" onClick={login}>Ingresar</button>
                </div>
            </div>
        </body>
    );
}

export default Login;