package com.grvtech.cdis.model;

public class ValueLimit {
	private String minvalue;
	private String maxvalue;
	private String startvalue;
	private String endvalue;
	public ValueLimit(String minvalue, String maxvalue, String startvalue,
			String endvalue) {
		super();
		this.minvalue = minvalue;
		this.maxvalue = maxvalue;
		this.startvalue = startvalue;
		this.endvalue = endvalue;
	}
	public String getMinvalue() {
		return minvalue;
	}
	public void setMinvalue(String minvalue) {
		this.minvalue = minvalue;
	}
	public String getMaxvalue() {
		return maxvalue;
	}
	public void setMaxvalue(String maxvalue) {
		this.maxvalue = maxvalue;
	}
	public String getStartvalue() {
		return startvalue;
	}
	public void setStartvalue(String startvalue) {
		this.startvalue = startvalue;
	}
	public String getEndvalue() {
		return endvalue;
	}
	public void setEndvalue(String endvalue) {
		this.endvalue = endvalue;
	}
	
	
	
	
}
