package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.ExtStateMapper;
import com.coretree.defaultconfig.mapper.Extension;
import com.coretree.defaultconfig.mapper.ExtensionMapper;

@RestController
public class ExtStateController {
	
	@Autowired
	ExtStateMapper mapper;
	
	@RequestMapping(path="/extstate/get/all", method=RequestMethod.GET)
	public List<Extension> getAll(Principal principa) {
		return mapper.getAll();
	}
}
