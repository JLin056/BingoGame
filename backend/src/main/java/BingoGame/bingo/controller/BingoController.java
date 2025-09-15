package BingoGame.bingo.controller;

import BingoGame.bingo.service.BingoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500/"})
public class BingoController {

    @Autowired
    BingoService bingoService;

    /**
     * @param map
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/bingo")
    public ResponseEntity<Map<String, Object>> bingo(@RequestBody
                                                     Map<String, String> map) {
        return new ResponseEntity<>(bingoService.bingo(map), HttpStatus.OK);
    }
}
