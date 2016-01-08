package com.coretree.defaultconfig.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

@Mapper
public interface MemberMapper {
	@Results({
        @Result(property = "username", column = "username"),
        @Result(property = "password", column = "password"),
        @Result(property = "uname", column = "uname"),
        @Result(property = "posi", column = "posi"),
        @Result(property = "tel", column = "tel"),
        @Result(property = "cellular", column = "cellular"),
        @Result(property = "extension", column = "extension"),
        @Result(property = "role", column = "role"),
        @Result(property = "status", column = "status")
      })
	@Select("select username, password, uname, extension from users")
	List<Member> findAll();
	
	@Select("select username, password, uname, extension, role from users where username = #{id}")
	Member findById(String id);
	
	@Select("select a.username, b.extension from users a join extensions b on a.username=b.username where b.extension = #{ext}")
	Member findIdByExt(String ext);
	
	@Select("select a.username, a.role, b.extension from users a join USERS_EXTS b on a.username=b.username where a.username = #{id}")
	Member findExtById(String id);
	
	@Select("select username from users where username=#{id}")
	Member getUsersById(String id);
	
	@Select("select count(username) from users where username=#{id}")
	int chkById(String id);
	
	@Select("insert into (username, password, uname, posi, tel, cellular, role) values (#{username}, #{password}, #{uname}, #{posi}, #{tel}, #{cellular}, #{role});"
			+ ""
			)
	void addMember(Member meminfo);
	
	@Select("delete from users where username=#{id}")
	void delMember(String id);
	
	@Select("update users set username=#{id}, password=#{pwd}, uname=#{name}, posi=#{posi}, tel=#{tel}, cellular=#{cellular}, roles=#{roles}")
	void modiMember(Member meminfo);
}
