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
	})
*/
	@Select(value = "{ call GET_CUSTLIST ( #{curpage, mode=IN, jdbcType=INTEGER}, #{rowsperpage, mode=IN, jdbcType=INTEGER}, #{group, mode=IN, jdbcType=VARCHAR}, #{username, mode=IN, jdbcType=VARCHAR} ) }")
	@Options(statementType = StatementType.CALLABLE)
	List<Customer> findAll(@Param("curpage") int curpage
			, @Param("rowsperpage") int rowsperpage
			, @Param("group") String group
			, @Param("username") String username);
	
	@Select("select a.idx, a.uname, a.firm_idx, a.posi, a.tel, a.cellular, a.extension, a.email"
			+ " from customers a join firms b"
			+ " on a.firm_idx=b.idx"
			+ " where a.uname like #{searchtxt}"
			+ " or a.tel like #{searchtxt}"
			+ " or a.cellular like #{searchtxt}"
			+ " or a.extension like #{searchtxt}"
			+ " or b.fname like #{searchtxt}")
	List<Customer> findByTxt(@Param("searchtxt") String searchtxt);
	
	@Insert("insert into customers "
			+ "(depthorder, username, firm_idx, uname, posi, tel, cellular, extension, email)"
			+ " values "
			+ "(#{depthorder}, #{username, mode=IN, jdbcType=VARCHAR}, #{firm_idx, mode=IN, jdbcType=VARCHAR}, #{uname, mode=IN, jdbcType=VARCHAR}, #{posi, mode=IN, jdbcType=VARCHAR}, #{tel, mode=IN, jdbcType=VARCHAR}, #{cellular, mode=IN, jdbcType=VARCHAR}, #{extension, mode=IN, jdbcType=VARCHAR}, #{email, mode=IN, jdbcType=VARCHAR});")
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
	
	@Update("update customers set depthorder=#{depthorder}, username=#{username}, firm_idx=#{firm_idx}, uname=#{uname}, posi=#{posi}"
			+ ", tel=#{tel}, cellular=#{cellular}, extension=#{extension}, email=#{email} where idx=#{idx}")
	void modi(Customer obj);
	
	@Select("select depthorder, txt from groups where char_length(depthorder)>1 order by depthorder asc")
	List<Group> getGroup();
}
