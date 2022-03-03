package com.grvtech.cdis.model;

import java.util.HashMap;

import com.grvtech.cdis.db.ChbDBridge;

public class Cisystem {
	private int idsystem;
	private String name;
	private String code;
	
	public Cisystem() {this.idsystem=0;}
	
	public void setCisystem(HashMap<String, String> sys){
		this.idsystem = Integer.parseInt(sys.get("idsystem"));
		this.name = sys.get("system_name");
		this.code = sys.get("system_code");
		
	}
	
	public Cisystem(int idsystem, String name, String code){
		this.idsystem = idsystem;
		this.name = name;
		this.code = code;
		
	}

	public int getIdsystem() {
		return idsystem;
	}

	public void setIdsystem(int idsystem) {
		this.idsystem = idsystem;
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
