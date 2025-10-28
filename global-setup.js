const { cleanupTestData } = require('./playwright/support/database')

module.exports = async () => {
    console.log('Limpando os dados de teste antes da execução...')
    cleanupTestData()
    console.log('Limpeza concluída com sucesso.')
}