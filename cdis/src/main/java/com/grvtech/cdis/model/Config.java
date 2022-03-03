package com.grvtech.cdis.model;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class Config {
	
private String name;
private String type;
private String value;
private String[] options=null;

	public Config(){}
	public void setConfig(String line){
		/*name.type=value{option|option....}*/
		String[] sides = line.split("=");
		String left=sides[0];
		String right=sides[1];
		String[] lsides = left.split("\\.");
		
		this.name = lsides[0];
		this.type = lsides[1];
		String[] rsides = right.split("\\|");
		
		this.value = rsides[0];
		if(rsides.length > 1){
			this.options = rsides[1].split("\\;"); 
		}else{
			this.options = new String[0];
		}
	}

	public static String getPropertyConfig(String pName){
		String result = "";
		Object[] configs = getConfig();
		for(int i=0;i<configs.length;i++){
			Config c = (Config)configs[i];
			if(c.getName().equals(pName)){
				result = c.getValue();
				break;
			}
		}
		return result;
	}
	
	public static Object[] getConfig(){
		Context initContext;
		String rootPath="";
		String pathconfig="";
		ArrayList al  = new ArrayList();
		//Config[] configs = null;
		
		
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			pathconfig = (String)envContext.lookup("config-dir");
			
			rootPath = (String)envContext.lookup("root-folder");
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
	  	File fl = new File(rootPath+pathconfig+"cdis.config");
	  	
  		try {
  			if(fl.exists()){
  				FileReader fwr = new FileReader(fl);
  				BufferedReader bw = new BufferedReader(fwr);
  				while(bw.ready()){
  					String line = bw.readLine();
  					//System.out.println("LINE CONFIG:"+line);
  					Config c = new Config();
  					c.setConfig(line);
  					al.add(c);
  				}
			}
  		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		al.trimToSize();
		Object[] configs = al.toArray();
		return configs;
	}

	
	
	
	public static void saveConfig(Config[] configs){
		Context initContext;
		String rootPath="";
		String pathconfig="";
		try {
			initContext = new InitialContext();
			Context envContext  = (Context)initContext.lookup("java:comp/env");
			pathconfig = (String)envContext.lookup("config-dir");
			
			rootPath = (String)envContext.lookup("root-folder");
		} catch (NamingException e1) {
			e1.printStackTrace();
		}
	  	File fl = new File(rootPath+pathconfig+"cdis.config");
  		try {
  			if(fl.exists()){
  				FileWriter fwr = new FileWriter(fl);
  				BufferedWriter bw = new BufferedWriter(fwr);
				for(int i=0;i<configs.length;i++){
					Config c = configs[i];
					String line =c.getName()+"."+c.getType()+"="+c.getValue();
					
					if(c.getOptions().length > 0){
						line+="|";
						int l = c.getOptions().length;
						for(int j=0;j<l;j++){
							String op = c.getOptions()[j];
							String s = ";";
							if(j == l-1){
								s="";
							}
							line+=op+s;
						}
					}
					bw.write(line);
					bw.newLine();
				}
				bw.close();
			}
  		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String[] getOptions() {
		return options;
	}

	public void setOptions(String[] options) {
		this.options = options;
	}
	
	
	
}
