package com.grvtech.cdis.model;

public class Report {
	private String idreport;
	private String name;
	private String code;
	private String owner;
	private String date;
	
	
	public Report(String idreport, String name, String code, String owner,
			String date) {
		super();
		this.idreport = idreport;
		this.name = name;
		this.code = code;
		this.owner = owner;
		this.date = date;
	}
	public String getIdreport() {
		return idreport;
	}
	public void setIdreport(String idreport) {
		this.idreport = idreport;
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
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	
	
	
}
