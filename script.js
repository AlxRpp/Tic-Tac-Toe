let currentPlayer = 'circle';
let winner = null;
let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];


function init() {
    render();
}


function render() {
    document.getElementById('content').innerHTML = "";
    let htmlContent = '<table>'; 
    for (let row = 0; row < 3; row++) {
        htmlContent += '<tr>'; 
        for (let col = 0; col < 3; col++) {
            let index = row * 3 + col; 
            let symbol = '';

            if (fields[index] === 'circle') {
                symbol = createAnimatedCircle();
            } else if (fields[index] === 'cross') {
                symbol = createAnimatedCross();
            }
            htmlContent += `<td onclick="handleCellClick(${index}, this)">${symbol}</td>`;
        }
        htmlContent += '</tr>'; 
    }
    htmlContent += '</table>'; 
    document.getElementById('content').innerHTML = htmlContent;
}


function handleCellClick(index, cell) {
    if (fields[index] === null && !winner) { 
        fields[index] = currentPlayer; 
        if (currentPlayer === 'circle') {
            cell.innerHTML = createAnimatedCircle();
            currentPlayer = 'cross';
        } else {
            cell.innerHTML = createAnimatedCross();
            currentPlayer = 'circle'; 
        }
        cell.onclick = null;
        winner = checkForWinner();
        if (winner) {
            drawWinningLine(winner);
        }
    }
}


function checkForWinner() {
    const winningCombinations = [
        [0, 1, 2], // obere Reihe
        [3, 4, 5], // mittlere Reihe
        [6, 7, 8], // untere Reihe
        [0, 3, 6], // linke Spalte
        [1, 4, 7], // mittlere Spalte
        [2, 5, 8], // rechte Spalte
        [0, 4, 8], // diagonale von links oben nach rechts unten
        [2, 4, 6]  // diagonale von rechts oben nach links unten
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination;
        }
    }
    return null;
}


function drawWinningLine(winningCombination) {
    const table = document.querySelector('table');
    const tdElements = table.getElementsByTagName('td');


    const existingLine = document.getElementById('winningLine');
    if (existingLine) {
        existingLine.remove();
    }

    const line = document.createElement('div');
    line.id = 'winningLine'
    line.style.position = 'absolute';
    line.style.backgroundColor = 'white';
    line.style.height = '5px';
    line.style.zIndex = '1';
    line.style.pointerEvents = 'none';

    
    const firstCell = tdElements[winningCombination[0]];
    const lastCell = tdElements[winningCombination[2]];

    const startX = firstCell.getBoundingClientRect().left + window.scrollX + firstCell.offsetWidth / 2;
    const startY = firstCell.getBoundingClientRect().top + window.scrollY + firstCell.offsetHeight / 2;
    const endX = lastCell.getBoundingClientRect().left + window.scrollX + lastCell.offsetWidth / 2;
    const endY = lastCell.getBoundingClientRect().top + window.scrollY + lastCell.offsetHeight / 2;

   
    const length = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

   
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';

    
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    
    document.body.appendChild(line);
}


function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    currentPlayer = 'circle';
    winner = null;
    const existingLine = document.getElementById('winningLine');
    if (existingLine) {
        existingLine.remove();
    }
    render();
}


function createAnimatedCircle() {
    return `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <circle 
                cx="35" cy="35" r="30" 
                stroke="#00B8EE" 
                stroke-width="5" 
                fill="none"
                stroke-dasharray="0 188.4">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0 188.4" 
                    to="188.4 188.4" 
                    dur="0.2s" 
                    fill="freeze"
                />
            </circle>
        </svg>
    `;
}


function createAnimatedCross() {
    return `
        <svg width="80" height="80" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <line 
                x1="15" y1="15" 
                x2="55" y2="55" 
                stroke="#FAC606" 
                stroke-width="5" 
                stroke-dasharray="0 56.57">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0 56.57" 
                    to="56.57 56.57" 
                    dur="0.2s" 
                    fill="freeze"
                />
            </line>
            <line 
                x1="15" y1="55" 
                x2="55" y2="15" 
                stroke="#FAC606" 
                stroke-width="5" 
                stroke-dasharray="0 56.57">
                <animate 
                    attributeName="stroke-dasharray" 
                    from="0 56.57" 
                    to="56.57 56.57" 
                    dur="0.2s" 
                    fill="freeze"
                />
            </line>
        </svg>
    `;
}
