import styles from '../css_components/Form.module.css'

import Input from "../layout/Inputs"
import Button from "../layout/Button"
import LinkButton from '../../components/layout/LinkButton'
import Dropdown from "../layout/Dropdown"
import { useState, useEffect } from "react"
import { BiX } from 'react-icons/bi'

const Form = ({ id, handleSubmit, content, btnText, classNameButton, selectOptions, selectTextDefault, btnVoltar }) => {
    const [insumo, setInsumo] = useState({})
    const dataAtual = new Date().toISOString().split('T')[0]

    
    useEffect(() => {
        if(content){
            setInsumo(content)
            
            if(content.validade) {
                content.validade = content.validade.split('T')[0]
            }
        }
    }, [content])

    function deleteDate() {
        const inputDate = document.querySelector('#validade')
        inputDate.value = ""

        insumo.validade = ""
        setInsumo(insumo)
    }
    
    function handleChange(e) {
        insumo[e.target.name] = e.target.value
        setInsumo(insumo)
    }

    function submit(e) {
        e.preventDefault()
        handleSubmit(insumo)
    }
        
    return (
        <form id={ id && (id) } className={ styles.form } onSubmit={ submit }>
            <Input type="text"
                name="name"
                id="nome"
                htmlFor="nome"
                textLabel={"Nome:"}
                value={ content && content.name }
                handleOnChange={ handleChange }
                required
            />
            <Input type="number"
                name="emEstoque"
                id="quantidade_inicial"
                min="0"
                htmlFor="quantidade_inicial"
                textLabel={ "Quantidade em estoque:" }
                value={ content && content.emEstoque }
                handleOnChange={ handleChange }
                required
            />
            <Input type="number"
                name="quantidadeMin"
                id="quantidade_minima"
                min="0"
                htmlFor="quantidade_minima"
                textLabel={ "Quantidade Mínima:" }
                value={ content && content.quantidadeMin }
                handleOnChange={ handleChange }
                required
            />
            <div className={ styles.dateInput }>
                <Input type="date"
                    name="validade"
                    id="validade"
                    htmlFor="validade"
                    textLabel={ "Validade:" }
                    value={ content && content.validade }
                    min={ dataAtual }
                    handleOnChange={ handleChange }
                />

                <Button type="button" className="btnClear" buttonClickEvent={ deleteDate }>
                    <BiX />
                </Button>
            </div>
            <Dropdown options={ selectOptions }
                handleOnChange={ handleChange }
                textDefault={ selectTextDefault }
                optionSelected={ content && content.categoria }
                textSwitchValue="Adicionar Categoria"
                allowLabel
                label="Categorias"
                name="categoria"
            />
            <div className={ styles.hudBtn }>
                <LinkButton to={ btnVoltar } classNameButton="btnBack">Voltar</LinkButton>
                <Button
                    type="submit"
                    className={ classNameButton }
                    buttonSubmitEvent= {submit }>
                        
                    { btnText }
                </Button>
            </div>
        </form>
    )
}

export default Form