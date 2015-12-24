package com.coretree.defaultconfig.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class StaticResourceConfiguration extends WebMvcConfigurerAdapter {
	private static final Logger LOG = LoggerFactory.getLogger(StaticResourceConfiguration.class);
	private String staticPath = "file:///D:/spring_boot_test/";
	
	@Override
	 public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    if(staticPath != null) {
	        LOG.info("Serving static content from " + staticPath);
	        registry.addResourceHandler("/media/**").addResourceLocations(staticPath);
	    }
	 }

	 // see https://stackoverflow.com/questions/27381781/java-spring-boot-how-to-map-my-my-app-root-to-index-html
//	 @Override
//	 public void addViewControllers(ViewControllerRegistry registry) {
//	    registry.addViewController("/").setViewName("redirect:/index.html");
//	 }
}
