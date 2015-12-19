package com.coretree.helper;

import java.io.Closeable;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import org.firebirdsql.pool.FBWrappingDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.coretree.config.FirebirdSqlConfiguration;
import com.coretree.model.SqlParam;

public class FirebirdSqlHelper implements Closeable {

	@Autowired
	public FBWrappingDataSource dataSource;
	private Connection conn;
	private Statement stmt;
	private CallableStatement cstmt;
	private ResultSet rs;
	private String sql;
	private ArrayList<SqlParam> inparams;
	private QueryType qtype = QueryType.Q;
	private int timeout = 10;
	
	public FirebirdSqlHelper() throws SQLException {
	}
	
	public FirebirdSqlHelper(QueryType qtype, String sql, ArrayList<SqlParam> inparam) throws SQLException {
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(FirebirdSqlConfiguration.class);
		dataSource = (FBWrappingDataSource) context.getBean("dataSource");
		conn = dataSource.getConnection();
		this.qtype = qtype;
		this.sql = sql;
		this.inparams = inparam;
		
		this.SetQuery();
	}
	
	private void SetQuery() throws SQLException {
		switch (qtype) {
			case Q:
				stmt = conn.createStatement();
				stmt.setQueryTimeout(timeout);
				break;
			default:
				String strinparam = "";
				for (int i = 0 ; i < inparams.size() ; i++) {
					if (i == 0)
						strinparam += "?";
					else
						strinparam += ", ?";
				}
				
				String prepareStr = String.format("{call %s (%s)}", sql, strinparam);
				cstmt = conn.prepareCall(prepareStr);
				cstmt.setQueryTimeout(timeout);
				
				for (int i = 0 ; i < inparams.size() ; i++) {
					this.setValue(i, inparams.get(i));
				}
				break;
		}
	}
	
	private void setValue(int idx, SqlParam param) throws SQLException {
		switch (param.direction) {
			case 1:
				this.cstmt.setObject(idx, param.val, param.type);
				break;
			default:
				this.cstmt.registerOutParameter(idx, param.type);
				break;
		}
	}	
	
	public ResultSet GetRs() throws SQLException {
		switch (qtype) {
			case P:
				if (cstmt != null)
					rs = cstmt.getResultSet();
				break;
			default:
				if (stmt != null)
					rs = stmt.executeQuery(this.sql);
				break;
		}
		
		return rs;
	}
	
	@Override
	public void close() {
		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}			
		}
	}
	
	private enum QueryType{
		Q,
		P
	}
}
