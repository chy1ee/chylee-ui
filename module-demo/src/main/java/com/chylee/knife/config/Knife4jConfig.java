package com.chylee.knife.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseBuilder;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class Knife4jConfig {
    @Bean(value = "defaultApi2")
    public Docket defaultApi2() {
        List<Response> responseList = new ArrayList<>();
        responseList.add(new ResponseBuilder().code("0").description("成功").build());
        responseList.add(new ResponseBuilder().code("0001").description("超时").build());
        responseList.add(new ResponseBuilder().code("9999").description("请联系管理员").build());
        Docket docket=new Docket(DocumentationType.OAS_30)
                .apiInfo(new ApiInfoBuilder()
                        //.title("swagger-bootstrap-ui-demo RESTful APIs")
                        .description("Chylee100J API调试器")
                        .termsOfServiceUrl("http://www.chylee.top/")
                        .contact(new Contact("chylee", "http://www.chylee.top", "chylee@aliyun.com"))
                        .version("1.0.0")
                        .build())
                //分组名称
                //.groupName("2.X版本")
                .select()
                //这里指定Controller扫描包路径
                .apis(RequestHandlerSelectors.basePackage("com.chylee.knife.web.controller"))
                .paths(PathSelectors.any())
                .build()
                .securitySchemes(securitySchemes())
                .securityContexts(securityContexts())
                .useDefaultResponseMessages(false)
                .globalResponses(HttpMethod.GET, responseList)
                .globalResponses(HttpMethod.POST, responseList);
        return docket;
    }

    private List<SecurityContext> securityContexts() {
        List<SecurityContext> securityContextList = new ArrayList<>();
        List<SecurityReference> securityReferenceList = new ArrayList<>();
        securityReferenceList.add(new SecurityReference("fzbg-api-token", scopes()));
        securityContextList.add(SecurityContext
                .builder()
                .securityReferences(securityReferenceList)
                .forPaths(PathSelectors.any())
                .build()
        );
        return securityContextList;
    }

    private AuthorizationScope[] scopes() {
        return new AuthorizationScope[]{new AuthorizationScope("global", "accessAnything")};
    }

    private List<SecurityScheme> securitySchemes() {
        List<SecurityScheme> apiKeyList = new ArrayList<>();
        apiKeyList.add(new ApiKey("fzbg-api-token", "fzbgApiToken", "header"));
        return apiKeyList;
    }

    @Bean(value = "defaultApi1")
    public Docket defaultApi1() {
        Docket docket=new Docket(DocumentationType.OAS_30)
                .apiInfo(new ApiInfoBuilder()
                        //.title("swagger-bootstrap-ui-demo RESTful APIs")
                        .description("# swagger-bootstrap-ui-demo RESTful APIs")
                        .termsOfServiceUrl("http://www.xx.com/")
                        .contact(new Contact("chylee", "http://www.chylee.top", "chylee@aliyun.com"))
                        .version("1.0")
                        .build())
                //分组名称
                .groupName("group-a")
                .select()
                //这里指定Controller扫描包路径
                .apis(RequestHandlerSelectors.basePackage("com.chylee.knife.web.controller.a"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }
}
