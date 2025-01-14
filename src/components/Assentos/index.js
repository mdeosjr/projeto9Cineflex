import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Assento from "../Assento";
import loading from "../../assets/loading.gif";
import "./style.css";

function Assentos() {
    const { idSessao } = useParams();
    const [assentos, setAssentos] = useState([]);
    const [rodapeAssentos, setRodapeAssentos] = useState([]);
    const [nome, setNome] = useState("");
    const [CPF, setCPF] = useState("");
    let navigate = useNavigate(); 

    useEffect(() => {
        const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/cineflex/showtimes/${idSessao}/seats`)

        promessa.then(resposta => {
            setRodapeAssentos(resposta.data)
            setAssentos(resposta.data.seats)
        })
    }, []);

    function reservarAssentos() {
        const dadosCliente = {}
        const numeroAssento = []
        const idAssentos = []
        assentos.filter(assento => assento.isAvailable === 'selecionado')
                .map(assento => {
                    idAssentos.push(assento.id) 
                    numeroAssento.push(assento.name)
                    }
                )
        dadosCliente.name = nome
        dadosCliente.cpf = CPF
        dadosCliente.ids = idAssentos
        const envioSucesso = {
            CPF, 
            nome, 
            numeroAssento,
            titulo: rodapeAssentos.movie.title, 
            hora: rodapeAssentos.name, 
            data: rodapeAssentos.day.date
        }
        const envio = axios.post("https://mock-api.driven.com.br/api/v4/cineflex/seats/book-many", dadosCliente)
        envio.then(navigate("/sucesso", {state: envioSucesso}))
    }

    if (assentos.length === 0) {
        return (
            <img className="loading" src={loading} alt="Carregando..."></img> 
        )
    }

    return (
        <>
            <button className="botaoVoltar" onClick={() => navigate(-1)} alt="Voltar">Voltar</button>
            <div className="telaAssentos">
                <span className="titulo">Selecione o(s) assento(s)</span>
                <div className="assentos">
                    {assentos.map(assento => 
                        <Assento 
                            livre={assento.isAvailable} 
                            numero={assento.name} 
                            assentos={assentos} 
                            key={assento.id}
                        />)}
                </div>
                <div className="legenda">
                    <div className="caixaAssento">                                                                                                      
                        <div className="assento selecionado"></div>
                        <span>Selecionado</span>
                    </div>
                    <div className="caixaAssento">
                        <div className="assento true"></div>
                        <span>Disponível</span>
                    </div>
                    <div className="caixaAssento">
                        <div className="assento false"></div>
                        <span>Indisponível</span>
                    </div>
                </div>
                <div className="infosClientes">
                    <span className="tituloInput">Nome do comprador:</span>
                    <input placeholder="Digite seu nome..." value={nome} onChange={e => setNome(e.target.value)}></input>
                    <span className="tituloInput">CPF do comprador:</span>
                    <input placeholder="Digite seu CPF..." value={CPF} onChange={e => setCPF(e.target.value)}></input>
                </div>
                <div className="reserva" onClick={reservarAssentos}>
                    <span>Reservar assento(s)</span>
                </div>
            </div>
            <footer className="descricaoFilme">
                <div className="borda">
                    <img src={rodapeAssentos.movie.posterURL} alt={rodapeAssentos.movie.title}></img>
                </div>
                <div className="infos">
                    <p>{rodapeAssentos.movie.title}</p>
                    <p>{rodapeAssentos.day.weekday} - {rodapeAssentos.name}</p>
                </div>
            </footer>
        </>
    )
}

export default Assentos;