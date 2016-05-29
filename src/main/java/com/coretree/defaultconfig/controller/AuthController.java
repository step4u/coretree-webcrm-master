package com.coretree.defaultconfig.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AuthController {
	@RequestMapping(value = "/login.html")
	public String Login(Model model) {
		model.addAttribute("name", "..........");
		return "login";
	}
	
	@RequestMapping(value = "/logoutr.html")
	public String Logout(Model model) {
		model.addAttribute("name", "Logout");
		return "login";
	}
}
