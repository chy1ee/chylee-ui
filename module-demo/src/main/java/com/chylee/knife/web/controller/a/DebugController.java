package com.chylee.knife.web.controller.a;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("debug")
public class DebugController {
    @GetMapping
    public String debug(String debug) {
        return debug;
    }
}
