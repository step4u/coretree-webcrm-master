package com.coretree.defaultconfig.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

@Mapper
public interface MemberMapper {
	@Results({
        @Result(property = "id", column = "id"),
        @Result(property = "pwd", column = "pwd"),
        @Result(property = "name", column = "name"),
        @Result(property = "title", column = "title"),
        @Result(property = "tel", column = "tel"),
        @Result(property = "cellular", column = "cellular"),
        @Result(property = "extension", column = "extension"),
        @Result(property = "roles", column = "roles")
      })
	@Select("select idx, id, pwd, name, extension from users")
	List<Member> findAll();
	
	@Select("select id, pwd, name, extension, roles from users where id = #{id}")
	Member findById(String id);
	
	@Select("select a.id, b.extension from users a join extensions b on a.idx=b.user_idx where b.extension = #{ext}")
	Member findIdByExt(String ext);
	
	@Select("select a.id, a.roles, b.extension from users a join extensions b on a.idx=b.user_idx where a.id = #{id}")
	Member findExtById(String id);
	
	@Select("select id as username from users where id = #{id}")
	Member getUsersById(String id);
	
	@Select("select count(idx) from users where id = #{id}")
	int chkById(String id);
	
	@Select("insert into (id, pwd, name, title, tel, cellular, extension, roles) values (#{id}, #{pwd}, #{name}, #{title}, #{tel}, #{cellular}, #{extension}, #{roles})")
	void addMember(Member meminfo);
	
	@Select("delete from users where id=#{id}")
	void delMember(String id);
	
	@Select("update users set id=#{id}, pwd=#{pwd}, name=#{name}, title=#{title}, tel=#{tel}, cellular=#{cellular}, extension=#{extension}, roles=#{roles}")
	void modiMember(Member meminfo);
}
