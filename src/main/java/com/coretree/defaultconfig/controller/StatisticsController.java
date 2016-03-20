package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.StatisticsMapper;
import com.coretree.defaultconfig.model.StatisticsSearchConditions;
import com.coretree.defaultconfig.mapper.Cdr;

@RestController
public class StatisticsController {
	
	@Autowired
	StatisticsMapper mapper;
	
	@RequestMapping(path="/statistics/get/all", method=RequestMethod.POST)
	public List<Cdr> getAll(StatisticsSearchConditions condition, Principal principal) {
		return mapper.getAll(condition);
	}
}
