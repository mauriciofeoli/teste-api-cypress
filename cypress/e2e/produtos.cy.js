/// <reference types= "cypress"/>

describe('Testes de API em Produtos', () => {

    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn =>{
            token = tkn
        })
    });


    it('Listar produtos - GET', () =>{
        cy.request({
            method: 'GET',
            url: 'produtos',
        }).should((response) => {
            expect(response.status).equal(200)
            expect(response.body).to.have.property('produtos')
        })
    });

    it.only('Cadastrar produto - POST', () =>{
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 10000000000000)
        cy.request({
            method: 'POST',
            url: 'produtos',
            headers: {authorization: token},
            body: {
                //TODO: Criar produto dinamicamente 
                    "nome": produto,
                    "preco": 4,
                    "descricao": "USB tipo C",
                    "quantidade": 100
                }
        }).should((response) => {
            expect(response.status).equal(201)
            expect(response.message).equal('Cadastro realizado com sucesso')
        })
    });

});