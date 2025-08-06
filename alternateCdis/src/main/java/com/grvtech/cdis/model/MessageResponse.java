package com.grvtech.cdis.model;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.grvtech.cdis.util.LanguageTool;

public class MessageResponse {
	private int status = 0;  // 0 failure  - 1 success
	private String message = "";
	private String language = "";
	private ArrayList<Object> objs =  new ArrayList<>();
	
	
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public ArrayList<Object> getObjs() {
		return objs;
	}

	public void setObjs(ArrayList<Object> objs) {
		this.objs = objs;
	}
	
	public MessageResponse(){}
	
	public  MessageResponse(Action act, boolean flag, String lang, ArrayList<Object> objs){
		this.language = lang;
		this.objs = objs;
		if(flag){
			this.status = 1;
			this.message = "";
		}else{
			this.status = 0;
			this.message = "error"; 
		}
	}

	public  MessageResponse(boolean flag, String lang, ArrayList<Object> objs){
		this.language = lang;
		this.objs = objs;
		if(flag){
			this.status = 1;
			this.message = "";
		}else{
			this.status = 0;
			this.message = "error"; 
		}
	}

	public  MessageResponse(String messageCode, boolean flag, String lang, ArrayList<Object> objs){
		this.language = lang;
		this.objs = objs;
		if(flag){
			this.status = 1;
			this.message = "";
		}else{
			this.status = 0;
			this.message = "error"; 
		}
	}
	
}
