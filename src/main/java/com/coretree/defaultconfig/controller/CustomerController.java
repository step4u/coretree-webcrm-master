package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Customer;
import com.coretree.defaultconfig.mapper.CustomerMapper;

@RestController
public class CustomerController {
	
	@Autowired
	CustomerMapper mapper;
	
	@RequestMapping(path="/customer/count/{group}", method=RequestMethod.GET)
	public int getCount(@PathVariable("group") String group, Principal principal) {
		String username = principal.getName();
		return mapper.count(group, username);
	}
	
	@RequestMapping(path="/customer/{group}/{curpage}/{rowsperpage}", method=RequestMethod.GET)
	public List<Customer> getAll(@PathVariable("group") String group
			, @PathVariable("curpage") int curpage
			, @PathVariable("rowsperpage") int rowsperpage
			, Principal principal) {
		String username = principal.getName();
		return mapper.findAll(curpage, rowsperpage, group, username);
	}
	
	@RequestMapping(path="/customer/{group}/{searchtxt}", method=RequestMethod.GET)
	public List<Customer> getByTxt(@PathVariable("searchtxt") String searchtxt) {
		return mapper.findByTxt("%" + searchtxt + "%");
	}
	
	@RequestMapping(path="/customer/add/{data}", method=RequestMethod.GET)
	public void add(@PathVariable("data") Customer data, Principal principal) {
		mapper.add(data);
	}
	
	@RequestMapping(path="/customer/modi/{group}/{data}", method=RequestMethod.GET)
	public void modi(@PathVariable("group") String group, @PathVariable("data") Customer data, Principal principal) {
		mapper.modi(data);
	}
	
	@RequestMapping(path="/customer/modi/{group}/{idx}", method=RequestMethod.GET)
	public void del(@PathVariable("group") String group, @PathVariable("idx") int idx, Principal principal) {
		mapper.del(idx);
	}
	
	@RequestMapping(path="/customer/get/group", method=RequestMethod.GET)
	public void del(Principal principal) {
		mapper.getGroup();
	}
}
