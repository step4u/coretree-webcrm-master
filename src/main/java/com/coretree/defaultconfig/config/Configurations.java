package com.coretree.defaultconfig.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="uc")
public class Configurations {
	private String pbxip;
	
	
	public void setPbxip(String pbxip) {
		System.err.println(pbxip);
		this.pbxip = pbxip;
	}
	
	public String getPbxip() {
		System.err.println(this.pbxip);
		return this.pbxip;
	}
}
