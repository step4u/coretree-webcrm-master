package com.coretree.defaultconfig.controller;

import org.springframework.web.bind.annotation.RequestMapping;

//@Controller
public class IndexController {
	@RequestMapping(value = "/")
	public String Index() {
		return "index";
	}
}
