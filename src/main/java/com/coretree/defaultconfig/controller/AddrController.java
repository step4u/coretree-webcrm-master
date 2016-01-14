package com.coretree.defaultconfig.controller;

import java.util.Locale;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class AddrController {
	@RequestMapping(value = "/addr/get", method = RequestMethod.GET)
	public String main(Locale locale, Model model) {
		return "index";
	}
}
