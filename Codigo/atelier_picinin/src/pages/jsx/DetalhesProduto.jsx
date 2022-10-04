import '../css/Products/DetalhesProduto.css'

import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import oneStar from '../img/goldstar.png'
import Compavaliacao from '../../components/layout/Avaliação'
import Message from "../../components/layout/Message"
import { useState, useEffect } from 'react'
import {useNavigate, useParams } from "react-router-dom"
import avaliacao from '../../components/layout/Avaliação'
import Loading from '../../components/layout/Loading'

const url = "http://localhost:3000"

const DetalhesProduto = () => {
    var  nota = 1

    const { id } = useParams()
    const [produto, setProduto] = useState([])
    const [avaliacoes, setAvaliacoes] = useState([])
    const [message, setMessage] = useState("")
    const [show, setShow] = useState(false)
    const [sabor, setSabor] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${url}/produto/getProductById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())
        .then(data => setProduto(data))
        .then(setTimeout(() => setIsLoading(false), 300))
        .catch(err => console.error(err))

        fetch(`http://localhost:3000/rating/viewAllRatings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        }).then(resp => resp.json())
        .then(data => setAvaliacoes(data))
        .catch(err => console.error(err))
    }, [])

    function addProdutoCarrinho(){
        const qtd = document.querySelector(".inputQtd")
        let precoTotal = sabor.preco * parseInt(qtd.value);
        const produtoCarrinho = {
            _id: produto._id, img: produto.foto1, nome: produto.nomeProduto, preco: sabor.preco, quantidade: parseInt(qtd.value), precoTotal: precoTotal, sabores: sabor.sabor
        }
        const data = window.localStorage.getItem("user-cart")
        const carrinho = data ? JSON.parse(data) : []
        carrinho.push(produtoCarrinho)
        window.localStorage.setItem("user-cart", JSON.stringify(carrinho))

        navigate("/carrinho")
    }

    function handleClickStar(e) {
        var stars = document.querySelectorAll('.star-icon');
        var classStar = e.target.classList;
        if (!classStar.contains('ativo')) {
            stars.forEach(function (star) {
                star.classList.remove('ativo')
            })
            classStar.add('ativo') 

            nota = e.target.getAttribute('data-avaliacao')
        }
    }

    function createRating(input){
        input.data = new Date().toISOString()

        fetch(`${url}/rating/ratingRegister`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },  
            body: JSON.stringify({ "produto": produto._id,
            cliente: "Cliente",
            comentario: document.getElementById("comentario").value,
            nota: nota,
            data: input.data
            })
        }).then(resp => resp.json())
        .then(handleClose)
        .then(navigate(`/detalhesProduto/${id}`))
        .then(setMessage("Avaliação cadastrada com sucesso!"))
        .catch(err => console.error(err))
    }

    return (
        !isLoading ?
            <div className='body-detalhes-produto ' style={{ width: '100%', padding: '0rem 4rem' }}>
                <div className="container">
                { message && <Message type="success" message={ message } /> }
                    <div className="row gx-4 ">
                        <div className="col-md-6" style={{ paddingLeft: '0rem' }}>
                            <Carousel>
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={produto.foto1}
                                        alt="First slide"
                                    />

                                    <Carousel.Caption>
                                        <h3>{produto.nomeProduto}</h3>
                                        <p>Frase legal de marketing do doce</p>
                                    </Carousel.Caption>
                                </Carousel.Item>

                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={produto.foto2}
                                        alt="Second slide"
                                    />

                                    <Carousel.Caption>
                                        <h3>{produto.nomeProduto}</h3>
                                        <p>Frase legal de marketing do doce</p>
                                    </Carousel.Caption>
                                </Carousel.Item>

                                <Carousel.Item>
                                    <img
                                        className="d-block w-100"
                                        src={produto.foto3}
                                        alt="Third slide"
                                    />

                                    <Carousel.Caption>
                                        <h3>{produto.nomeProduto}</h3>
                                        <p>Frase legal de marketing do doce</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel>
                        </div>

                        <div className='col-md-6' >
                            <div>
                                <h1>{ produto.nomeProduto }</h1>
                                <div>
                                    <span><img src={oneStar} style={{ width: '12px', paddingBottom: '4px' }} /></span>
                                    <span>4,6</span><br/>
                                    <span>3 reviews</span>
                                </div>

                                <span>R${produto.precoProduto} por unidade</span>
                            </div>

                            <div className="row gx-4 ">
                                <div className="col-md-6 sabores">Sabores
                                    <div>
                                        <ButtonGroup aria-label="Basic example" size='sm' className='buttongroup'>
                                            { produto.sabores.map(sabor => <button onClick={() => setSabor(sabor)}>{ sabor.sabor }</button>) }
                                        </ButtonGroup>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div>Quantidade 
                                        <input type="number" style={{ border: '1px solid black' }} step={produto.pedidoMinProduto} min={produto.pedidoMinProduto} className='inputQtd'/>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Button onClick = {addProdutoCarrinho} variant="outline-secondary" className='btncarrinho'>Adicionar no Carrinho</Button>{' '}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', padding: '0rem 4rem' }} className="informacoes">
                    <h1>Informações do Produto</h1>
                    <div>{ produto.descricaoProduto }</div>
                </div>
            
                <div className="ulavaliacao">
                    <Button className="btn-avaliar" variant="primary" onClick={handleShow}>
                        Avaliar
                    </Button>
                    { avaliacoes.map(avaliacao =>
                        avaliacao.produto == produto._id && 
                            <Compavaliacao nota={avaliacao.nota} comentario={avaliacao.comentario} avaliador={avaliacao.cliente}/>
                        )
                    }
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Realizar Avaliação</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <label htmlFor="comentario">Comentario:</label>
                            <input type="text" name="comentario" id="comentario" required/>
                            <p>Nota:</p>
                            <ul className="ulavaliacao">
                                <li className="star-icon ativo" data-avaliacao="1" onClick={handleClickStar}></li>
                                <li className="star-icon" data-avaliacao="2" onClick={handleClickStar}></li>
                                <li className="star-icon" data-avaliacao="3" onClick={handleClickStar}></li>
                                <li className="star-icon" data-avaliacao="4" onClick={handleClickStar}></li>
                                <li className="star-icon" data-avaliacao="5" onClick={handleClickStar}></li>
                            </ul>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Fechar
                            </Button>
                            <Button className="btn-enviar" variant="primary" onClick={createRating}>
                                Enviar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        :
        <div>
            <Loading />
        </div>
    )
}

export default DetalhesProduto