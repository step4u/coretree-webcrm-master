package com.coretree.defaultconfig.controller;

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
	MemberMapper memberMapper;
	
	@RequestMapping("/member/all")
	public List<Member> getMembers() {
		return memberMapper.findAll();
	}

	@RequestMapping("/member/get/{id}")
	public Member getMemberInfo(@PathVariable("id") String id) {
		return memberMapper.findById(id);
	}
	
	@RequestMapping(value = "/member/login/{id}/{pass}", method = RequestMethod.POST)
	public LoginResult login(@PathVariable("id") String id, @PathVariable("pass") String pass) {
		Member member = memberMapper.findById(id);
		LoginResult result = new LoginResult();
		System.err.println(id + "//" + pass + "/##/" + member.getId() + "//" + member.getPwd());
		result.result = pass.equals(member.getPwd()) && id.equals(member.getId());
		result.name = member.getName();
		result.id = member.getId();
		result.extension = member.getExtension();
		result.roles = member.getRoles();
		return result;
	}
	
	@RequestMapping("/member/chk/{id}")
	public String chkId(@PathVariable("id") String id) {
		String result = String.format("{\"result\":%d}", memberMapper.chkById(id));
		return result;
	}
	
	@RequestMapping(value = "/member/add/{memberinfo}", method = RequestMethod.POST)
	public void addMember(@PathVariable("memberinfo") Member memberinfo) {
		memberMapper.addMember(memberinfo);
	}
	
	@RequestMapping(value = "/member/del/{id}", method = RequestMethod.GET)
	public void delMember(@PathVariable("id") String id) {
		memberMapper.delMember(id);
	}
	
	@RequestMapping(value = "/member/modi/{memberinfo}", method = RequestMethod.POST)
	public void modiMember(@PathVariable("memberinfo") Member memberinfo) {
		memberMapper.modiMember(memberinfo);
	}
}
