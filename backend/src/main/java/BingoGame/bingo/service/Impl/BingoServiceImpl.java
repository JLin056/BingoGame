package BingoGame.bingo.service.Impl;

import BingoGame.bingo.service.BingoService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import java.util.TreeSet;

@Service
public class BingoServiceImpl implements BingoService {

    /**
     *  隨機產 1~50 內 20個數字，當作賓果數字
     * @return randomNum Bingo Number 的資料集
     */
    public TreeSet<Integer> randomNum(int size){
        TreeSet<Integer> numberSet = new TreeSet<>();
        Random random = new Random();

        // 隨機產（1~50 間) 20 個數
        while(numberSet.size() < size){
            int randomNum = random.nextInt(50) + 1;
            numberSet.add(randomNum);
        }

        return numberSet;
    }

    /**
     * 產生 Bingo 的結果
     * @param map 使用者輸入的值
     * @return bingoMap 賓果的結果
     */
    @Override
    public Map<String, Object> bingo(Map<String, String> map) {
        TreeSet<Integer> bingoNumber = randomNum(25);
        Map<String, Object> bingoMap = new HashMap<>();

        for (Entry<String, String> entry: map.entrySet()) {
            boolean match = false;
            // 確保前端傳進來的值，沒有 null
            if (entry.getValue() == null || entry.getValue().trim().isEmpty()) {
                bingoMap.put(entry.getKey(), match);
                continue;
            }
            String entryValue = entry.getValue().trim();
            if (bingoNumber.contains(Integer.parseInt(entryValue))){
                match = true;
            }
            bingoMap.put(entry.getKey(), match);
        }
        return bingoMap;
    }
}
