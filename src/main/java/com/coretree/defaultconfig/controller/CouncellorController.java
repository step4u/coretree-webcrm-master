package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Counsellor;
import com.coretree.defaultconfig.mapper.CounsellorMapper;
import com.coretree.defaultconfig.model.SearchConditions;

@RestController
public class CouncellorController {
	
	@Autowired
	CounsellorMapper mapper;
	
	@RequestMapping(path="/counsellor/get/count", method=RequestMethod.POST)
	public int getCount(@RequestBody SearchConditions condition, Principal principal) {
		return mapper.count(condition);
	}
	
	@RequestMapping(path="/counsellor/get/all", method=RequestMethod.POST)
	public List<Counsellor> getAll(@RequestBody SearchConditions condition, Principal principal) {
		return mapper.selectAll(condition);
	}
	
	@RequestMapping(path="/counsellor/del/{username}", method=RequestMethod.GET)
	public void remove(@PathVariable("username") String username, Principal principal) {
		mapper.del(username);
	}
	
	@RequestMapping(path="/counsellor/del/all", method=RequestMethod.POST)
	public void removeAll(ArrayList<Counsellor> list, Principal principal) {
		for(Counsellor counsellor : list) {
			mapper.del(counsellor.getUsername());
		}
	}
}
