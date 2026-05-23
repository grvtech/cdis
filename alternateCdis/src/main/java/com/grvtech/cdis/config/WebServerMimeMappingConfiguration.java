package com.grvtech.cdis.config;

import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.boot.autoconfigure.web.servlet.TomcatServletWebServerFactoryCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.MimeMappings;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebServerMimeMappingConfiguration implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        MimeMappings mappings = factory.getMimeMappings();
        mappings.add("mjs", "application/javascript"); // Or "application/javascript"
        factory.setMimeMappings(mappings);
    }
}