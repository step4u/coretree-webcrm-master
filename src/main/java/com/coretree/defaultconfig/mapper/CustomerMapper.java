package com.coretree.defaultconfig.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
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
	
	@Select(value = "{ call GET_CUSTLIST ( #{curpage, mode=IN, jdbcType=INTEGER}, #{rowsperpage, mode=IN, jdbcType=INTEGER}, #{group, mode=IN, jdbcType=VARCHAR}, #{username, mode=IN, jdbcType=VARCHAR} ) }")
	@Options(statementType = StatementType.CALLABLE)
	List<Customer> findAll(@Param("curpage") int curpage
			, @Param("rowsperpage") int rowsperpage
			, @Param("group") String group
			, @Param("username") String username);
	
	@Select("select idx, iif(depthorder is null, '00', substring(depthorder from 1 for 1)) maingroup, iif(depthorder is null, '00', substring(depthorder from 2 for 1)) subgroup, uname, firm, posi, tel, cellular, extension, email"
			+ " from customers"
			+ " where uname like #{searchtxt}"
			+ " or tel like #{searchtxt}"
			+ " or cellular like #{searchtxt}"
			+ " or extension like #{searchtxt}"
			+ " or firm like #{searchtxt}")
	List<Customer> findByTxt(@Param("searchtxt") String searchtxt);
	
	@Select("select idx, iif(depthorder is null, '00', substring(depthorder from 1 for 1)) maingroup, iif(depthorder is null, '00', substring(depthorder from 2 for 1)) subgroup, username, uname, firm, posi, tel, cellular, extension, email"
			+ " from customers"
			+ " where idx = #{idx}")
	Customer findByIdx(@Param("idx") long idx);
	
	@Select("select first 1 idx, uname, firm, posi, tel, cellular, extension, email"
			+ " from customers"
			+ " where 1=1"
			+ " and tel like #{telnum}"
			+ " or cellular like #{telnum}"
			+ " or extension like #{telnum}")
	Customer findByExt(@Param("telnum") String telnum);
	
	@Insert("insert into customers "
			+ "(depthorder, username, firm, uname, posi, tel, cellular, extension, email)"
			+ " values "
			+ "(#{depthorder}, #{username, mode=IN, jdbcType=VARCHAR}, #{firm, mode=IN, jdbcType=VARCHAR}, #{uname, mode=IN, jdbcType=VARCHAR}, #{posi, mode=IN, jdbcType=VARCHAR}, #{tel, mode=IN, jdbcType=VARCHAR}, #{cellular, mode=IN, jdbcType=VARCHAR}, #{extension, mode=IN, jdbcType=VARCHAR}, #{email, mode=IN, jdbcType=VARCHAR});")
	void add(Customer cust);
	
	@Delete("delete from customers where idx=#{idx}")
	void del(int idx);
	
	@Delete("<script>"
			+ "delete from customers where "
			+ "<foreach collection=\"list\" item=\"item\">"
			+ "idx=#{item.idx}"
			+ "</foreach>"
			+ "</script>")
	void delAll(ArrayList<Customer> list);
	
	@Update("update customers set depthorder=#{depthorder}, username=#{username}, firm=#{firm}, uname=#{uname}, posi=#{posi}"
			+ ", tel=#{tel}, cellular=#{cellular}, extension=#{extension}, email=#{email} where idx=#{idx}")
	void modi(Customer obj);
	
	@Select("select depthorder, txt from groups where char_length(depthorder)>1 order by depthorder asc")
	List<Group> getGroup();
	
	@Select("select depthorder, iif(depthorder is null, '00', substring(depthorder from 1 for 1)) maingroup, iif(depthorder is null, '00', substring(depthorder from 2 for 1)) subgroup, txt from groups where char_length(depthorder)>1 and substring(depthorder from 1 for 1)=#{maingroup} order by depthorder asc")
	List<Group> getSubgroup(String maingroup);
}
