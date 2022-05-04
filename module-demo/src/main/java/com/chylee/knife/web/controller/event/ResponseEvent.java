package com.chylee.knife.web.controller.event;

import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiParam;

public class ResponseEvent<T> {
    @ApiModelProperty("错误码")
    @ApiParam(required = true)
    public String errorCode;
    @ApiModelProperty("错误信息")
    public String errorMessage;
    public T data;

    public ResponseEvent(T reqEvent) {
        this.errorCode = "0";
        this.data = reqEvent;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
