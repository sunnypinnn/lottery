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
            <input type="number" 
                class="prize-quantity" 
                min="1" 
                value="1"
                title="獎品數量"
            >
            <button class="delete-btn" title="刪除此獎項">
                <i class="fas fa-times"></i>
            </button>
        `;

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
        // 顯示輪盤
        wheelContainer.style.display = 'flex';
        
        // 獲取輪盤元素
        const wheel = document.querySelector('.wheel');
        
        // 隨機旋轉角度 (3600度是10圈，加上隨機角度)
        const rotation = 3600 + Math.floor(Math.random() * 360);
        
        // 設置輪盤旋轉
        wheel.style.transform = `rotate(${rotation}deg)`;
        
        // 4秒後隱藏輪盤
        setTimeout(() => {
            wheelContainer.style.display = 'none';
            wheel.style.transform = 'rotate(0deg)';
        }, 4000);
    });
}); 