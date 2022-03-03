package com.grvtech.cdis.model;

import java.util.HashMap;
import java.util.Hashtable;

import com.grvtech.cdis.db.ChbDBridge;

public class Role {
	private int idrole;
	private String name;
	private String code;
	
	public Role() {this.idrole=0;}
	
	public Role(int idrole, String name, String code){
		this.idrole = idrole;
		this.name = name;
		this.code = code;

	}

	public int getIdrole() {
		return idrole;
	}

	public void setIdrole(int idrole) {
		this.idrole = idrole;
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
	
	
	
}
