const solvedBoard = [
    5, 3, 4, 6, 7, 8, 9, 1, 2, 6, 7, 2, 1, 9, 5, 3, 4, 8, 1, 9, 8, 3, 4, 2, 5, 6, 7,
    8, 5, 9, 7, 6, 1, 4, 2, 3, 4, 2, 6, 8, 5, 3, 7, 9, 1, 7, 1, 3, 9, 2, 4, 8, 5, 6,
    9, 6, 1, 5, 3, 7, 2, 8, 4, 2, 8, 7, 4, 1, 9, 6, 3, 5, 3, 4, 5, 2, 8, 6, 1, 7, 9
];

function shuffleBoard(board) {
    let shuffled = [...board];
    let map = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    return shuffled.map(n => map[n - 1]);
}

let currentSolvedBoard = shuffleBoard(solvedBoard);
const inputs = document.querySelectorAll('.sudoku-board input');
const navLinks = document.querySelectorAll('nav .nav_link');

function checkWin() {
    const isAllCorrect = Array.from(inputs).every((input, index) => parseInt(input.value) === currentSolvedBoard[index]);
    if (isAllCorrect) showWinMessage();
}

function colorizeAndSetup() {
    inputs.forEach((input, index) => {
        input.style.backgroundColor = `var(--cell-color-${Math.floor(Math.random() * 4) + 1})`;
        const td = input.parentElement;
        td.style.position = 'relative';

        if (!td.querySelector('.number-picker')) {
            const picker = document.createElement('div');
            picker.className = 'number-picker';
            picker.style.cssText = `display:none; position:absolute; top:-5px; left:110%; background:var(--header-bg, #fff); border:2px solid var(--border-color, #000); grid-template-columns:repeat(3,1fr); gap:2px; padding:4px; z-index:1000; box-shadow:5px 5px 15px rgba(0,0,0,0.4);`;

            for (let i = 1; i <= 9; i++) {
                const pBtn = document.createElement('div');
                pBtn.innerText = i;
                pBtn.style.cssText = `width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid var(--border-color, #000); color:var(--text-color, #000); background:var(--header-bg, #fff); font-size:14px; font-weight:bold;`;
                pBtn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    input.value = i;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    picker.style.display = 'none';
                };
                picker.appendChild(pBtn);
            }
            td.appendChild(picker);
            td.onmouseenter = () => picker.style.display = 'grid';
            td.onmouseleave = () => picker.style.display = 'none';
        }
    });
}

// Логика кнопок по порядку: 0-Save, 1-Restore, 2-Clear, 3-Step, 4-Solve
if (navLinks[0]) navLinks[0].onclick = (e) => {
    e.preventDefault();
    localStorage.setItem('sudoku-save', JSON.stringify({ values: Array.from(inputs).map(i => i.value), solution: currentSolvedBoard }));
    alert('Сохранено!');
};

if (navLinks[1]) navLinks[1].onclick = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem('sudoku-save'));
    if (saved) {
        currentSolvedBoard = saved.solution;
        inputs.forEach((input, i) => {
            input.value = saved.values[i];
            input.classList.toggle('correct', input.value && parseInt(input.value) === currentSolvedBoard[i]);
        });
    }
};

if (navLinks[2]) navLinks[2].onclick = (e) => {
    e.preventDefault();
    inputs.forEach(i => { i.value = ''; i.classList.remove('correct'); });
};

if (navLinks[3]) navLinks[3].onclick = (e) => {
    e.preventDefault();
    const empty = Array.from(inputs).map((input, i) => input.value === '' ? i : null).filter(i => i !== null);
    if (empty.length > 0) {
        const idx = empty[Math.floor(Math.random() * empty.length)];
        inputs[idx].value = currentSolvedBoard[idx];
        inputs[idx].classList.add('correct');
        checkWin();
    }
};

if (navLinks[4]) navLinks[4].onclick = (e) => {
    e.preventDefault();
    inputs.forEach((input, i) => { input.value = currentSolvedBoard[i]; input.classList.add('correct'); });
    showWinMessage();
};

inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        let val = e.target.value.slice(-1);
        if (!/[1-9]/.test(val)) val = '';
        e.target.value = val;
        input.classList.toggle('correct', val && parseInt(val) === currentSolvedBoard[index]);
        checkWin();
    });
});

// Тема
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.onclick = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        document.getElementById('sun-icon').style.display = isDark ? 'block' : 'none';
        document.getElementById('moon-icon').style.display = isDark ? 'none' : 'block';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
}

function showWinMessage() {
    if (document.getElementById('win-banner')) return;
    const winDiv = document.createElement('div');
    winDiv.id = 'win-banner';
    winDiv.innerHTML = 'YOU WIN!';
    winDiv.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#481d00; color:#fff; padding:40px 80px; font-size:60px; font-weight:bold; border-radius:20px; z-index:10000; box-shadow:0 0 100px rgba(0,0,0,0.8);`;
    document.body.appendChild(winDiv);
    setTimeout(() => winDiv.remove(), 4000);
}

window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('sun-icon').style.display = 'block';
        document.getElementById('moon-icon').style.display = 'none';
    }
    colorizeAndSetup();
};