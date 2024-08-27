const { exec } = require('child_process');

// Função para rodar um comando no terminal
function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Erro: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Função para rodar análise de código
async function analyzeCode() {
  try {
    console.log('Analisando o código...');
    await runCommand('eslint src/**/*.ts --fix');
    console.log('Análise e correção automática completadas.');
  } catch (error) {
    console.error(error);
  }
}

// Função para rodar os testes unitários com Jasmine
async function runTests() {
  try {
    console.log('Executando testes unitários com Jasmine...');
    const testResult = await runCommand('ng test --watch=false --code-coverage');
    console.log(testResult);

    // Verificando cobertura de código
    const coverageThreshold = 80; // Exemplo de limite mínimo de cobertura
    const coverageReport = await runCommand('cat coverage/your-project-name/index.html'); // Ajuste o caminho conforme necessário
    const coverageMatch = coverageReport.match(/<span class="strong">All files<\/span>[\s\S]*?(\d+\.\d+)%/);

    if (coverageMatch && parseFloat(coverageMatch[1]) < coverageThreshold) {
      console.log(`Cobertura de código abaixo de ${coverageThreshold}%. Usando Copilot para corrigir...`);
      // Aqui você pode invocar o Copilot ou outra solução para tentar corrigir o código
      await runCommand('copilot-cli fix src/**/*.ts');
      console.log('Código corrigido com Copilot. Executando testes novamente...');
      await runTests(); // Rodar os testes novamente após a correção
    } else {
      console.log('Cobertura de código atingida com sucesso.');
    }
  } catch (error) {
    console.error(error);
  }
}

// Função principal que executa o script completo
async function main() {
  await analyzeCode();
  await runTests();
}

main();
