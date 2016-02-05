package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Member;
import com.coretree.defaultconfig.mapper.MemberMapper;
import com.coretree.defaultconfig.model.LoginResult;

@RestController
public class MemberController {
	
	@Autowired
	MemberMapper mapper;
	
	@RequestMapping(path="/member/get/count", method=RequestMethod.GET)
	public int getCount(Principal principal) {
		return mapper.count();
	}
	
	@RequestMapping(path="/member/get/all/{curpage}/{rowsperpage}", method=RequestMethod.GET)
	public List<Member> getMembers(@PathVariable("curpage") int curpage, @PathVariable("rowsperpage") int rowsperpage, Principal principa) {
		return mapper.selectAll(curpage, rowsperpage);
	}

	@RequestMapping("/member/get/{username}")
	public Member getMemberInfo(@PathVariable("username") String username, Principal principa) {
		return mapper.selectByIdx(username);
	}
	
	@RequestMapping("/member/get/search/{txt}")
	public List<Member> getMemberByTxt(@PathVariable("txt") String txt, Principal principal) {
		return mapper.selectByTxt("%" + txt + "%");
	}
	
	@RequestMapping(value = "/member/chk/{username}", method = RequestMethod.GET)
	public String chkId(@PathVariable("username") String username, Principal principal) {
		String result = String.format("{\"result\": %d}", mapper.chkById(username));
		return result;
	}
	
	@RequestMapping(value = "/member/add", method = RequestMethod.POST)
	public void addMember(Member memberinfo, Principal principal) {
		mapper.add(memberinfo);
	}
	
	@RequestMapping(value = "/member/del/{id}", method = RequestMethod.GET)
	public void delMember(@PathVariable("id") String id, Principal principal) {
		mapper.del(id);
	}
	
	@RequestMapping(value = "/member/modi", method = RequestMethod.POST)
	public void modiMember(Member memberinfo) {
		mapper.modi(memberinfo);
	}
}
