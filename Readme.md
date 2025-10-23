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


