import { isAuthenticated } from './auth.js';

if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.getElementById('generate-report');
    const reportOutput = document.getElementById('report-output');
    const daysFilter = document.getElementById('days-filter');

    generateReportButton.addEventListener('click', () => {
        const days = parseInt(daysFilter.value, 10);
        generateReport(days);
    });

    const generateReport = (days) => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const reportData = products.filter(product => {
            const expiryDate = new Date(product.expiry);
            return expiryDate <= futureDate && expiryDate >= new Date(today);
        });

        reportOutput.innerHTML = '';

        if (reportData.length > 0) {
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headers = ['Nome do Produto', 'Data de Validade'];
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            reportData.forEach(product => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                const expiryCell = document.createElement('td');
                expiryCell.textContent = product.expiry;
                row.appendChild(nameCell);
                row.appendChild(expiryCell);
                tbody.appendChild(row);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            reportOutput.appendChild(table);
        } else {
            reportOutput.textContent = 'Nenhum produto próximo da validade nos próximos ' + days + ' dias.';
        }
    };
});
// Simulando dados de produtos (apenas para exemplo)
var produtos = [
    { nome: "Arroz", categoria: "alimentos", validade: "2024-06-30" },
    { nome: "Sabonete", categoria: "higiene", validade: "2024-07-15" },
    { nome: "Shampoo", categoria: "beleza", validade: "2024-07-10" },
    { nome: "Refrigerante", categoria: "bebidas", validade: "2024-06-25" },
];

function gerarRelatorio() {
    var prazoSelecionado = parseInt(document.getElementById("prazoValidade").value);
    var categoriaSelecionada = document.getElementById("categoria").value;

    // Filtrar produtos próximos da validade conforme o prazo selecionado
    var produtosProximosVencer = produtos.filter(function(produto) {
        var hoje = new Date();
        var validade = new Date(produto.validade);
        var diferencaDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
        return diferencaDias <= prazoSelecionado;
    });

    // Filtrar produtos pelo segundo filtro (categoria)
    if (categoriaSelecionada !== "todos") {
        produtosProximosVencer = produtosProximosVencer.filter(function(produto) {
            return produto.categoria === categoriaSelecionada;
        });
    }

    // Gerar o relatório com base nos produtos filtrados
    var resultadoHTML = "<h3>Relatório de Produtos Próximos da Validade</h3>";
    resultadoHTML += "<p>Filtro: Produtos próximos até " + prazoSelecionado + " dias e categoria: " + categoriaSelecionada + "</p>";
    resultadoHTML += "<ul>";
    produtosProximosVencer.forEach(function(produto) {
        resultadoHTML += "<li>" + produto.nome + " - Categoria: " + produto.categoria + " - Validade: " + produto.validade + "</li>";
    });
    resultadoHTML += "</ul>";

    // Exibir o resultado na div resultadoRelatorio
    document.getElementById("resultadoRelatorio").innerHTML = resultadoHTML;
}
