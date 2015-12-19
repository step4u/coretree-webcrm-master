package com.coretree.helper;

import java.io.Closeable;
import java.io.IOException;

import org.firebirdsql.pool.FBWrappingDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.coretree.config.FirebirdSqlConfiguration;

public class FirebirdSqlHelper implements Closeable {

	@Autowired
	public FBWrappingDataSource dataSource;
			
	public FirebirdSqlHelper() {
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(FirebirdSqlConfiguration.class);
		dataSource = (FBWrappingDataSource) context.getBean("dataSource");
		// System.err.println("FirebirdSqlHelper Constructor, dataSource : " + dataSource.getDatabase());
	}
	
	@Override
	public void close() throws IOException {
		// TODO Auto-generated method stub
		
	}

}
