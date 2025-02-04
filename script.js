document.addEventListener('DOMContentLoaded', function() {
    const prizesContainer = document.getElementById('prizes-container');
    const wheelContainer = document.getElementById('wheel-container');

    // 新增獎品列表功能
    function createPrizeRow() {
        const div = document.createElement('div');
        div.className = 'prize-row';
        div.innerHTML = `
            <input type="text" class="prize-name" placeholder="獎品名稱">
            <input type="number" class="prize-quantity" min="1" value="1" placeholder="數量">
            <button class="remove-prize-btn"><i class="fas fa-times"></i></button>
        `;

        // 綁定刪除按鈕事件
        const removeBtn = div.querySelector('.remove-prize-btn');
        removeBtn.addEventListener('click', function() {
            div.remove();
        });

        return div;
    }

    // 綁定新增獎品按鈕事件
    document.querySelector('.add-prize-btn').addEventListener('click', function() {
        prizesContainer.appendChild(createPrizeRow());
    });

    // 抽獎按鈕點擊事件
    document.getElementById('start-lottery').addEventListener('click', function() {
        wheelContainer.style.display = 'flex';
        const wheel = document.querySelector('.wheel');
        const rotation = 3600 + Math.floor(Math.random() * 360);
        wheel.style.transform = `rotate(${rotation}deg)`;
        
        setTimeout(() => {
            wheelContainer.style.display = 'none';
            wheel.style.transform = 'rotate(0deg)';
        }, 4000);
    });
}); 