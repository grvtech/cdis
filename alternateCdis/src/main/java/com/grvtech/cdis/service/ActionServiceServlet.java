package com.grvtech.cdis.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.grvtech.cdis.controler.ActionProcessor;




public class ActionServiceServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final String pathPrefix = "/ncdis/service/action/";
	
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		PrintWriter out = response.getWriter();
	    String  actionString= request.getRequestURI();
	    int endIndex = -1;
	    String jsonString = ""; //by default print generic error message 
	    if(actionString.indexOf("?") >=0 ){
	    	endIndex = actionString.indexOf("?");
	    }
	    	    
	    String methodString = "";
	    if(endIndex == -1){
	    	methodString = actionString.substring(actionString.lastIndexOf("/")+1);
	    }else{
	    	methodString = actionString.substring(actionString.lastIndexOf("/")+1, endIndex);
	    }
	    
	    Class<ActionProcessor> cls = ActionProcessor.class;
	    Hashtable<String, String[]> postData = new Hashtable<String, String[]>();
	    postData = getParameters(request.getParameterMap());
	    
	    BufferedReader bf = request.getReader();
	    String rawStr = "";
	    String raw = null;
	    while((raw = bf.readLine()) != null ){
	    	rawStr+=raw;
	    }
		
		try {
			String[] rStr = {rawStr};
			postData.put("rawPost", rStr);
			
			String ipStr = getIpAddr(request);
			String[] ipStrArr = {ipStr};
			postData.put("ipuser", ipStrArr);
			
			String[] serverNameArr = {getServerName(request)};
			postData.put("server", serverNameArr);

			Method mtd = cls.getMethod(methodString,postData.getClass());
			Object clsObj = cls.newInstance();
			jsonString = (String) mtd.invoke(clsObj, postData);

		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		response.setContentType("application/json");
	    out.write(jsonString);
	    out.close();
	}
	
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    PrintWriter out = response.getWriter();
	    String  actionString= request.getRequestURI();
	    int endIndex = actionString.length();
	    String jsonString = ""; //by default print generic error message 
	    if(actionString.indexOf("?") >=0 ){
	    	endIndex = actionString.indexOf("?");
	    }
	    
	    
	    
	    String methodString = actionString.substring(actionString.lastIndexOf("/")+1, endIndex);
	    Class<ActionProcessor> cls = ActionProcessor.class;
	    Hashtable<String, String[]> postData = new Hashtable<String, String[]>();
	    postData = getParameters(request.getParameterMap());
		try {
			String ipStr = getIpAddr(request);
			String[] ipStrArr = {ipStr};
			if(methodString.indexOf("Session") > 0){
				postData.put("ipuser", ipStrArr);
			}
			String[] serverNameArr = {getServerName(request)};
			postData.put("server", serverNameArr);
			Method mtd = cls.getMethod(methodString,postData.getClass());
			Object clsObj = cls.newInstance();
			jsonString = (String) mtd.invoke(clsObj, postData);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		response.setContentType("application/json");
	    out.write(jsonString);
	    out.close();
	  }
	
	private Hashtable<String, String[]> getParameters(Map<String, String[]> params){
		Hashtable<String, String[]> result = new Hashtable<String, String[]>();
		Set<String> keys = params.keySet();
		Iterator<String> ki = keys.iterator();
		while(ki.hasNext()){
			String key = ki.next();
			result.put(key, params.get(key));
		}
		return result;
	}
	
	
	public String getIpAddr(HttpServletRequest request) {      
		   String ip = request.getHeader("x-forwarded-for");      
		   if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {      
		       ip = request.getHeader("Proxy-Client-IP");      
		   }      
		   if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {      
		       ip = request.getHeader("WL-Proxy-Client-IP");      
		   }      
		   if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {      
		       ip = request.getRemoteAddr();      
		   }      
		   return ip;      
		  
		} 
	
	public String getServerName(HttpServletRequest request) {
	    String serverName = request.getServerName();     
	    return serverName;
	}
	
}
