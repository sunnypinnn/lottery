document.addEventListener('DOMContentLoaded', function() {
    // 生成獎品輸入欄位
    const prizesContainer = document.getElementById('prizes-container');
    
    // 創建獎品輸入行
    function createPrizeInput(index) {
        const prizeDiv = document.createElement('div');
        prizeDiv.className = 'prize-input';
        prizeDiv.innerHTML = `
            <input type="text" 
                class="prize-name" 
                placeholder="請輸入獎品名稱"
                value="獎品 ${index}"
            >
            <div class="prize-quantity-wrapper">
                <input type="number" 
                    class="prize-quantity" 
                    min="1" 
                    value="1"
                    title="獎品數量"
                >
                <div class="prize-quantity-controls">
                    <button class="prize-quantity-up" title="增加數量">▲</button>
                    <button class="prize-quantity-down" title="減少數量">▼</button>
                </div>
            </div>
            <button class="delete-btn" title="刪除此獎項">
                <i class="fas fa-times"></i>
            </button>
        `;

        // 綁定數量控制按鈕事件
        const quantityInput = prizeDiv.querySelector('.prize-quantity');
        const upBtn = prizeDiv.querySelector('.prize-quantity-up');
        const downBtn = prizeDiv.querySelector('.prize-quantity-down');

        upBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });

        downBtn.addEventListener('click', () => {
            const newValue = parseInt(quantityInput.value) - 1;
            if (newValue >= 1) {
                quantityInput.value = newValue;
            }
        });

        // 綁定刪除按鈕事件
        const deleteBtn = prizeDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prizeDiv.style.opacity = '0';
            setTimeout(() => {
                prizeDiv.remove();
            }, 300);
        });

        return prizeDiv;
    }

    // 初始化獎品列表
    for (let i = 1; i <= 10; i++) {
        prizesContainer.appendChild(createPrizeInput(i));
    }

    // 創建歷史記錄區域
    const historySection = document.createElement('div');
    historySection.className = 'history-section';
    historySection.innerHTML = `
        <h2>抽獎歷史記錄</h2>
        <div class="history-list"></div>
    `;
    document.querySelector('.container').appendChild(historySection);

    // 抽獎按鈕點擊事件
    document.getElementById('start-lottery').addEventListener('click', function() {
        // 獲取所有獎品資訊
        const prizes = [];
        document.querySelectorAll('.prize-input').forEach(div => {
            const name = div.querySelector('.prize-name').value;
            const quantity = parseInt(div.querySelector('.prize-quantity').value);
            prizes.push({ name, quantity });
        });

        // 獲取抽獎序號
        const numbers = document.getElementById('lottery-numbers').value
            .split(/[,，]/)
            .map(n => n.trim())
            .filter(n => n);

        // 獲取排除序號
        const excludedNumbers = document.getElementById('excluded-numbers').value
            .split(/[,，]/)
            .map(n => n.trim())
            .filter(n => n);

        // 過濾掉排除的序號
        const validNumbers = numbers.filter(n => !excludedNumbers.includes(n));

        // 直接顯示結果並保存到歷史記錄
        const result = drawLottery(validNumbers, prizes);
        showLotteryResults(result);
        saveToHistory(result);
    });

    // 抽獎邏輯
    function drawLottery(numbers, prizes) {
        const shuffled = numbers.sort(() => 0.5 - Math.random());
        let currentIndex = 0;
        const results = [];
        const timestamp = new Date().toLocaleString();

        prizes.forEach(prize => {
            const winners = shuffled.slice(currentIndex, currentIndex + prize.quantity);
            if (winners.length > 0) {
                results.push({
                    name: prize.name,
                    quantity: prize.quantity,
                    winners: winners
                });
                currentIndex += prize.quantity;
            }
        });

        return {
            timestamp: timestamp,
            results: results
        };
    }

    // 顯示抽獎結果
    function showLotteryResults(result) {
        const resultsList = document.querySelector('.results-list');
        resultsList.innerHTML = '';
        
        result.results.forEach(prize => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <h3>${prize.name}</h3>
                <p>中獎序號：${prize.winners.join(', ')}</p>
            `;
            resultsList.appendChild(div);
        });

        document.querySelector('.lottery-results').classList.add('show');
    }

    // 保存到歷史記錄
    function saveToHistory(result) {
        const historyList = document.querySelector('.history-list');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        let resultsHtml = '';
        result.results.forEach(prize => {
            resultsHtml += `
                <div class="history-prize">
                    <strong>${prize.name}</strong>: ${prize.winners.join(', ')}
                </div>
            `;
        });

        historyItem.innerHTML = `
            <div class="history-header">
                <span class="history-time">${result.timestamp}</span>
                <button class="delete-history"><i class="fas fa-times"></i></button>
            </div>
            <div class="history-content">
                ${resultsHtml}
            </div>
        `;

        // 添加刪除功能
        historyItem.querySelector('.delete-history').addEventListener('click', () => {
            historyItem.remove();
        });

        historyList.insertBefore(historyItem, historyList.firstChild);
    }
}); 