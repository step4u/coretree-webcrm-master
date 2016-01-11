package com.coretree.defaultconfig.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.mapping.StatementType;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

import com.coretree.defaultconfig.model.Group;

@Mapper
public interface CustomerMapper {
	// @Result(column = "tcount")
	@Select(value = "{ call GET_CUSTCOUNT ( #{group, mode=IN, jdbcType=VARCHAR}, #{username, mode=IN, jdbcType=VARCHAR} ) }")
	@Options(statementType = StatementType.CALLABLE)
	int count(@Param("group") String group, @Param("username") String username);
	
/*	@Results({
        @Result(property = "idx", column = "idx"),
        @Result(property = "groups_idx", column = "groups_idx"),
        @Result(property = "customgroups_idx", column = "customgroups_idx"),
        @Result(property = "uname", column = "uname"),
        @Result(property = "company", column = "company"),
        @Result(property = "posi", column = "posi"),
        @Result(property = "tel", column = "tel"),
        @Result(property = "cellular", column = "cellular"),
        @Result(property = "extension", column = "extension"),
        @Result(property = "email", column = "email")
	})*/
	@Select(value = "{ call GET_CUSTLIST ( #{curpage, mode=IN, jdbcType=INTEGER}, #{rowsperpage, mode=IN, jdbcType=INTEGER}, #{group, mode=IN, jdbcType=VARCHAR}, #{username, mode=IN, jdbcType=VARCHAR} ) }")
	@Options(statementType = StatementType.CALLABLE)
	List<Customer> findAll(@Param("curpage") int curpage
			, @Param("rowsperpage") int rowsperpage
			, @Param("group") String group
			, @Param("username") String username);
	
/*	@Results({
        @Result(property = "idx", column = "idx"),
        @Result(property = "groups_idx", column = "groups_idx"),
        @Result(property = "customgroups_idx", column = "customgroups_idx"),
        @Result(property = "uname", column = "uname"),
        @Result(property = "posi", column = "posi"),
        @Result(property = "tel", column = "tel"),
        @Result(property = "cellular", column = "cellular"),
        @Result(property = "extension", column = "extension"),
        @Result(property = "email", column = "email")
	})*/
	@Select("select idx, uname, company, posi, tel, cellular, extension, email from customers"
			+ " where uname like #{searchtxt}"
			+ " or tel like #{searchtxt}"
			+ " or cellular like #{searchtxt}"
			+ " or extension like #{searchtxt}"
			+ " or company like #{searchtxt}")
	List<Customer> findByTxt(@Param("searchtxt") String searchtxt);
	
	@Insert("insert into "
			+ "(group_idx, custgroup_idx, uname, posi, tel, cellular, extension, email)"
			+ " values "
			+ "(#{group_idx}, #{custgroup_idx}, #{uname}, #{posi}, #{tel}, #{cellular}, #{extension}, #{email});")
	void add(Customer obj);
	
	@Delete("delete from customers where idx=#{idx}")
	void del(int idx);
	
	@Update("update customers set group_idx=#{group_idx}, custgroup_idx=#{custgroup_idx}, uname=#{uname}, posi=#{posi}"
			+ ", tel=#{tel}, cellular=#{cellular}, extension=#{extension}, email=#{email} where idx=#{idx}")
	void modi(Customer obj);
	
	@Select("select depthorder, txt from groups where char_length(depthorder)>1 order by depthorder asc")
	Group getGroup();
}
