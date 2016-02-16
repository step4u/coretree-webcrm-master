package com.coretree.defaultconfig.controller;

import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

//@Controller
public class AuthController {
	@RequestMapping(value = "/CRM", method = RequestMethod.POST)
	public String main(Locale locale, Model model) {
		String url = "index";
		return url;
	}
}
