package com.coretree.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.mapper.Member;
import com.coretree.mapper.MemberMapper;


@RestController
public class MemberController {
	
	@Autowired
	MemberMapper memberMapper;
	
	@RequestMapping("members")
	public List<Member> members() {
		return memberMapper.findAll();
	}
	
	@RequestMapping("member/{id}")
	public Member member(@PathVariable("id") Long id) {
		return memberMapper.findById(id);
	}
}
