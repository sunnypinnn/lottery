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

    // 修改初始化獎品列表的部分
    const initialPrizes = [
        { name: "韓國雙人來回機票", quantity: 1 },
        { name: "膠囊寵物自動餵食器", quantity: 1 },
        { name: "大大渦流飲水機", quantity: 1 },
        { name: "訂單免單", quantity: 1 },
        { name: "寵物拍立得", quantity: 1 },
        { name: "陪陪肉肉一年份", quantity: 1 },
        { name: "陪陪貓泥一年份", quantity: 1 },
        { name: "陪陪肉肉半年份", quantity: 3 },
        { name: "陪陪貓泥半年份", quantity: 3 },
        { name: "陪陪肉肉組", quantity: 5 },
        { name: "陪陪肉肉組", quantity: 5 },
        { name: "官網免運券", quantity: 20 },
        { name: "官網100元折扣券", quantity: 10 }
    ];

    // 修改初始化函數
    // 將原本的 for 循環替換為：
    prizesContainer.innerHTML = ''; // 清空容器
    initialPrizes.forEach((prize, index) => {
        const prizeDiv = createPrizeInput(index + 1);
        prizeDiv.querySelector('.prize-name').value = prize.name;
        prizeDiv.querySelector('.prize-quantity').value = prize.quantity;
        prizesContainer.appendChild(prizeDiv);
    });

    // 在獎品列表區域添加新增按鈕
    const addPrizeButton = document.createElement('button');
    addPrizeButton.className = 'add-prize-button';
    addPrizeButton.innerHTML = '<i class="fas fa-plus"></i> 新增獎品';
    
    // 將按鈕插入到獎品列表區域的最後
    const prizeGroup = document.querySelector('.input-group:last-child');
    prizeGroup.appendChild(addPrizeButton);

    // 綁定新增按鈕點擊事件
    addPrizeButton.addEventListener('click', () => {
        const nextIndex = document.querySelectorAll('.prize-input').length + 1;
        const newPrize = createPrizeInput(nextIndex);
        prizesContainer.appendChild(newPrize);
    });

    // 創建歷史記錄區域
    const historySection = document.createElement('div');
    historySection.className = 'history-section';
    historySection.innerHTML = `
        <h2>抽獎歷史記錄</h2>
        <div class="history-list"></div>
    `;
    document.querySelector('.container').appendChild(historySection);

    // 創建結果顯示容器
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'lottery-results';
    resultsContainer.innerHTML = `
        <div class="results-content">
            <h2>抽獎結果</h2>
            <div class="results-list"></div>
            <button class="close-results">關閉</button>
        </div>
    `;
    document.body.appendChild(resultsContainer);

    // 綁定關閉按鈕事件
    resultsContainer.querySelector('.close-results').addEventListener('click', () => {
        resultsContainer.classList.remove('show');
    });

    // 抽獎按鈕點擊事件
    document.getElementById('start-lottery').addEventListener('click', function() {
        // 檢查是否有足夠的序號
        const numbers = document.getElementById('lottery-numbers').value
            .split(/[,，]/)
            .map(n => n.trim())
            .filter(n => n);

        const excludedNumbers = document.getElementById('excluded-numbers').value
            .split(/[,，]/)
            .map(n => n.trim())
            .filter(n => n);

        const validNumbers = numbers.filter(n => !excludedNumbers.includes(n));

        // 獲取獎品資訊
        const prizes = [];
        document.querySelectorAll('.prize-input').forEach(div => {
            const name = div.querySelector('.prize-name').value;
            const quantity = parseInt(div.querySelector('.prize-quantity').value);
            if (name && quantity > 0) {
                prizes.push({ name, quantity });
            }
        });

        // 檢查是否有足夠的序號和獎品
        if (validNumbers.length === 0) {
            alert('請輸入抽獎序號！');
            return;
        }

        if (prizes.length === 0) {
            alert('請設定獎品！');
            return;
        }

        // 計算總需要抽出的數量
        const totalNeeded = prizes.reduce((sum, prize) => sum + prize.quantity, 0);
        if (validNumbers.length < totalNeeded) {
            alert(`序號數量不足！需要 ${totalNeeded} 個，但只有 ${validNumbers.length} 個有效序號。`);
            return;
        }

        // 進行抽獎
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

    // 產生名單相關代碼
    const generateButton = document.getElementById('generate-numbers');
    const generateModal = document.getElementById('generate-modal');
    
    // 檢查元素是否存在
    if (!generateButton || !generateModal) {
        console.error('找不到產生名單相關元素');
        return;
    }

    const modalCancel = generateModal.querySelector('.modal-cancel');
    const modalConfirm = generateModal.querySelector('.modal-confirm');

    // 顯示產生名單的彈窗
    generateButton.addEventListener('click', (e) => {
        e.preventDefault();  // 防止默認行為
        e.stopPropagation();  // 防止事件冒泡
        console.log('點擊產生名單按鈕');
        generateModal.style.display = 'flex';  // 直接設置 display
        generateModal.classList.add('show');
    });

    // 關閉彈窗
    modalCancel.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('點擊取消按鈕');
        generateModal.style.display = 'none';
        generateModal.classList.remove('show');
    });

    // 點擊彈窗背景關閉
    generateModal.addEventListener('click', (e) => {
        if (e.target === generateModal) {
            generateModal.style.display = 'none';
            generateModal.classList.remove('show');
        }
    });

    // 產生名單
    modalConfirm.addEventListener('click', () => {
        console.log('點擊確認按鈕');  // 添加日誌
        const prefix = document.getElementById('prefix').value;
        const startNum = parseInt(document.getElementById('start-num').value);
        const endNum = parseInt(document.getElementById('end-num').value);
        const suffix = document.getElementById('suffix').value;

        // 檢查起始和結束數字
        if (isNaN(startNum) || isNaN(endNum)) {
            alert('請輸入有效的數字範圍！');
            return;
        }

        if (endNum < startNum) {
            alert('結束數字必須大於或等於起始數字！');
            return;
        }

        if (endNum - startNum > 1000) {
            if (!confirm('你確定要產生超過1000個序號嗎？')) {
                return;
            }
        }

        // 產生序號
        const numbers = [];
        const digits = endNum.toString().length;
        for (let i = startNum; i <= endNum; i++) {
            const num = i.toString().padStart(digits, '0');
            numbers.push(`${prefix}${num}${suffix}`);
        }

        // 將序號填入文本框
        const lotteryNumbers = document.getElementById('lottery-numbers');
        const existingNumbers = lotteryNumbers.value.trim();
        lotteryNumbers.value = existingNumbers 
            ? existingNumbers + '，' + numbers.join('，')
            : numbers.join('，');

        // 關閉彈窗並清空輸入
        generateModal.classList.remove('show');
        document.getElementById('prefix').value = '';
        document.getElementById('start-num').value = '';
        document.getElementById('end-num').value = '';
        document.getElementById('suffix').value = '';
    });
}); 