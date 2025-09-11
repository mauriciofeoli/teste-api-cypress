/// <reference types= "cypress"/>
import contrato from '../Contratos/produtos.contratos'
describe('Teste de API em produtos', () => {
    let token
    beforeEach(() =>{
        cy.token('fulano@qa.com' , 'teste').then(tkm =>{
            token = tkm
        })
    });
    it.only('Deve validar contrato de produtos com sucesso', () => {
        cy.request('produtos').then(response =>{
            return contrato.validateAsync(response.body)
        })
    });
    it('Deve listar produtos - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).should((response) =>{
            expect(response.status).equal(200)
            expect(response.body).to.have.property('produtos')
        })
    });
    it('Deve cadastrar produtos - POST', () => {
        let produto = 'Produto serverest ' + Math.floor(Math.random() * 10000000000000)
        cy.cadastrarproduto(token, produto, 45, 'Fone', 30)
        .should((response) =>{
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
    });
    it('Deve validar mensagem de produto já cadastrado - POST', () => {
        cy.cadastrarproduto(token, 'Fone JBL', 95,'Fone', 45 )
        .should((response) =>{
            expect(response.status).equal(400)
            expect(response.body.message).equal('Já existe produto com esse nome')
        })
    });
    it('Deve editar um produto com sucesso - PUT', () => {
       let produto = 'Produto serverest Editado' + Math.floor(Math.random() * 10000000000000)
        cy.cadastrarproduto(token, produto, 45, 'Produto Editado', 30)
        .then(response =>{
            let id = response.body._id
            cy.request({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: {authorization: token},
            body:{ 
            "nome": produto,
            "preco": 46,
            "descricao": "editado",
            "quantidade": 100
            }
        }).should(response =>{
           expect(response.body.message).to.equal('Registro alterado com sucesso')
           expect(response.status).to.equal(200)
        })
        })
    });
    it('Deve deletar um produto com sucesso - DELETE', () => {
        cy.cadastrarproduto(token, 'Produto a ser deletado', 50, 'Para deletar', 50)
        .then(response =>{
            let id =response.body._id
            cy.request({
                method: 'DELETE',
                url:`produtos/${id}`,
                headers:{authorization: token}
            }).should(response =>{
           expect(response.body.message).to.equal('Registro excluído com sucesso')
           expect(response.status).to.equal(200)
            })
        })
    });
});