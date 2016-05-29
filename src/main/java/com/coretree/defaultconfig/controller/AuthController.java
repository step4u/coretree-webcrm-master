package com.coretree.defaultconfig.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AuthController {
	@RequestMapping(value = "/main/{val}")
	public String Auth(@PathVariable("val") String val, Model model) {
		model.addAttribute("name", val);
		return "login";
	}
}
