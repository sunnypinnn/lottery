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

    // 隱藏輪盤
    const wheelContainer = document.getElementById('wheel-container');
    wheelContainer.style.display = 'none';

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
            .split(/[,，]/)  // 同時支援中文逗號和英文逗號
            .map(n => n.trim())
            .filter(n => n);

        // 獲取排除序號
        const excludedNumbers = document.getElementById('excluded-numbers').value
            .split(/[,，]/)  // 同時支援中文逗號和英文逗號
            .map(n => n.trim())
            .filter(n => n);

        // 過濾掉排除的序號
        const validNumbers = numbers.filter(n => !excludedNumbers.includes(n));

        // 顯示輪盤
        wheelContainer.style.display = 'flex';
        
        // 強制重繪
        wheelContainer.offsetHeight;

        const wheel = document.querySelector('.wheel');
        
        // 確保初始狀態
        wheel.style.transform = 'rotate(0deg)';
        
        // 強制重繪
        wheel.offsetHeight;
        
        // 設定新的旋轉角度
        const rotation = 3600 + Math.floor(Math.random() * 360);
        wheel.style.transform = `rotate(${rotation}deg)`;

        // 4秒後顯示結果
        setTimeout(() => {
            wheelContainer.style.display = 'none';
            
            // 重置輪盤位置（延遲執行以確保動畫完成）
            setTimeout(() => {
                wheel.style.transition = 'none';  // 暫時關閉過渡效果
                wheel.style.transform = 'rotate(0deg)';
                wheel.offsetHeight;  // 強制重繪
                wheel.style.transition = '';  // 恢復過渡效果
            }, 100);
            
            // 顯示抽獎結果
            showLotteryResults(validNumbers, prizes);
        }, 4000);
    });

    // 創建結果顯示區域
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'lottery-results';
    resultsDiv.innerHTML = `
        <div class="results-content">
            <h2>抽獎結果</h2>
            <div class="results-list"></div>
            <button class="close-results">關閉</button>
        </div>
    `;
    document.body.appendChild(resultsDiv);

    // 關閉結果視窗
    resultsDiv.querySelector('.close-results').addEventListener('click', () => {
        resultsDiv.classList.remove('show');
    });

    // 顯示抽獎結果
    function showLotteryResults(numbers, prizes) {
        const resultsList = document.querySelector('.results-list');
        resultsList.innerHTML = '';
        
        // 打亂序號順序
        const shuffled = numbers.sort(() => 0.5 - Math.random());
        let currentIndex = 0;

        // 分配獎品
        prizes.forEach(prize => {
            const winners = shuffled.slice(currentIndex, currentIndex + prize.quantity);
            if (winners.length > 0) {
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `
                    <h3>${prize.name}</h3>
                    <p>中獎序號：${winners.join(', ')}</p>
                `;
                resultsList.appendChild(div);
                currentIndex += prize.quantity;
            }
        });

        // 顯示結果視窗
        document.querySelector('.lottery-results').classList.add('show');
    }
}); 