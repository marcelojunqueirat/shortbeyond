// import { test, expect } from '@playwright/test'

//arquivo customizado fixtures/index.js que importa o test e expect do playwright mais as camadas de serviço auth e links como se fossem "nativas" do framework
import { test, expect } from '../../support/fixtures'
import { getUser } from '../../support/factories/user'

test.describe('POST /auth/login', () => {
    test('deve fazer login com sucesso', async ({ auth }) => {
        const user = getUser()
        const respCreate = await auth.createUser(user)
        expect(respCreate.status()).toBe(201)

        const response = await auth.login(user)
        const body = await response.json()

        expect(response.status()).toBe(200)
        expect(body).toHaveProperty('message', 'Login realizado com sucesso')
        expect(body.data).toHaveProperty('token')
        expect(body.data.user).toHaveProperty('id')
        expect(body.data.user).toHaveProperty('name', user.name)
        expect(body.data.user).toHaveProperty('email', user.email)
        expect(body.data.user).not.toHaveProperty('password')
    })

    test('não deve logar com senha incorreta', async ({ auth }) => {
        const user = getUser()
        const respCreate = await auth.createUser(user)
        expect(respCreate.status()).toBe(201)

        const response = await auth.login({ ...user, password: '123456' })
        const body = await response.json()

        expect(response.status()).toBe(401)
        expect(body).toHaveProperty('message', 'Credenciais inválidas')
    })

    test('não deve logar com email que não foi cadastrado', async ({ auth }) => {
        const user = {
            email: '404@marcelo.qa',
            password: 'pwd123'
        }

        const response = await auth.login(user)
        const body = await response.json()

        expect(response.status()).toBe(401)
        expect(body).toHaveProperty('message', 'Credenciais inválidas')
    })

    test('não deve logar quando o email não é informado', async ({ auth }) => {
        const user = {
            password: 'pwd123'
        }

        const response = await auth.login(user)
        const body = await response.json()

        expect(response.status()).toBe(400)
        expect(body).toHaveProperty('message', 'O campo \'Email\' é obrigatório')
    })

    test('não deve logar quando o senha não é informada', async ({ auth }) => {
        const user = {
            email: 'marcelo@teste.com'
        }

        const response = await auth.login(user)
        const body = await response.json()

        expect(response.status()).toBe(400)
        expect(body).toHaveProperty('message', 'O campo \'Password\' é obrigatório')
    })
})