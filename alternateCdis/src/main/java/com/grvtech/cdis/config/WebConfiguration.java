package com.grvtech.cdis.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		System.out.println("=======================================");
		System.out.println("==="+registry.hasMappingForPattern("/webjars/**"));
		System.out.println("=======================================");
		
	    if (!registry.hasMappingForPattern("/webjars/**")) {
	        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	    }
	    
	    
	    System.out.println("=======================================");
		System.out.println("==="+registry.hasMappingForPattern("/webjars/**"));
		System.out.println("=======================================");
	    
	    /*
	    if (!registry.hasMappingForPattern("/**")) {
	        registry.addResourceHandler("/**").addResourceLocations(RESOURCE_LOCATIONS);
	    }
	    */
	}
}
