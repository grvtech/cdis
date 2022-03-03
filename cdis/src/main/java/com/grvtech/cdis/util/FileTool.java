package com.grvtech.cdis.util;

/**
 * <p>Title: Diabetes Informational System</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2004</p>
 * <p>Company: </p>
 * @author not attributable
 * @version 1.0
 */

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Properties;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;

public class FileTool {
  public FileTool() {
  }

  public static String getReport(String filename){
    String rez="";
    String str;

    try {
      BufferedReader bfsql = new BufferedReader( new FileReader(filename));
      while((str=bfsql.readLine())!=null)
      rez+=str;
    }
    catch (Exception ex) {
      
    }

    return rez;
  }
  
  
  public static String getReportsFolder(){
	  	InitialContext ic;
	  	String result = "";
		try {
			ic = new InitialContext();
			String rf = (String) ic.lookup("reports-folder");
			File reportFile = new File(rf);
			if(reportFile.exists()){
				result  = reportFile.getAbsolutePath();
			}
			
		} catch (NamingException e) {
			e.printStackTrace();
		}
		
		return result;
  }
  
  
  public static String getMessage(String pathfile){
  	File fl = new File(pathfile);
  	String message="";
  	if(fl.exists()){
  		try {
			BufferedReader br = new BufferedReader(new FileReader(fl));
			while(br.ready()){
				message+=br.readLine()+"\n";
			}
			br.close();
		} catch (FileNotFoundException e) {
			
		} catch (IOException e) {
			
		}
  	}else{
  		try {
			fl.createNewFile();
			
		} catch (IOException e) {
			
		}
  	}
  	return message;
  }

  public static String getEmailProperty(String propertyName){
	  String result = "";
	  InitialContext ic;
	  InputStream input = null;
		try {
			ic = new InitialContext();
			String rf = (String) ic.lookup("root-folder");
			File emailConfig = new File(rf+System.getProperty("file.separator")+"config"+System.getProperty("file.separator")+"email.config");
			if(!emailConfig.exists()){
				return "";
			}
			Properties prop = new Properties();
			input = new FileInputStream(emailConfig);
			prop.load(input);
			result = prop.getProperty(propertyName);

		} catch (NamingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	 
	  	return result;
	  }
  
  
  public String getWebMessage(String pathfile){
  	
  	File fl = new File(pathfile);
  	String message="";
  	if(fl.exists()){
  		try {
			BufferedReader br = new BufferedReader(new FileReader(fl));
			while(br.ready()){
				message+=br.readLine()+"<br>";
			}
			br.close();
		} catch (FileNotFoundException e) {
			
		} catch (IOException e) {
			
		}
  	}else{
  		try {
			fl.createNewFile();
			
		} catch (IOException e) {
			
		}
  	}
  	return message;
  }
  
  
  public static void setMessage(String pathfile,String message){
  	File fl = new File(pathfile);
  	try {
			if(fl.exists()){
				BufferedWriter bw = new BufferedWriter(new FileWriter(fl));
				bw.write(message);
				bw.close();
			}
		} catch (FileNotFoundException e) {
			
		} catch (IOException e) {
			
		}
  }
  
  public static String getNow(){
	Calendar cal = new GregorianCalendar();
	String now = cal.get(Calendar.YEAR)+"-"+cal.get(Calendar.MONTH)+"-"+cal.get(Calendar.DAY_OF_MONTH);
	return now;
}
  
  public static String getTimeNow(){
	Calendar cal = new GregorianCalendar();
	String now = cal.get(Calendar.HOUR_OF_DAY)+":"+cal.get(Calendar.MINUTE)+":"+cal.get(Calendar.SECOND);
	return now;
}
  
  public String getScriptName(HttpServletRequest request){
  	String result = "";
  	String uri = request.getRequestURI();
  	String[] tabs = uri.split("/");
  	result = tabs[tabs.length-1].substring(0,tabs[tabs.length-1].indexOf("."));
  	return result;
  }
  
  public static String readContentFromFile(String fileName)
	{
	    StringBuffer contents = new StringBuffer();
	    
	    try {
	      //use buffering, reading one line at a time
	      BufferedReader reader =  new BufferedReader(new FileReader(fileName));
	      try {
	        String line = null; 
	        while (( line = reader.readLine()) != null){
	          contents.append(line);
	          contents.append(System.getProperty("line.separator"));
	        }
	      }
	      finally {
	          reader.close();
	      }
	    }
	    catch (IOException ex){
	      ex.printStackTrace();
	    }
	    return contents.toString();
	}
  
}