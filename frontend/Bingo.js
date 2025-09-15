window.onload = function () {
    var callApi = function callApi(url, param) {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            return response.json();
        });
    };

    /*
        隨機產整數（for 隨機填入）

        @params min 最小值

        @params max 最大值

        @return 在最小值與最大值之間的整數
    */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * max) + min;
    }

    /*
        點機隨機填入按鈕，隨機填入數字
    */
    document.getElementById('randomSubmit').addEventListener(
        'click',
        function () {
            const userInput = document.getElementsByClassName('input-answer');

            // 把上一次 bingo 的顏色清掉
            for (let i = 0; i < userInput.length; i++) {
                userInput[i].style.background = 'azure';
            }

            let randomNum = [];
            for (let i = 0; i < userInput.length; i++) {
                let random;
                // 檢查重複
                do {
                    random = getRandomInt(1, 50);
                } while (randomNum.includes(random));

                randomNum.push(random);
                userInput[i].value = random;
            }
        },
        false
    );

    /* 
        算賓果連了幾條線

        @params borderSize 表格的格數/單行(單列)

        @params bingoItem 賓果的格數

        @return 賓果的線數
    */
    function bingoNumber(borderSize, bingoItem) {
        // 判斷是否連線
        let Bingo = 0;

        let isLeftBingo = true;
        let isRightBingo = true;
        for (let i = 0; i < borderSize; i++) {
            // 橫線
            let isRowBingo = true;

            for (let j = borderSize * i + 1; j <= borderSize * (i + 1); j++) {
                if (!bingoItem.includes(j)) {
                    isRowBingo = false;
                    break;
                }
            }
            if (isRowBingo) {
                Bingo += 1;
            }

            // 縱線
            let isColBingo = true;
            for (let j = 0; j < borderSize; j++) {
                let colBingoNum = borderSize * j + i + 1;
                if (!bingoItem.includes(colBingoNum)) {
                    isColBingo = false;
                    break;
                }
            }

            if (isColBingo) {
                Bingo += 1;
            }

            // 左斜線
            let leftBingoNum = i * (borderSize + 1) + 1;
            if (!bingoItem.includes(leftBingoNum)) {
                isLeftBingo = false;
            }

            // 右斜線
            let rightBingoNum = (i + 1) * (borderSize - 1) + 1;
            if (!bingoItem.includes(rightBingoNum)) {
                isRightBingo = false;
            }
        }

        if (isLeftBingo) {
            Bingo += 1;
        }

        if (isRightBingo) {
            Bingo += 1;
        }

        return Bingo;
    }

    document.getElementById('btnSubmit').addEventListener('click', function () {
        // 送出按鈕先禁用
        const submitButton = document.getElementById('btnSubmit');
        submitButton.disabled = true;

        const userInput = document.getElementsByClassName('input-answer');

        // 把上一次 bingo 的顏色清掉
        for (let i = 0; i < userInput.length; i++) {
            userInput[i].style.background = 'azure';
        }

        let userInputObj = {};
        let repeatedValues = [];
        for (let i = 0; i < userInput.length; i++) {
            const inputValue = Number(userInput[i].value);
            // 判斷使用者輸入 非 1-50 整數 或 未輸入 的情境
            if (Number.isNaN(inputValue) || !Number.isInteger(inputValue) || inputValue < 1 || inputValue > 50) {
                swal('注意！', '請輸入 1～50 的整數，並且每格都要填！', 'error');
                submitButton.disabled = false;
                return;
            }

            // 判斷使用者輸入是否重複
            for (let key in userInputObj) {
                if (userInput[i].value == userInputObj[key]) {
                    if (!repeatedValues.includes(inputValue)) {
                        repeatedValues.push(inputValue);
                    }
                }
            }

            // 取得使用者的值
            userInputObj[i + 1] = inputValue;
        }

        if (repeatedValues.length > 0) {
            repeatedValues.sort((a, b) => a - b);
            const repeatNumString = repeatedValues.join(', ');
            swal('重複了！', `不可以重複啦～ 數字 ${repeatNumString} 重複了！！`, 'error');
            submitButton.disabled = false;
            return;
        }

        var param = userInputObj;

        callApi('http://localhost:8080/bingo', param).then(function (response) {
            let bingoItem = [];
            let delayTime = 150;
            // bingo 就改底色，並存 bingo 的 格數
            for (let key in response) {
                if (response[key]) {
                    const getInput = document.getElementById(key);
                    setTimeout(() => {
                        getInput.style.background = '#E6C3C3';
                    }, delayTime);
                    // getInput.style.background = '#E6C3C3';
                    bingoItem.push(parseInt(key));
                    delayTime += 150;
                }
            }

            // 算 Bingo 數
            const allBingoNumber = bingoNumber(5, bingoItem);
            if (allBingoNumber === 0) {
                setTimeout(() => {
                    swal('哭哭', `你沒連成任何一條QQ`, 'info');
                    submitButton.disabled = false;
                }, delayTime + 200);
            } else if (allBingoNumber > 0) {
                setTimeout(() => {
                    swal('啊啊啊', `你中了！！連成 ${allBingoNumber} 條線！！`, 'success');
                    submitButton.disabled = false;
                }, delayTime + 200);
            }
        });
    });
};
