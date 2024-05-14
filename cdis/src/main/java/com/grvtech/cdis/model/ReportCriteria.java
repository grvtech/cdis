package com.grvtech.cdis.model;

import com.grvtech.cdis.db.CdisDBridge;

public class ReportCriteria {
	private String name= null;
	private String section= null;
	private String operator = null;
	private String value = null;
	private String display = null;   //text to display in column header
	private String type = null;    //all|set to show if we can take all data or just a subset
	private String date = null;
	private String datedisplay = null;
	private String datename = null;
	private String dateoperator = null;
	private String datevalue = null;
	private String iddata	= null;
	private String format	= null;
	private String dateformat	= null;
	
	
	
	public String getFormat() {
		return format;
	}
	public void setFormat(String format) {
		this.format = format;
	}
	public String getDateformat() {
		return dateformat;
	}
	public void setDateformat(String dateformat) {
		this.dateformat = dateformat;
	}
	public String getIddata() {
		return iddata;
	}
	public void setIddata(String iddata) {
		this.iddata = iddata;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSection() {
		return section;
	}
	public void setSection(String section) {
		this.section = section;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getDisplay() {
		return display;
	}
	public void setDisplay(String display) {
		this.display = display;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getDatedisplay() {
		return datedisplay;
	}
	public void setDatedisplay(String datedisplay) {
		this.datedisplay = datedisplay;
	}
	public String getDatename() {
		return datename;
	}
	public void setDatename(String datename) {
		this.datename = datename;
	}
	public String getDateoperator() {
		return dateoperator;
	}
	public void setDateoperator(String dateoperator) {
		this.dateoperator = dateoperator;
	}
	public String getDatevalue() {
		return datevalue;
	}
	public void setDatevalue(String datevalue) {
		this.datevalue = datevalue;
	}
	
	
	
}
