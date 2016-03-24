package com.coretree.defaultconfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
    	SpringApplication.run(Application.class, args);
/*    	
    	for(int i = 1 ; i < args.length ; i++) {
    		if (args[i].contains("--")) {
    			switch (args[i]) {
    				case "--ip":
    					
    					break;
    			}
    		}
        	System.err.println("args[" + i + "] : " + args[i]);
    	}
*/
    }
}
