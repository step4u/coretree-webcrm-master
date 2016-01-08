package com.coretree.defaultconfig.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

@Mapper
public interface CustomerMapper {
	@Results({
        @Result(property = "idx", column = "idx"),
        @Result(property = "group_idx", column = "group_idx"),
        @Result(property = "custgroup_idx", column = "custgroup_idx"),
        @Result(property = "uname", column = "uname"),
        @Result(property = "posi", column = "posi"),
        @Result(property = "tel", column = "tel"),
        @Result(property = "cellular", column = "cellular"),
        @Result(property = "extension", column = "extension"),
        @Result(property = "email", column = "email")
      })
	
	@Select("select count(idx) from customers")
	int count();
	
	@Select("select first #{rowsperpage} skip (#{cuspage} * #{rowsperpage})idx, group_idx, custgroup_idx, uname, posi"
			+ " tel, cellular, extension, email from customers order by uname asc")
	List<Customer> findAll(int curpage, int rowsperpage);
	
	@Select("select first #{rowsperpage} skip (#{cuspage} * #{rowsperpage}) * from customers where uname = #{val} or extension = #{val}")
	List<Customer> findByNameOrExt(int curpage, int rowsperpage, String val);
	
	@Select("insert into "
			+ "(group_idx, custgroup_idx, uname, posi, tel, cellular, extension, email)"
			+ " values "
			+ "(#{group_idx}, #{custgroup_idx}, #{uname}, #{posi}, #{tel}, #{cellular}, #{extension}, #{email});")
	void add(Customer obj);
	
	@Select("delete from customers where idx=#{idx}")
	void del(int idx);
	
	@Select("update customers set group_idx=#{group_idx}, custgroup_idx=#{custgroup_idx}, uname=#{uname}, posi=#{posi}"
			+ ", tel=#{tel}, cellular=#{cellular}, extension=#{extension}, email=#{email} where idx=#{idx}")
	void modi(Customer obj);
}
