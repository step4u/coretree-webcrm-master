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
        @Result(property = "name", column = "name"),
        @Result(property = "title", column = "title"),
        @Result(property = "tel", column = "tel"),
        @Result(property = "cellular", column = "cellular"),
        @Result(property = "extension", column = "extension"),
        @Result(property = "roles", column = "roles")
      })
	@Select("select idx, id, pwd, name, extension from users")
	List<Member> findAll();
	
	@Select("select username, password from users where username = #{username}")
	Member findById(String username);
	
	@Select("select a.username from users a join extensions b on a.username=b.username where b.extension = #{ext}")
	Member findIdByExt(String ext);
	
	@Select("select b.extension, c.role from users a join extensions b on a.username=b.username join user_roles c on a.username=c.username where a.username = #{username}")
	Member findExtById(String username);
	
	@Select("select username from users where id = #{username}")
	Member getUsersById(String username);
	
	@Select("select count(idx) from users where username = #{username}")
	int chkById(String username);
	
/*	@Select("insert into (id, pwd, name, title, tel, cellular, extension, roles) values (#{id}, #{pwd}, #{name}, #{title}, #{tel}, #{cellular}, #{extension}, #{roles})")
	void addMember(Member meminfo);
	
	@Select("delete from users where id=#{id}")
	void delMember(String id);
	
	@Select("update users set id=#{id}, pwd=#{pwd}, name=#{name}, title=#{title}, tel=#{tel}, cellular=#{cellular}, extension=#{extension}, roles=#{roles}")
	void modiMember(Member meminfo);*/
}
