package com.grvtech.cdis.model;

import java.util.ArrayList;

import com.grvtech.cdis.db.CdisDBridge;

public class Community {
	private String name;
	private String code;
	private int id;
	
	
	public Community(String name, String code, int id){
		this.name = name;
		this.code=code;
		this.id=id;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getCode() {
		return code;
	}


	public void setCode(String code) {
		this.code = code;
	}


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}
	
	
}
