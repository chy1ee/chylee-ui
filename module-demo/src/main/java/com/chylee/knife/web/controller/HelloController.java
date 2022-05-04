package com.chylee.knife.web.controller;

import com.chylee.knife.web.controller.event.RequestEvent;
import com.chylee.knife.web.controller.event.ResponseEvent;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("hello")
@Api(tags = "欢迎你使用")
public class HelloController {
    @GetMapping
    @ApiOperation("对你说hello")
    public String a(String name) {
        return "hello " + name;
    }

    @GetMapping("a")
    @ApiOperation(value = "测试不同菜蔬类型1")
    public ResponseEvent<RequestEvent> a(RequestEvent reqEvent) {
        return new ResponseEvent(reqEvent);
    }

    @PostMapping("b")
    @ApiOperation(value = "测试不同菜蔬类型2", notes = "测试ResquestBody")
    public ResponseEvent<RequestEvent> b(@RequestBody RequestEvent reqEvent, String pkk2) {
        System.out.println("**********************" + pkk2);
        return new ResponseEvent(reqEvent);
    }

    @PostMapping("c/{name}")
    @ApiOperation("测试不同菜蔬类型2")
    public ResponseEvent<String> c(@PathVariable String name) {
        return new ResponseEvent(name);
    }

}
