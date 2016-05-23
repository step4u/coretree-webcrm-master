package com.coretree.defaultconfig.controller;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

//@Controller
public class LoginController {
	@RequestMapping(value = "/login?{param}", method = RequestMethod.GET)
	public String main(HttpServletResponse response, HttpServletRequest request, @PathVariable String param, Model model) {
		model.addAttribute("obj", param);
		return "login";
	}
}
