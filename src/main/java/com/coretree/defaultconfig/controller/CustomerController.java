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
import com.coretree.defaultconfig.model.Group;

@RestController
public class CustomerController {
	
	@Autowired
	CustomerMapper mapper;
	
	@RequestMapping(path="/customer/get/count/{group}", method=RequestMethod.GET)
	public int getCount(@PathVariable("group") String group, Principal principal) {
		String username = principal.getName();
		return mapper.count(group, username);
	}
	
	@RequestMapping(path="/customer/get/page/{group}/{curpage}/{rowsperpage}", method=RequestMethod.GET)
	public List<Customer> getAll(@PathVariable("group") String group
			, @PathVariable("curpage") int curpage
			, @PathVariable("rowsperpage") int rowsperpage
			, Principal principal) {
		String username = principal.getName();
		return mapper.findAll(curpage, rowsperpage, group, username);
	}
	
	@RequestMapping(path="/customer/get/idx/{idx}", method=RequestMethod.GET)
	public Customer getByIdx(@PathVariable("idx") long idx, Principal principal) {
		return mapper.findByIdx(idx);
	}
	
	@RequestMapping(path="/customer/get/search/{group}/{searchtxt}", method=RequestMethod.GET)
	public List<Customer> getByTxt(@PathVariable("searchtxt") String searchtxt, Principal principal) {
		return mapper.findByTxt("%" + searchtxt + "%");
	}
	
	@RequestMapping(path="/customer/get/group", method=RequestMethod.GET)
	public List<Group> getGroup(Principal principal) {
		return mapper.getGroup();
	}
	
	@RequestMapping(path="/customer/add/", method=RequestMethod.POST)
	public void add(Customer cust, Principal principal) {
		//System.err.print(cust.toString());
		//System.err.print(principal.getName());
		mapper.add(cust);
	}
	
	@RequestMapping(path="/customer/modi/", method=RequestMethod.POST)
	public void modi(Customer cust, Principal principal) {
		mapper.modi(cust);
	}
	
	@RequestMapping(path="/customer/del/{idx}", method=RequestMethod.GET)
	public void del(@PathVariable("idx") int idx, Principal principal) {
		mapper.del(idx);
	}
	
	@RequestMapping(path="/customer/del/all", method=RequestMethod.POST)
	public void del(ArrayList<Customer> custs, Principal principal) {
		mapper.delAll(custs);
	}
}
