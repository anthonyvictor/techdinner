export class NotImplementedError extends Error{
    constructor(){
        let message = 'Não Implementado!'
        super(message)
        this.name = 'NaoImplementadoErro'
        alert(message)
    }
}