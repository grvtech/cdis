package com.grvtech.cdis.model;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Properties;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import com.grvtech.cdis.util.FileTool;

public class Renderer {
	private static String[] operatorsStr = new String[] {"equal", "more than", "less than", "between", "starting", "until", "multi"};
	private static String[] operatorsOp = new String[] {"=",">=","<=","between",">=","<=", "in"};
	
	private static String[] valueStr = new String[] {"90.0", "90.1"};
	private static String[] valueValue = new String[] {"('1','2','3','4','10','11')", "('1','2')"};
	
	
	public static String renderOperator(String opStr){
		
		//System.out.println("OPERATOR : "+opStr);
		String result = "=";
		int index = Arrays.asList(operatorsStr).indexOf(opStr);
		if(index >= 0){
			result = operatorsOp[index];
		}
		return result;
	}
	
	public static String renderValue(String valStr){
		String result = "( )";
		int index = Arrays.asList(valueStr).indexOf(valStr);
		if(index >= 0){
			result = valueValue[index];
		}
		return result;
	}
	
	
	public static String renderName(String name){
		String result = "";
		InitialContext ic;
		try {
			ic = new InitialContext();
			String rf = (String) ic.lookup("root-folder");
			File fieldsFile = new File(rf+System.getProperty("file.separator")+"content"+System.getProperty("file.separator")+"fields.properties");
			
			FileInputStream fileInput = new FileInputStream(fieldsFile);
			Properties properties = new Properties();
			properties.load(fileInput);
			fileInput.close();

			Enumeration<Object> enuKeys = properties.keys();
			while (enuKeys.hasMoreElements()) {
				String key = (String) enuKeys.nextElement();
				if(key.equals(name)){
					result = properties.getProperty(key);
					break;
				}
			}
		} catch (NamingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}
}
