## Playwright 🎭

### Ambiente (via podman)

sudo podman play kube shortbeyond.yaml  
1 - provisiona todo o ambiente configurado no yaml.  

sudo podman pod ps  
2 - lista os pods em execução (no caso do yaml configurado será apenas um: shortbeyond)

sudo podman pod stop (start) shortbeyond
3 - para ou executa o pod.


### Comandos
npx playwright test  
npx playwright test --ui  
1 - Executa os testes com ou sem interface gráfica (roda os testes da pasta configurada em - playwright.config.js > testDir)  

npx playwright test --reporter=list ou --reporter=dot
2 - Relatórios em lista ou em pontos

## Artillery (testes de performance)

### Exemplos

duration: 30  
1 - duration representa o tempo do teste

arrivalRate: 5  
2 - arrivalRate significa a quantidade de requisções por segundo, ou seja 5 requisições por segundo

weight: 80 / 20  
3 - Informa em % quanto de teste será dedicado ao cenário. Caso 80, por exemplo, indica que 80% da execução será dedicada a aquele cenário.  

### Comandos

npm install artillery@latest -D  
1 - Instalar artillery como dependência de desenvolvimento.  

npx artillery --version  
2 - Verificar versão do artillery instalada.  

npx artillery run performance/tests/NOME_ARQUIVO_TESTE
Executa o teste de performance.

npx artillery run performance/tests/NOME_ARQUIVO_TESTE --output performance/reports/cadastro.json
Executa o teste de performance e gera o relatório na pasta informada.

